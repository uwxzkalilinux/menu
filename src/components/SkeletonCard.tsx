export default function SkeletonCard() {
    return (
        <div
            style={{
                background: 'var(--color-surface)',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
            }}
        >
            {/* Image placeholder */}
            <div
                className="skeleton"
                style={{ width: '100%', aspectRatio: '4/3' }}
            />
            {/* Content placeholder */}
            <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="skeleton" style={{ height: 18, width: '75%' }} />
                <div className="skeleton" style={{ height: 12, width: '100%' }} />
                <div className="skeleton" style={{ height: 12, width: '60%' }} />
                <div className="skeleton" style={{ height: 26, width: 100, borderRadius: 20, marginTop: 4 }} />
            </div>
        </div>
    );
}
