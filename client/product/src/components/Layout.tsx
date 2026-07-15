import { Outlet, useNavigate } from "react-router";
import { loginRequest } from "../authConfig";
import { GlobalLoading, Navbar, ThemeToggle } from "@sso/shared";
import type { NavbarLink } from "@sso/shared";

export const Layout = () => {
    const navigate = useNavigate();

    const navLinks: NavbarLink[] = [
        { to: "/", label: "Home", external: true },
        { to: "/dashboard", label: "Dashboard", authenticatedOnly: true, external: true },
        { to: "/", label: "Product", authenticatedOnly: true }
    ];

    const handleLogout = () => {
        navigate('/signout-callback-oidc');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <GlobalLoading />

            <Navbar
                brandIcon="🛒"
                brandText="TechStore"
                brandLink="/"
                links={navLinks}
                actions={<ThemeToggle />}
                loginRequest={loginRequest}
                redirectUri={import.meta.env.VITE_APP_REDIRECT_URI || "http://localhost:5174/signin-oidc"}
                onLogout={handleLogout}
            />

            {/* ── Content ── */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </main>
        </div>
    );
};

