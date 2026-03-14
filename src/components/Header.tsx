'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Header() {
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
                background: 'linear-gradient(180deg, #0f0e0c 0%, rgba(15,14,12,0.95) 100%)',
                borderBottom: '1px solid rgba(200,134,10,0.2)',
                padding: '20px 20px 16px',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
                {/* Top Brands/Logo Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Logo mark */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            background: 'linear-gradient(135deg, #c8860a, #f0a830)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 20px rgba(200,134,10,0.4)',
                        }}
                    >
                        <span style={{ fontSize: 26, lineHeight: 1 }}>🫖</span>
                    </motion.div>

                    {/* Restaurant name */}
                    <div>
                        <h1
                            style={{
                                fontFamily: "'Cairo', sans-serif",
                                fontSize: 'clamp(18px, 5vw, 24px)',
                                fontWeight: 800,
                                color: '#f5f0e8',
                                letterSpacing: '-0.01em',
                                lineHeight: 1.2,
                            }}
                        >
                            {t('مطعم بيت الكرم', 'Beit Al-Karam')}
                        </h1>
                        <p
                            style={{
                                fontFamily: "'Cairo', sans-serif",
                                fontSize: 12,
                                color: '#c8860a',
                                fontWeight: 500,
                                marginTop: 1,
                            }}
                        >
                            {t('أصالة الطعم العراقي', 'Authentic Iraqi Taste')}
                        </p>
                    </div>

                    {/* Language Toggle */}
                    <div style={{ marginLeft: language === 'ar' ? 0 : 'auto', marginRight: language === 'ar' ? 'auto' : 0 }}>
                        <button
                            onClick={toggleLanguage}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 20,
                                padding: '6px 12px',
                                color: '#f5f0e8',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            <Globe size={14} color="#c8860a" />
                            {language === 'ar' ? 'English' : 'عربي'}
                        </button>
                    </div>

                    {/* Decorative golden dot */}
                    <div style={{ marginRight: 'auto' }}>
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#c8860a',
                                boxShadow: '0 0 10px rgba(200,134,10,0.6)',
                                animation: 'pulse 2s infinite',
                            }}
                        />
                    </div>
                </div>

                {/* Action Buttons Row */}
                <div style={{
                    display: 'flex', gap: 10, marginTop: 16,
                    justifyContent: 'center'
                }}>
                    <a
                        href="https://maps.app.goo.gl/YkKi5KQeEryEBLPt6"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            flex: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: 'var(--color-surface-2)',
                            border: '1px solid rgba(200,134,10,0.3)',
                            color: 'var(--color-primary-light)',
                            padding: '10px',
                            borderRadius: 12,
                            textDecoration: 'none',
                            fontFamily: "'Cairo', sans-serif",
                            fontSize: 14,
                            fontWeight: 700,
                            transition: 'all 0.2s',
                        }}
                    >
                        <MapPin size={16} />
                        {t('موقعنا', 'Location')}
                    </a>

                    <a
                        href="tel:07772518222"
                        style={{
                            flex: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: 'rgba(200,134,10,0.1)',
                            border: '1px solid rgba(200,134,10,0.3)',
                            color: 'var(--color-primary-light)',
                            padding: '10px',
                            borderRadius: 12,
                            textDecoration: 'none',
                            fontFamily: "'Cairo', sans-serif",
                            fontSize: 14,
                            fontWeight: 700,
                            transition: 'all 0.2s',
                        }}
                    >
                        <Phone size={16} />
                        {t('اتصل بنا', 'Contact Us')}
                    </a>
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
        </motion.header>
    );
}
