import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useMsal } from "@azure/msal-react";
import { EventType, type AuthenticationResult } from "@azure/msal-browser";
import axios from 'axios';

const API_BASE = "http://localhost:5000/api";

export const SigninOidc = () => {
    const { instance } = useMsal();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await instance.handleRedirectPromise();
                if (result && result.accessToken) {
                    await exchangeToken(result);
                } else {
                    const accs = instance.getAllAccounts();
                    navigate(accs.length > 0 ? '/dashboard' : '/', { replace: true });
                }
            } catch (error: any) {
                console.error("Sign-in redirect error:", error);
                setStatus('error');
                setErrorMessage(error?.message || 'An error occurred during sign-in.');
            }
        };

        handleRedirectResult();

        const callbackId = instance.addEventCallback((event) => {
            if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
                const result = event.payload as AuthenticationResult;
                if (result.accessToken) exchangeToken(result);
            }
        });

        return () => { if (callbackId) instance.removeEventCallback(callbackId); };
    }, [instance, navigate]);

    const exchangeToken = async (result: AuthenticationResult) => {
        try {
            setStatus('processing');
            await axios.post(`${API_BASE}/auth/exchange-token`, {}, {
                headers: { Authorization: `Bearer ${result.accessToken}` },
                withCredentials: true
            });
            navigate('/dashboard', { replace: true });
        } catch (error: any) {
            console.error("Token exchange error:", error);
            setStatus('error');
            setErrorMessage(
                error?.response?.data?.message ||
                'Failed to exchange token with the backend API.'
            );
        }
    };

    return (
        <div className="page-center">
            {status === 'processing' ? (
                <div className="glass-card fade-up" style={{ padding: '3rem 2.5rem', textAlign: 'center', maxWidth: 400, width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div className="spinner spinner-accent" />
                    </div>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Signing you in…</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Processing your Azure AD authentication. Please wait.
                    </p>
                </div>
            ) : (
                <div className="glass-card fade-up" style={{
                    padding: '2.5rem', textAlign: 'center', maxWidth: 440, width: '100%',
                    border: '1px solid var(--danger-border)',
                }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 style={{ color: 'var(--danger)', marginBottom: '0.75rem' }}>Sign-in Failed</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        {errorMessage}
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/', { replace: true })}>
                        ← Back to Home
                    </button>
                </div>
            )}
        </div>
    );
};
