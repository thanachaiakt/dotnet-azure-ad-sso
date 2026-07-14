import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { SigninOidc } from './pages/SigninOidc';
import { ProtectedRoute, SignoutCallback, LoggedOut, AutoLogin } from '@sso/shared-ui';

import './App.css';

function App() {
    return (
        <BrowserRouter>
            <AutoLogin />
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

export default App;
