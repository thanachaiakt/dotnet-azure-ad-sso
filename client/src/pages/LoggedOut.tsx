import { useNavigate } from 'react-router';

export const LoggedOut = () => {
    const navigate = useNavigate();

    return (
        <div className="page-center">
            <div className="glass-card fade-up" style={{ padding: '3rem 2.5rem', textAlign: 'center', maxWidth: 440, width: '100%' }}>
                {/* Icon ring */}
                <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'rgba(52,211,153,0.08)',
                    border: '2px solid rgba(52,211,153,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', margin: '0 auto 1.5rem'
                }}>
                    👋
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    Signed Out Successfully
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                    Your session has been cleared. See you next time!
                </p>

                <div className="divider" />

                <button
                    className="btn btn-primary"
                    style={{ marginTop: '1.5rem' }}
                    onClick={() => navigate('/', { replace: true })}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};
