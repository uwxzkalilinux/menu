'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { Category, MenuItem } from '@/lib/types';

export interface ItemFormData {
    id?: string;
    name: string;
    name_ar: string;
    description: string;
    description_ar: string;
    category_id: string;
    price: string;
    image_url: string;
    is_available: boolean;
}

interface ItemModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ItemFormData, imageFile?: File) => Promise<void>;
    categories: Category[];
    initial?: MenuItem | null;
    saving?: boolean;
}

const empty: ItemFormData = {
    name: '', name_ar: '', description: '', description_ar: '',
    category_id: '', price: '', image_url: '', is_available: true,
};

export default function ItemModal({ open, onClose, onSave, categories, initial, saving }: ItemModalProps) {
    const [form, setForm] = useState<ItemFormData>(empty);
    const [imageFile, setImageFile] = useState<File | undefined>();
    const [preview, setPreview] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        if (initial) {
            setForm({
                id: initial.id,
                name: initial.name,
                name_ar: initial.name_ar,
                description: initial.description ?? '',
                description_ar: initial.description_ar ?? '',
                category_id: initial.category_id,
                price: String(initial.price),
                image_url: initial.image_url ?? '',
                is_available: initial.is_available,
            });
            setPreview(initial.image_url ?? '');
            setImageFile(undefined);
        } else {
            setForm({ ...empty, category_id: categories[0]?.id ?? '' });
            setPreview('');
            setImageFile(undefined);
        }
    }, [initial, open, categories]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
        setForm((f) => ({ ...f, image_url: '' }));
    }

    function field(key: keyof ItemFormData) {
        return {
            value: (form[key] ?? '') as string,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                setForm((f) => ({ ...f, [key]: e.target.value })),
        };
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await onSave(form, imageFile);
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 200,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                    }}
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        style={{
                            width: '100%', maxWidth: 600,
                            background: 'var(--color-surface)',
                            borderTop: '1px solid var(--color-border)',
                            borderRadius: '24px 24px 0 0',
                            maxHeight: '90dvh',
                            overflowY: 'auto',
                            padding: '8px 0 0',
                        }}
                    >
                        {/* Drag handle */}
                        <div style={{ textAlign: 'center', paddingBottom: 12 }}>
                            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-border)', display: 'inline-block' }} />
                        </div>

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 16px', borderBottom: '1px solid var(--color-border)' }}>
                            <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
                                {initial ? 'تعديل الطبق' : 'إضافة طبق جديد'}
                            </h2>
                            <button
                                onClick={onClose}
                                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Image upload */}
                            <div>
                                <label className="admin-label">صورة الطبق</label>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    style={{
                                        border: '2px dashed var(--color-border)', borderRadius: 12,
                                        height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', overflow: 'hidden', position: 'relative',
                                        background: preview ? 'transparent' : 'var(--color-surface-2)',
                                    }}
                                >
                                    {preview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            <Upload size={24} style={{ margin: '0 auto 6px', display: 'block' }} />
                                            <span style={{ fontSize: 13, fontFamily: "'Cairo', sans-serif" }}>انقر لرفع صورة</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                <input
                                    className="admin-input"
                                    type="url"
                                    placeholder="أو أدخل رابط الصورة"
                                    style={{ marginTop: 8 }}
                                    {...field('image_url')}
                                />
                            </div>

                            <div>
                                <label className="admin-label">اسم الطبق (عربي) *</label>
                                <input className="admin-input" required placeholder="مثال: شاورما دجاج" {...field('name_ar')} />
                            </div>

                            <div>
                                <label className="admin-label">Dish Name (English)</label>
                                <input className="admin-input" placeholder="e.g. Chicken Shawarma" style={{ direction: 'ltr' }} {...field('name')} />
                            </div>

                            <div>
                                <label className="admin-label">الوصف (عربي)</label>
                                <textarea
                                    className="admin-input"
                                    rows={2}
                                    placeholder="وصف مختصر للطبق..."
                                    style={{ resize: 'vertical' }}
                                    {...field('description_ar')}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label className="admin-label">الفئة *</label>
                                    <select className="admin-input" required {...field('category_id')}>
                                        <option value="">اختر فئة</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name_ar}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="admin-label">السعر (IQD) *</label>
                                    <input
                                        className="admin-input"
                                        type="number"
                                        min={0}
                                        required
                                        placeholder="15000"
                                        style={{ direction: 'ltr' }}
                                        {...field('price')}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <input
                                    type="checkbox"
                                    id="is_available"
                                    checked={form.is_available}
                                    onChange={(e) => setForm((f) => ({ ...f, is_available: e.target.checked }))}
                                    style={{ width: 16, height: 16, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                                />
                                <label htmlFor="is_available" style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                    الطبق متوفر حالياً
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                                <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>إلغاء</button>
                                <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 2 }}>
                                    {saving ? 'جاري الحفظ...' : initial ? 'حفظ التعديلات' : 'إضافة الطبق'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
