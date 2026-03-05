'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Category } from '@/lib/types';

export interface CategoryFormData {
    id?: string;
    name: string;
    name_ar: string;
    sort_order: number;
}

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: CategoryFormData) => Promise<void>;
    initial?: Category | null;
    saving?: boolean;
}

const empty: CategoryFormData = { name: '', name_ar: '', sort_order: 0 };

export default function CategoryModal({ open, onClose, onSave, initial, saving }: CategoryModalProps) {
    const [form, setForm] = useState<CategoryFormData>(empty);

    useEffect(() => {
        if (!open) return;
        if (initial) {
            setForm({
                id: initial.id,
                name: initial.name,
                name_ar: initial.name_ar,
                sort_order: initial.sort_order,
            });
        } else {
            setForm(empty);
        }
    }, [initial, open]);

    function field(key: keyof CategoryFormData) {
        return {
            value: (form[key] ?? '') as string | number,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((f) => ({ ...f, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value })),
        };
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await onSave(form);
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
                            width: '100%', maxWidth: 500,
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
                                {initial ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                            </h2>
                            <button
                                onClick={onClose}
                                type="button"
                                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label className="admin-label">اسم الفئة (عربي) *</label>
                                <input className="admin-input" required placeholder="مثال: السلطات" {...field('name_ar')} />
                            </div>

                            <div>
                                <label className="admin-label">Category Name (English)</label>
                                <input className="admin-input" placeholder="e.g. Salads" style={{ direction: 'ltr' }} {...field('name')} />
                            </div>

                            <div>
                                <label className="admin-label">الترتيب</label>
                                <input
                                    className="admin-input"
                                    type="number"
                                    placeholder="0"
                                    style={{ direction: 'ltr' }}
                                    {...field('sort_order')}
                                />
                                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
                                    أرقام أصغر تظهر أولاً (مثال: 1 يظهر قبل 2)
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                                <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>إلغاء</button>
                                <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 2 }}>
                                    {saving ? 'جاري الحفظ...' : initial ? 'حفظ التعديلات' : 'إضافة الفئة'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
