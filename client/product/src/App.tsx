import { BrowserRouter, Routes, Route } from 'react-router';
import { loginRequest } from './authConfig';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SigninOidc } from './pages/SigninOidc';
import { ProtectedRoute, SignoutCallback, LoggedOut, AutoLogin } from '@sso/shared';

function App() {
    const basename = window.location.port === '5173' ? '/product' : undefined;

    return (
        <BrowserRouter basename={basename}>
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
                    <Route path="signout-callback-oidc" element={<SignoutCallback additionalLogoutUris={['http://localhost:5173/signout-callback-oidc']} />} />
                    <Route path="logged-out" element={<LoggedOut />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}


export default App;
