import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { SigninOidc } from './pages/SigninOidc';
import { SignoutCallback } from './pages/SignoutCallback';
import { LoggedOut } from './pages/LoggedOut';

import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route 
                        path="dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="signin-oidc" element={<SigninOidc />} />
                    <Route path="signout-callback-oidc" element={<SignoutCallback />} />
                    <Route path="logged-out" element={<LoggedOut />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useIsAuthenticated();
    const { inProgress } = useMsal();

    // Wait for MSAL to finish processing (e.g. redirect callback) before deciding
    if (inProgress !== InteractionStatus.None) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{
                    width: '40px', height: '40px',
                    border: '3px solid #333', borderTopColor: '#646cff',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default App;
