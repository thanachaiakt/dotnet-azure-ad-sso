import { Outlet, useNavigate } from "react-router";
import { loginRequest } from "../authConfig";
import { GlobalLoading, Navbar, ThemeToggle } from "@sso/shared";
import type { NavbarLink } from "@sso/shared";

export const Layout = () => {
    const navigate = useNavigate();

    const navLinks: NavbarLink[] = [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Dashboard", authenticatedOnly: true },
        { to: "/product", label: "Product", authenticatedOnly: true, external: true }
    ];

    const handleLogout = () => {
        navigate('/signout-callback-oidc');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <GlobalLoading />

            <Navbar
                brandIcon="🔐"
                brandText="Azure SSO"
                links={navLinks}
                actions={<ThemeToggle />}
                loginRequest={loginRequest}
                redirectUri="http://localhost:5173/signin-oidc"
                onLogout={handleLogout}
            />

            {/* ── Content ── */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </main>
        </div>
    );
};

