'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MenuItem } from '@/lib/types';
import { formatIQD } from '@/lib/supabase';

interface DishCardProps {
    item: MenuItem;
    index: number;
}

export default function DishCard({ item, index }: DishCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.06 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            style={{
                background: 'var(--color-surface)',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s',
            }}
        >
            {/* Image */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: 'var(--color-surface-2)' }}>
                {!imageLoaded && !imageError && (
                    <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
                )}
                {!imageError && item.image_url ? (
                    <Image
                        src={item.image_url}
                        alt={item.name_ar}
                        fill
                        sizes="(max-width: 640px) 45vw, 300px"
                        style={{
                            objectFit: 'cover',
                            opacity: imageLoaded ? 1 : 0,
                            transition: 'opacity 0.4s ease',
                        }}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 40,
                            background: 'var(--color-surface-2)',
                        }}
                    >
                        🍽️
                    </div>
                )}

                {/* Availability badge */}
                {!item.is_available && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: 'rgba(0,0,0,0.8)',
                            color: '#fca5a5',
                            fontSize: 11,
                            padding: '3px 8px',
                            borderRadius: 20,
                            fontWeight: 600,
                        }}
                    >
                        غير متوفر
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h3
                    style={{
                        fontFamily: "'Cairo', sans-serif",
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        lineHeight: 1.3,
                    }}
                >
                    {item.name_ar}
                </h3>

                {item.description_ar && (
                    <p
                        style={{
                            fontSize: 12,
                            color: 'var(--color-text-muted)',
                            lineHeight: 1.6,
                            flex: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {item.description_ar}
                    </p>
                )}

                {/* Price */}
                <div
                    style={{
                        marginTop: 8,
                        display: 'inline-flex',
                        alignSelf: 'flex-start',
                        background: 'linear-gradient(135deg, rgba(200,134,10,0.2), rgba(240,168,48,0.1))',
                        border: '1px solid rgba(200,134,10,0.3)',
                        borderRadius: 20,
                        padding: '4px 12px',
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Cairo', sans-serif",
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'var(--color-primary-light)',
                        }}
                    >
                        {formatIQD(item.price)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
