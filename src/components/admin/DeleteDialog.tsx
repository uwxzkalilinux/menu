'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface DeleteDialogProps {
    open: boolean;
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
    deleting?: boolean;
}

export default function DeleteDialog({ open, itemName, onConfirm, onCancel, deleting }: DeleteDialogProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 300,
                        background: 'rgba(0,0,0,0.75)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px',
                        backdropFilter: 'blur(4px)',
                    }}
                    onClick={(e) => e.target === e.currentTarget && onCancel()}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid rgba(153,27,27,0.5)',
                            borderRadius: 20,
                            padding: '28px 24px',
                            maxWidth: 360,
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                background: 'rgba(127,29,29,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                            }}
                        >
                            <AlertTriangle size={24} color="#fca5a5" />
                        </div>

                        <h3 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
                            تأكيد الحذف
                        </h3>
                        <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                            هل أنت متأكد من حذف <strong style={{ color: 'var(--color-text)' }}>{itemName}</strong>؟
                            <br />لا يمكن التراجع عن هذا الإجراء.
                        </p>

                        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                            <button className="btn-ghost" onClick={onCancel} style={{ flex: 1 }}>إلغاء</button>
                            <button className="btn-danger" onClick={onConfirm} disabled={deleting} style={{ flex: 1, borderRadius: 10, padding: '10px', fontSize: 14 }}>
                                {deleting ? 'جاري الحذف...' : 'حذف نهائياً'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
