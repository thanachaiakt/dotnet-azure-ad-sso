import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

export const GlobalLoading = () => {
    const { inProgress } = useMsal();
    
    // Only show the overlay if MSAL is actively processing an authentication flow
    if (inProgress === InteractionStatus.None) {
        return null;
    }
    
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(4px)'
        }}>
            <div className="glass-card fade-up" style={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                padding: '2.5rem', 
                borderRadius: '12px', 
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: '#333'
            }}>
                <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    border: '4px solid #f3f3f3', 
                    borderTop: '4px solid #646cff', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite', 
                    margin: '0 auto' 
                }}></div>
                <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                    Authenticating...
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                    Please wait while we verify your session.
                </p>
            </div>
            <style>{`
                @keyframes spin { 
                    0% { transform: rotate(0deg); } 
                    100% { transform: rotate(360deg); } 
                }
            `}</style>
        </div>
    );
};
