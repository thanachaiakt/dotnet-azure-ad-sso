import { useState } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest, apiConfig } from '../authConfig';
import axios from 'axios';

export const Dashboard = () => {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const account = accounts[0];

    const callApi = async () => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            // Step 1: acquire MSAL token silently
            if (account) {
                const tokenResponse = await instance.acquireTokenSilent({
                    ...loginRequest,
                    account,
                });

                // Step 2: exchange the Azure AD token for a local JWT cookie
                await axios.post(
                    apiConfig.exchangeTokenEndpoint,
                    {},
                    {
                        headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
                        withCredentials: true,
                    }
                );
            }

            // Step 3: call the protected API — the local JWT cookie is sent automatically
            const apiResponse = await axios.get(apiConfig.backendEndpoint, {
                withCredentials: true,
            });
            setData(JSON.stringify(apiResponse.data, null, 2));
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Unknown error";
            setError(`${msg} (HTTP ${err?.response?.status ?? 'network error'})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ maxWidth: 760, margin: '0 auto', width: '100%' }}>

            {/* ── Page Header ── */}
            <div className="fade-up" style={{ width: '100%', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: 4 }}>Dashboard</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Protected page · .NET API playground
                        </p>
                    </div>
                    <span className={`badge ${isAuthenticated ? 'badge-success' : 'badge-danger'}`}>
                        <span className={`dot ${isAuthenticated ? 'dot-success' : 'dot-danger'}`} />
                        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                    </span>
                </div>
            </div>

            {/* ── User Info Card ── */}
            {account && (
                <div className="glass-card fade-up-delay" style={{ padding: '1.5rem', width: '100%', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 46, height: 46, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', fontWeight: 700, color: 'white',
                            flexShrink: 0, boxShadow: '0 4px 12px var(--accent-glow)'
                        }}>
                            {account.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() ?? '?'}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{account.name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>{account.username}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--accent-light)', fontSize: '0.78rem', fontWeight: 500 }}>
                            MSAL Session Active
                        </div>
                    </div>
                </div>
            )}

            {/* ── API Test Card ── */}
            <div className="glass-card fade-up-delay2" style={{ padding: '2rem', width: '100%' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 6 }}>API Endpoint Test</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Calls <code style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--accent-light)', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem' }}>
                            GET /api/home
                        </code> with your bearer token
                    </p>
                </div>

                <div className="divider" />

                <div style={{ display: 'flex', gap: 12, marginTop: '1.25rem', flexWrap: 'wrap' }}>
                    <button
                        className="btn btn-primary"
                        onClick={callApi}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner spinner-accent" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                Fetching…
                            </>
                        ) : (
                            <> ⚡ Call Protected API </>
                        )}
                    </button>

                    {(data || error) && (
                        <button
                            className="btn"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                            onClick={() => { setData(null); setError(null); }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        marginTop: '1.25rem', padding: '1rem 1.25rem',
                        background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
                        borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: 10
                    }}>
                        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>❌</span>
                        <p style={{ color: 'var(--danger)', fontSize: '0.875rem', margin: 0 }}>{error}</p>
                    </div>
                )}

                {/* Success Response */}
                {data && (
                    <div style={{ marginTop: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span className="badge badge-success">✓ 200 OK</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Response from .NET API</span>
                        </div>
                        <pre className="code-block">{data}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};
