'use client';

import { motion } from 'framer-motion';

export default function Header() {
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
            <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
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
                        مطعم بيت الكرم
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
                        أصالة الطعم العراقي
                    </p>
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

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
        </motion.header>
    );
}
