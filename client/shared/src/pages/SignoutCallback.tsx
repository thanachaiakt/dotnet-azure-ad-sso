import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useMsal } from "@azure/msal-react";

export interface SignoutCallbackProps {
    onLogout?: () => Promise<void> | void;
    redirectPath?: string;
    additionalLogoutUris?: string[];
}

export const SignoutCallback = ({ 
    onLogout, 
    redirectPath = '/logged-out',
    additionalLogoutUris = []
}: SignoutCallbackProps) => {
    const { instance, accounts } = useMsal();
    const navigate = useNavigate();
    const [renderUris, setRenderUris] = useState<string[]>([]);

    useEffect(() => {
        const performLogout = async () => {
            // Clear the shared login hint cookie
            document.cookie = "sso_login_hint=; path=/; max-age=0; SameSite=Lax";

            if (onLogout) {
                try {
                    await onLogout();
                } catch (error) {
                    console.warn("Custom logout logic failed:", error);
                }
            }

            const isIframe = window.self !== window.top;

            if (isIframe) {
                // If running in an iframe (e.g. Azure AD front-channel logout or from the other app),
                // only clear local session/cache and avoid redirecting to Microsoft.
                try {
                    await instance.clearCache();
                    sessionStorage.clear();
                    localStorage.clear();
                } catch (error) {
                    console.warn("MSAL clearCache failed in iframe:", error);
                }
                navigate(redirectPath, { replace: true });
            } else {
                // If running in the main window:
                // 1. Render iframes to trigger logout in other apps
                if (additionalLogoutUris && additionalLogoutUris.length > 0) {
                    setRenderUris(additionalLogoutUris);
                    // Give iframes some time to load and run their logout logic
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                // 2. Perform main redirect to Azure AD to clear Azure AD session
                try {
                    await instance.logoutRedirect({
                        account: accounts[0] ?? null,
                        postLogoutRedirectUri: window.location.origin + redirectPath
                    });
                } catch (error) {
                    console.warn("MSAL logoutRedirect failed, falling back to clearCache:", error);
                    try {
                        await instance.clearCache();
                        sessionStorage.clear();
                        localStorage.clear();
                    } catch (fallbackError) {
                        console.warn("MSAL clearCache also failed:", fallbackError);
                    }
                    navigate(redirectPath, { replace: true });
                }
            }
        };

        performLogout();
    }, [instance, accounts, navigate, onLogout, redirectPath, additionalLogoutUris]);

    return (
        <div className="page-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            {renderUris.map((uri) => (
                <iframe
                    key={uri}
                    src={uri}
                    style={{ display: 'none' }}
                    title={`logout-${uri}`}
                />
            ))}
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
