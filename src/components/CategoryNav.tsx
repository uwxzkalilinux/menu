'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Category } from '@/lib/types';
import { useLanguage } from '@/lib/LanguageContext';

interface CategoryNavProps {
    categories: Category[];
    selected: string | null;
    onSelect: (id: string) => void;
}

export default function CategoryNav({ categories, selected, onSelect }: CategoryNavProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    return (
        <div
            style={{
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                position: 'sticky',
                top: 144,
                zIndex: 40,
            }}
        >
            <div
                ref={scrollRef}
                className="scrollbar-hide"
                style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 8,
                    padding: '12px 16px',
                    maxWidth: 640,
                    margin: '0 auto',
                }}
            >
                {categories.map((cat) => {
                    const isActive = selected === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            style={{
                                flexShrink: 0,
                                position: 'relative',
                                padding: '8px 18px',
                                borderRadius: 24,
                                border: isActive
                                    ? '1px solid var(--color-primary)'
                                    : '1px solid var(--color-border)',
                                background: isActive
                                    ? 'linear-gradient(135deg, rgba(200,134,10,0.2), rgba(240,168,48,0.1))'
                                    : 'transparent',
                                color: isActive ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                                fontFamily: "'Cairo', sans-serif",
                                fontWeight: isActive ? 700 : 500,
                                fontSize: 14,
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="category-pill"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: 24,
                                        background: 'linear-gradient(135deg, rgba(200,134,10,0.15), rgba(240,168,48,0.08))',
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            {t(cat.name_ar, cat.name)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
