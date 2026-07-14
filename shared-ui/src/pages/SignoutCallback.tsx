import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMsal } from "@azure/msal-react";

export interface SignoutCallbackProps {
    onLogout?: () => Promise<void> | void;
    redirectPath?: string;
}

export const SignoutCallback = ({ onLogout, redirectPath = '/logged-out' }: SignoutCallbackProps) => {
    const { instance, accounts } = useMsal();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            if (onLogout) {
                try {
                    await onLogout();
                } catch (error) {
                    console.warn("Custom logout logic failed:", error);
                }
            }
            try {
                await instance.logoutRedirect({
                    account: accounts[0] ?? null,
                    postLogoutRedirectUri: window.location.origin + '/signin-oidc'
                });
            } catch (error) {
                console.warn("MSAL logoutRedirect failed, falling back to clearCache:", error);
                try {
                    await instance.clearCache();
                } catch (fallbackError) {
                    console.warn("MSAL clearCache also failed:", fallbackError);
                }
            }
            navigate(redirectPath, { replace: true });
        };

        performLogout();
    }, [instance, accounts, navigate, onLogout, redirectPath]);

    return (
        <div className="page-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="glass-card fade-up" style={{ padding: '3rem 2.5rem', textAlign: 'center', maxWidth: 400, width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        border: '3px solid #ff4d4f', borderTopColor: 'transparent',
                        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Signing you out…</h2>
                <p style={{ color: 'gray', fontSize: '0.9rem' }}>
                    Clearing your session securely. Please wait.
                </p>
            </div>
        </div>
    );
};
