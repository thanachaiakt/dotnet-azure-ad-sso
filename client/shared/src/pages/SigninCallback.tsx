import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useMsal } from "@azure/msal-react";
import { EventType, type AuthenticationResult } from "@azure/msal-browser";

export interface SigninCallbackProps {
    onSuccess: (result: AuthenticationResult) => Promise<void> | void;
    onError?: (error: any) => void;
    fallbackRedirectPath?: string;
    loadingMessage?: string;
    loadingDescription?: string;
}

export const SigninCallback = ({ 
    onSuccess, 
    onError, 
    fallbackRedirectPath = "/",
    loadingMessage = "Signing you in…",
    loadingDescription = "Processing your Azure AD authentication. Please wait."
}: SigninCallbackProps) => {
    const { instance } = useMsal();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const isIframe = window.self !== window.top;

        const handleRedirectResult = async () => {
            try {
                const result = await instance.handleRedirectPromise();
                if (isIframe) {
                    // Inside iframe (e.g. silent SSO), do not perform navigation or state updates
                    return;
                }
                if (result && result.accessToken) {
                    if (result.account) {
                        document.cookie = `sso_login_hint=${encodeURIComponent(result.account.username)}; path=/; max-age=31536000; SameSite=Lax`;
                    }
                    await onSuccess(result);
                } else {
                    const accs = instance.getAllAccounts();
                    if (accs.length > 0 && accs[0]) {
                        document.cookie = `sso_login_hint=${encodeURIComponent(accs[0].username)}; path=/; max-age=31536000; SameSite=Lax`;
                    }
                    navigate(accs.length > 0 ? fallbackRedirectPath : '/', { replace: true });
                }
            } catch (error: any) {
                console.error("Sign-in redirect error:", error);
                if (isIframe) {
                    return;
                }
                setStatus('error');
                setErrorMessage(error?.message || 'An error occurred during sign-in.');
                if (onError) onError(error);
            }
        };

        handleRedirectResult();

        const callbackId = instance.addEventCallback((event) => {
            if (isIframe) return; // Skip in iframe context
            if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
                const result = event.payload as AuthenticationResult;
                if (result.accessToken) {
                    if (result.account) {
                        document.cookie = `sso_login_hint=${encodeURIComponent(result.account.username)}; path=/; max-age=31536000; SameSite=Lax`;
                    }
                    onSuccess(result);
                }
            }
        });

        return () => { if (callbackId) instance.removeEventCallback(callbackId); };
    }, [instance, navigate, onSuccess, onError, fallbackRedirectPath]);

    return (
        <div className="page-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            {status === 'processing' ? (
                <div className="glass-card fade-up" style={{ padding: '3rem 2.5rem', textAlign: 'center', maxWidth: 400, width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            border: '3px solid #333', borderTopColor: '#646cff',
                            borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{loadingMessage}</h2>
                    <p style={{ color: 'gray', fontSize: '0.9rem' }}>
                        {loadingDescription}
                    </p>
                </div>
            ) : (
                <div className="glass-card fade-up" style={{
                    padding: '2.5rem', textAlign: 'center', maxWidth: 440, width: '100%',
                    border: '1px solid red', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem', backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 style={{ color: 'red', marginBottom: '0.75rem' }}>Sign-in Failed</h2>
                    <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        {errorMessage}
                    </p>
                    <button onClick={() => navigate('/', { replace: true })} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                        ← Back to Home
                    </button>
                </div>
            )}
        </div>
    );
};
