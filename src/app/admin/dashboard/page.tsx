'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogOut, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { supabase, formatIQD } from '@/lib/supabase';
import { Category, MenuItem } from '@/lib/types';
import ItemModal, { ItemFormData } from '@/components/admin/ItemModal';
import DeleteDialog from '@/components/admin/DeleteDialog';
import CategoryModal, { CategoryFormData } from '@/components/admin/CategoryModal';
import { mockCategories, mockMenuItems } from '@/lib/mock-data';

const USE_MOCK =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT_ID');

export default function AdminDashboard() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<MenuItem | null>(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);

    // Delete state for Items
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Delete state for Categories
    const [deleteCatOpen, setDeleteCatOpen] = useState(false);
    const [deleteCatTarget, setDeleteCatTarget] = useState<Category | null>(null);
    const [deletingCat, setDeletingCat] = useState(false);

    // Filter and Tabs
    const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
    const [filterCat, setFilterCat] = useState('all');

    // Auth check
    useEffect(() => {
        if (!USE_MOCK) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (!session) router.replace('/admin/login');
            });
        }
    }, [router]);

    const loadData = useCallback(async () => {
        setLoading(true);
        if (USE_MOCK) {
            await new Promise((r) => setTimeout(r, 400));
            setCategories(mockCategories);
            setItems(mockMenuItems);
            setLoading(false);
            return;
        }
        const [{ data: cats }, { data: menuItems }] = await Promise.all([
            supabase.from('categories').select('*').order('sort_order'),
            supabase.from('menu_items').select('*, categories(*)').order('sort_order'),
        ]);
        if (cats) setCategories(cats);
        if (menuItems) setItems(menuItems);
        setLoading(false);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const filteredItems =
        filterCat === 'all' ? items : items.filter((i) => i.category_id === filterCat);

    // ---------- CRUD Handlers ----------

    async function handleSave(data: ItemFormData, imageFile?: File) {
        setSaving(true);
        let imageUrl = data.image_url;

        if (USE_MOCK) {
            // Optimistic mock update
            const newItem: MenuItem = {
                id: data.id ?? `mock-${Date.now()}`,
                category_id: data.category_id,
                name: data.name,
                name_ar: data.name_ar,
                description: data.description || null,
                description_ar: data.description_ar || null,
                price: Number(data.price),
                image_url: imageFile ? URL.createObjectURL(imageFile) : data.image_url || null,
                is_available: data.is_available,
                sort_order: 0,
                created_at: new Date().toISOString(),
            };
            setItems((prev) =>
                data.id
                    ? prev.map((i) => (i.id === data.id ? newItem : i))
                    : [...prev, newItem]
            );
            setSaving(false);
            setModalOpen(false);
            setEditItem(null);
            return;
        }

        // Real Supabase path
        if (imageFile) {
            const ext = imageFile.name.split('.').pop();
            const path = `menu/${Date.now()}.${ext}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('menu-images')
                .upload(path, imageFile, { upsert: true });

            if (uploadError) {
                console.error("Image upload failed:", uploadError);
            } else if (uploadData) {
                const { data: urlData } = supabase.storage
                    .from('menu-images')
                    .getPublicUrl(path);
                imageUrl = urlData.publicUrl;
            }
        }

        const payload = {
            name: data.name,
            name_ar: data.name_ar,
            description: data.description || null,
            description_ar: data.description_ar || null,
            category_id: data.category_id,
            price: Number(data.price),
            image_url: imageUrl || null,
            is_available: data.is_available,
        };

        if (data.id) {
            await supabase.from('menu_items').update(payload).eq('id', data.id);
        } else {
            await supabase.from('menu_items').insert(payload);
        }

        await loadData();
        setSaving(false);
        setModalOpen(false);
        setEditItem(null);
    }

    async function handleSaveCategory(data: CategoryFormData) {
        setSaving(true);

        if (USE_MOCK) {
            const newCat: Category = {
                id: data.id ?? `mock-cat-${Date.now()}`,
                name: data.name,
                name_ar: data.name_ar,
                sort_order: data.sort_order,
                created_at: new Date().toISOString(),
            };
            setCategories((prev) =>
                data.id
                    ? prev.map((c) => (c.id === data.id ? newCat : c))
                    : [...prev, newCat].sort((a, b) => a.sort_order - b.sort_order)
            );
            setSaving(false);
            setCategoryModalOpen(false);
            setEditCategory(null);
            return;
        }

        const payload = {
            name: data.name,
            name_ar: data.name_ar,
            sort_order: data.sort_order,
        };

        if (data.id) {
            await supabase.from('categories').update(payload).eq('id', data.id);
        } else {
            await supabase.from('categories').insert(payload);
        }

        await loadData();
        setSaving(false);
        setCategoryModalOpen(false);
        setEditCategory(null);
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);

        if (USE_MOCK) {
            setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
        } else {
            await supabase.from('menu_items').delete().eq('id', deleteTarget.id);
            await loadData();
        }

        setDeleting(false);
        setDeleteOpen(false);
        setDeleteTarget(null);
    }

    async function handleDeleteCategory() {
        if (!deleteCatTarget) return;
        setDeletingCat(true);

        if (USE_MOCK) {
            setCategories((prev) => prev.filter((i) => i.id !== deleteCatTarget.id));
        } else {
            await supabase.from('categories').delete().eq('id', deleteCatTarget.id);
            await loadData();
        }

        setDeletingCat(false);
        setDeleteCatOpen(false);
        setDeleteCatTarget(null);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.replace('/admin/login');
    }

    // ---------- Render ----------
    return (
        <div style={{ minHeight: '100dvh', background: 'var(--color-bg)' }}>
            {/* Top bar */}
            <header
                style={{
                    background: 'var(--color-surface)',
                    borderBottom: '1px solid var(--color-border)',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    backdropFilter: 'blur(12px)',
                }}
            >
                <div
                    style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: 'linear-gradient(135deg, #c8860a, #f0a830)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, flexShrink: 0,
                    }}
                >🫖</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>
                        لوحة الإدارة
                    </div>
                    <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: 'var(--color-text-muted)' }}>
                        {USE_MOCK ? '(وضع تجريبي)' : 'مطعم بيت الكرم'}
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                        borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        color: 'var(--color-text-muted)', fontSize: 13,
                        fontFamily: "'Cairo', sans-serif",
                    }}
                >
                    <LogOut size={15} />
                    خروج
                </button>
            </header>

            <main style={{ maxWidth: 760, margin: '0 auto', padding: '20px 14px 60px' }}>
                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
                    {[
                        { label: 'إجمالي الأطباق', value: items.length, icon: '🍽️' },
                        { label: 'الفئات', value: categories.length, icon: '📋' },
                        { label: 'المتاحة', value: items.filter((i) => i.is_available).length, icon: '✅' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            style={{
                                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                borderRadius: 16, padding: '14px 12px', textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
                            <div style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--color-primary-light)' }}>{stat.value}</div>
                            <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
                    <button
                        onClick={() => setActiveTab('items')}
                        style={{
                            padding: '8px 16px', borderRadius: 20, fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 14,
                            background: activeTab === 'items' ? 'var(--color-primary)' : 'transparent',
                            color: activeTab === 'items' ? '#fff' : 'var(--color-text-muted)',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        الأطباق
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        style={{
                            padding: '8px 16px', borderRadius: 20, fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 14,
                            background: activeTab === 'categories' ? 'var(--color-primary)' : 'transparent',
                            color: activeTab === 'categories' ? '#fff' : 'var(--color-text-muted)',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        الفئات والأقسام
                    </button>
                </div>

                {/* Toolbar */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                    {activeTab === 'items' ? (
                        <>
                            {/* Category filter */}
                            <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
                                <select
                                    className="admin-input"
                                    value={filterCat}
                                    onChange={(e) => setFilterCat(e.target.value)}
                                    style={{ paddingLeft: 32 }}
                                >
                                    <option value="all">جميع الفئات</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name_ar}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                            </div>

                            {/* Add Item button */}
                            <button
                                className="btn-primary"
                                style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px' }}
                                onClick={() => { setEditItem(null); setModalOpen(true); }}
                            >
                                <Plus size={16} />
                                إضافة طبق
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                            {/* Add Category button */}
                            <button
                                className="btn-primary"
                                style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px' }}
                                onClick={() => { setEditCategory(null); setCategoryModalOpen(true); }}
                            >
                                <Plus size={16} />
                                إضافة فئة أو قسم جديد
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontFamily: "'Cairo', sans-serif" }}>
                        جاري التحميل...
                    </div>
                ) : activeTab === 'items' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <AnimatePresence initial={false}>
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.25 }}
                                    style={{
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 14,
                                        padding: '12px 14px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Thumbnail */}
                                    <div
                                        style={{
                                            width: 60, height: 60, borderRadius: 12, flexShrink: 0,
                                            background: 'var(--color-surface-2)', overflow: 'hidden',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        {item.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.image_url} alt={item.name_ar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: 26 }}>🍽️</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.name_ar}
                                            </span>
                                            {!item.is_available && (
                                                <span style={{ background: 'rgba(127,29,29,0.3)', color: '#fca5a5', fontSize: 10, padding: '2px 6px', borderRadius: 20, flexShrink: 0, fontFamily: "'Cairo', sans-serif" }}>
                                                    غير متاح
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                                            {categories.find((c) => c.id === item.category_id)?.name_ar ?? '—'}
                                        </div>
                                        <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--color-primary-light)', marginTop: 4 }}>
                                            {formatIQD(item.price)}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <button
                                            onClick={() => { setEditItem(item); setModalOpen(true); }}
                                            style={{
                                                background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                                                borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
                                                color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center',
                                                transition: 'background 0.2s',
                                            }}
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button
                                            onClick={() => { setDeleteTarget(item); setDeleteOpen(true); }}
                                            style={{
                                                background: 'rgba(127,29,29,0.2)', border: '1px solid rgba(153,27,27,0.4)',
                                                borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
                                                color: '#fca5a5', display: 'flex', alignItems: 'center',
                                                transition: 'background 0.2s',
                                            }}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredItems.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)', fontFamily: "'Cairo', sans-serif", fontSize: 15 }}>
                                لا توجد أطباق في هذه الفئة
                                <br />
                                <button
                                    onClick={() => { setEditItem(null); setModalOpen(true); }}
                                    style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--color-primary)', fontFamily: "'Cairo', sans-serif", fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    إضافة طبق جديد
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <AnimatePresence initial={false}>
                            {categories.map((cat) => (
                                <motion.div
                                    key={cat.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.25 }}
                                    style={{
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 14,
                                        padding: '16px 20px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {cat.name_ar}
                                            </span>
                                            <span style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontFamily: "'Inter', sans-serif" }}>
                                                Order: {cat.sort_order}
                                            </span>
                                        </div>
                                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                                            {cat.name}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <button
                                            onClick={() => { setEditCategory(cat); setCategoryModalOpen(true); }}
                                            style={{
                                                background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                                                borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
                                                color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center',
                                                transition: 'background 0.2s',
                                            }}
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button
                                            onClick={() => { setDeleteCatTarget(cat); setDeleteCatOpen(true); }}
                                            style={{
                                                background: 'rgba(127,29,29,0.2)', border: '1px solid rgba(153,27,27,0.4)',
                                                borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
                                                color: '#fca5a5', display: 'flex', alignItems: 'center',
                                                transition: 'background 0.2s',
                                            }}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {categories.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)', fontFamily: "'Cairo', sans-serif", fontSize: 15 }}>
                                لم تقم بإضافة أي فئات بعد
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Modals */}
            <ItemModal
                open={modalOpen}
                onClose={() => { setModalOpen(false); setEditItem(null); }}
                onSave={handleSave}
                categories={categories}
                initial={editItem}
                saving={saving}
            />

            <DeleteDialog
                open={deleteOpen}
                itemName={deleteTarget?.name_ar ?? ''}
                onConfirm={handleDelete}
                onCancel={() => { setDeleteOpen(false); setDeleteTarget(null); }}
                deleting={deleting}
            />

            <DeleteDialog
                open={deleteCatOpen}
                itemName={deleteCatTarget?.name_ar ?? ''}
                onConfirm={handleDeleteCategory}
                onCancel={() => { setDeleteCatOpen(false); setDeleteCatTarget(null); }}
                deleting={deletingCat}
            />

            <CategoryModal
                open={categoryModalOpen}
                onClose={() => { setCategoryModalOpen(false); setEditCategory(null); }}
                onSave={handleSaveCategory}
                initial={editCategory}
                saving={saving}
            />
        </div>
    );
}
