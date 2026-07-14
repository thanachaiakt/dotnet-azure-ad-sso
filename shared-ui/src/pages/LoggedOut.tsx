import { useNavigate } from 'react-router';

export interface LoggedOutProps {
    homePath?: string;
}

export const LoggedOut = ({ homePath = '/' }: LoggedOutProps) => {
    const navigate = useNavigate();

    return (
        <div className="page-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="glass-card fade-up" style={{ padding: '3rem 2.5rem', textAlign: 'center', maxWidth: 440, width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
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
                <p style={{ color: 'gray', fontSize: '0.95rem', marginBottom: '2rem' }}>
                    Your session has been cleared. See you next time!
                </p>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />

                <button
                    onClick={() => navigate(homePath, { replace: true })}
                    style={{ 
                        marginTop: '1.5rem', 
                        padding: '0.5rem 1rem', 
                        cursor: 'pointer',
                        background: '#646cff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};
