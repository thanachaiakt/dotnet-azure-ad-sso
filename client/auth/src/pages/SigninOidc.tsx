import axios from 'axios';
import { type AuthenticationResult } from "@azure/msal-browser";
import { SigninCallback } from '@sso/shared';

const API_BASE = "http://localhost:5000/api";

export const SigninOidc = () => {
    const handleSuccess = async (result: AuthenticationResult) => {
        await axios.post(`${API_BASE}/auth/exchange-token`, {}, {
            headers: { Authorization: `Bearer ${result.accessToken}` },
            withCredentials: true
        });
    };

    return (
        <SigninCallback 
            onSuccess={handleSuccess} 
            fallbackRedirectPath="/dashboard" 
        />
    );
};
