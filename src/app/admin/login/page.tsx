'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
            setError('بيانات الدخول غير صحيحة. يرجى المحاولة مجدداً.');
            setLoading(false);
            return;
        }
        router.push('/admin/dashboard');
    }

    return (
        <div
            style={{
                minHeight: '100dvh',
                background: 'var(--color-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                direction: 'rtl',
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    width: '100%',
                    maxWidth: 420,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 24,
                    padding: '36px 28px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
            >
                {/* Logo + title */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 18,
                            background: 'linear-gradient(135deg, #c8860a, #f0a830)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            fontSize: 32,
                            boxShadow: '0 4px 24px rgba(200,134,10,0.4)',
                        }}
                    >
                        🫖
                    </div>
                    <h1
                        style={{
                            fontFamily: "'Cairo', sans-serif",
                            fontSize: 22,
                            fontWeight: 800,
                            color: 'var(--color-text)',
                            marginBottom: 4,
                        }}
                    >
                        لوحة الإدارة
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 13, fontFamily: "'Cairo', sans-serif" }}>
                        مطعم بيت الكرم
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label className="admin-label">البريد الإلكتروني</label>
                        <input
                            className="admin-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@baitkaram.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="admin-label">كلمة المرور</label>
                        <input
                            className="admin-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'rgba(127,29,29,0.3)',
                                border: '1px solid #991b1b',
                                borderRadius: 10,
                                padding: '10px 14px',
                                color: '#fca5a5',
                                fontSize: 13,
                                fontFamily: "'Cairo', sans-serif",
                                textAlign: 'center',
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
                        {loading ? 'جاري الدخول...' : 'دخول'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
