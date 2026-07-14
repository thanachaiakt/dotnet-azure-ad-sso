import { Outlet, useNavigate } from "react-router";
import { loginRequest } from "../authConfig";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalLoading, Navbar } from "@sso/shared-ui";
import type { NavbarLink } from "@sso/shared-ui";

export const Layout = () => {
    const navigate = useNavigate();

    const navLinks: NavbarLink[] = [
        { to: "/", label: "Home", external: true },
        { to: "/dashboard", label: "Dashboard", authenticatedOnly: true, external: true },
        { to: "/products", label: "Products", authenticatedOnly: true }
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

