import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { formatIQD } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

interface DishDetailsModalProps {
    item: MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function DishDetailsModal({ item, isOpen, onClose }: DishDetailsModalProps) {
    const { t, language } = useLanguage();

    return (
        <AnimatePresence>
            {isOpen && item && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'flex-end',
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(4px)',
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            background: 'var(--color-surface)',
                            width: '100%',
                            maxWidth: 640,
                            margin: '0 auto',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '24px 24px 0 0',
                            overflow: 'hidden',
                            borderTop: '1px solid var(--color-border)',
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
                    >
                        {/* Drag Handle & Close Button */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 40, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 4, zIndex: 10 }} />
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: language === 'ar' ? undefined : 16,
                                    left: language === 'ar' ? 16 : undefined,
                                    background: 'rgba(0,0,0,0.5)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <X size={20} />
                            </button>

                            {/* Image */}
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: 'var(--color-surface-2)' }}>
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.name_ar}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>
                                        🍽️
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '24px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                                <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.2, margin: 0 }}>
                                    {t(item.name_ar, item.name)}
                                </h2>
                                <div style={{ background: 'linear-gradient(135deg, rgba(200,134,10,0.2), rgba(240,168,48,0.1))', border: '1px solid rgba(200,134,10,0.4)', borderRadius: 20, padding: '6px 14px', flexShrink: 0 }}>
                                    <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--color-primary-light)' }}>
                                        {formatIQD(item.price)}
                                    </span>
                                </div>
                            </div>

                            {!item.is_available && (
                                <div style={{ display: 'inline-block', marginTop: 12, background: 'rgba(127,29,29,0.2)', border: '1px solid rgba(153,27,27,0.3)', color: '#fca5a5', fontSize: 13, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>
                                    {t('غير متوفر حالياً', 'Currently Unavailable')}
                                </div>
                            )}

                            {(item.description_ar || item.description) && (
                                <div style={{ marginTop: 20 }}>
                                    <h3 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
                                        {t('التفاصيل', 'Details')}
                                    </h3>
                                    <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                                        {t(item.description_ar || '', item.description || '')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
