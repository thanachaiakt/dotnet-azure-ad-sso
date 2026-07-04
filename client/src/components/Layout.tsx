import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Outlet, Link, useNavigate } from "react-router";
import { loginRequest } from "../authConfig";

export const Layout = () => {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    const account = accounts[0];
    const initials = account?.name
        ? account.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    const handleLogin = () => {
        instance.loginRedirect({
            ...loginRequest,
            redirectUri: "http://localhost:5173/signin-oidc"
        }).catch(console.error);
    };

    const handleLogout = () => {
        navigate('/signout-callback-oidc');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* ── Navigation ── */}
            <nav className="nav">
                <div className="nav-brand">
                    <div className="nav-brand-icon">🔐</div>
                    Azure SSO
                </div>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    {isAuthenticated && (
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    )}
                </div>

                <div className="nav-actions">
                    {!isAuthenticated ? (
                        <button className="btn btn-primary" onClick={handleLogin}>
                            <span>Sign In</span>
                            <span>→</span>
                        </button>
                    ) : (
                        <>
                            <div className="nav-user">
                                <div className="nav-avatar">{initials}</div>
                                <span className="nav-username">{account?.name ?? account?.username}</span>
                            </div>
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Sign Out
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* ── Content ── */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </main>
        </div>
    );
};
