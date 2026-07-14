import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from './authConfig';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SigninOidc } from './pages/SigninOidc';
import { ProtectedRoute, SignoutCallback, LoggedOut } from '@sso/shared-ui';

const AutoLogin = () => {
    const { instance, accounts, inProgress } = useMsal();

    useEffect(() => {
        // Attempt silent SSO if the user is not logged in here but might be logged in on the IDP (Azure AD)
        if (accounts.length === 0 && inProgress === InteractionStatus.None) {
            const hasAttempted = sessionStorage.getItem('autoLoginAttempted');
            
            if (!hasAttempted) {
                sessionStorage.setItem('autoLoginAttempted', 'true');
                
                instance.ssoSilent(loginRequest).catch(error => {
                    console.debug("Silent SSO failed, falling back to loginRedirect:", error);
                    // Force a redirect to Azure AD.
                    // If they have an active session (e.g. from the other client app), 
                    // Azure AD will instantly redirect them back logged in.
                    instance.loginRedirect(loginRequest).catch(console.error);
                });
            }
        }
    }, [instance, accounts.length, inProgress]);

    return null;
};

function App() {
    return (
        <BrowserRouter>
            <AutoLogin />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route
                        path="products"
                        element={
                            <ProtectedRoute>
                                <ProductListingPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="products/:id"
                        element={
                            <ProtectedRoute>
                                <ProductDetailPage />
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
