import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Link } from "react-router";

export const Home = () => {
    const isAuthenticated = useIsAuthenticated();
    const { accounts } = useMsal();
    const account = accounts[0];

    return (
        <div className="page" style={{ maxWidth: 740, margin: '0 auto', width: '100%' }}>

            {/* ── Hero ── */}
            <div className="fade-up" style={{ textAlign: 'center', paddingTop: '3rem' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 16px', borderRadius: 999,
                    background: 'var(--accent-subtle)',
                    border: '1px solid var(--accent-border)',
                    color: 'var(--accent-light)', fontSize: '0.8rem', fontWeight: 500,
                    marginBottom: '1.5rem', letterSpacing: '0.04em'
                }}>
                    <span>✦</span> Azure AD SSO · Product Microservice
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-light))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1.25rem',
                    letterSpacing: '-0.03em'
                }}>
                    TechStore
                </h1>

                <p style={{
                    fontSize: '1.1rem', color: 'var(--text-secondary)',
                    maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7
                }}>
                    Browse the latest electronics and tech gadgets. Powered by{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>React + Vite</strong> and a{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>.NET 10 Microservice</strong> with
                    Azure AD Single Sign-On.
                </p>
            </div>

            {/* ── Status Card ── */}
            <div className="fade-up-delay" style={{ width: '100%' }}>
                {!isAuthenticated ? (
                    <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Authentication Required</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Sign in with your Microsoft account to browse our catalog
                            and view product details.
                        </p>
                        <div className="divider" />
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            {[
                                { icon: '🛡️', label: 'Azure AD SSO' },
                                { icon: '📦', label: 'Product API' },
                                { icon: '⚡', label: '.NET 10' },
                            ].map(f => (
                                <div key={f.label} style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                                    background: 'var(--bg-hover)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-secondary)', fontSize: '0.85rem'
                                }}>
                                    <span>{f.icon}</span>{f.label}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '2.5rem' }}>
                        {/* Header row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.25rem', fontWeight: 700, color: 'white',
                                    boxShadow: '0 4px 16px var(--accent-glow)'
                                }}>
                                    {account?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                                        {account?.name ?? 'User'}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
                                        {account?.username}
                                    </div>
                                </div>
                            </div>
                            <span className="badge badge-success">
                                <span className="dot dot-success" />
                                Authenticated
                            </span>
                        </div>

                        <div className="divider" />

                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                            You're signed in and ready to browse our electronics catalog.
                        </p>

                        <Link to="/products" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                            Browse Products <span>→</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
