import { useNavigate } from 'react-router';
import { type AuthenticationResult } from "@azure/msal-browser";
import { SigninCallback } from '@sso/shared-ui';

export const SigninOidc = () => {
    const navigate = useNavigate();

    const handleSuccess = (_result: AuthenticationResult) => {
        navigate('/products', { replace: true });
    };

    return (
        <SigninCallback 
            onSuccess={handleSuccess} 
            fallbackRedirectPath="/products" 
        />
    );
};
