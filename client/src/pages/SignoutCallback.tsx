import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMsal } from "@azure/msal-react";
import axios from 'axios';

const API_BASE = "http://localhost:5000/api";

export const SignoutCallback = () => {
    const { instance, accounts } = useMsal();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
            } catch (error) {
                console.warn("Backend logout call failed:", error);
            }
            try {
                // logoutSilent updates MSAL reactive state (useIsAuthenticated, accounts)
                // unlike clearCache() which only removes tokens without triggering re-renders
                await instance.logoutRedirect({
                    account: accounts[0] ?? null,
                });
            } catch (error) {
                console.warn("MSAL logoutSilent failed, falling back to clearCache:", error);
                try {
                    await instance.clearCache();
                } catch (fallbackError) {
                    console.warn("MSAL clearCache also failed:", fallbackError);
                }
            }
            navigate('/logged-out', { replace: true });
        };

        performLogout();
    }, [instance, accounts, navigate]);

    return (
        <div className="page-center">
            <div className="glass-card fade-up" style={{ padding: '3rem 2.5rem', textAlign: 'center', maxWidth: 400, width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div className="spinner spinner-danger" />
                </div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Signing you out…</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Clearing your session securely. Please wait.
                </p>
            </div>
        </div>
    );
};
