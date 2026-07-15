import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Link } from "react-router";
import type { ReactNode } from "react";

export interface NavbarLink {
    to: string;
    label: string;
    authenticatedOnly?: boolean;
    external?: boolean;
}

export interface NavbarProps {
    brandIcon: ReactNode;
    brandText: string;
    brandLink?: string;
    links: NavbarLink[];
    actions?: ReactNode;
    loginRequest: any;
    redirectUri: string;
    onLogout?: () => void;
}

export const Navbar = ({
    brandIcon,
    brandText,
    brandLink,
    links,
    actions,
    loginRequest,
    redirectUri,
    onLogout
}: NavbarProps) => {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    const account = accounts[0];
    const initials = account?.name
        ? account.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    const handleLogin = () => {
        instance.loginRedirect({
            ...loginRequest,
            redirectUri
        }).catch(console.error);
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
    };

    const BrandContent = (
        <>
            <div className="nav-brand-icon">{brandIcon}</div>
            {brandText}
        </>
    );

    return (
        <nav className="nav">
            {brandLink ? (
                <Link to={brandLink} className="nav-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {BrandContent}
                </Link>
            ) : (
                <div className="nav-brand">
                    {BrandContent}
                </div>
            )}

            <div className="nav-links">
                {links.map((link) => {
                    if (link.authenticatedOnly && !isAuthenticated) {
                        return null;
                    }
                    const isExternal = link.external || link.to.startsWith("http");
                    if (isExternal) {
                        return (
                            <a key={link.to} href={link.to} className="nav-link">
                                {link.label}
                            </a>
                        );
                    }
                    return (
                        <Link key={link.to} to={link.to} className="nav-link">
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            <div className="nav-actions">
                {actions}
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
    );
};
