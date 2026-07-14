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
import { ProtectedRoute, SignoutCallback, LoggedOut, AutoLogin } from '@sso/shared-ui';

function App() {
    return (
        <BrowserRouter>
            <AutoLogin loginRequest={loginRequest} />
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
