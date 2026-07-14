import { type Configuration, LogLevel } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_APP_CLIENT_ID;
const tenantId = import.meta.env.VITE_APP_TENANT_ID;
const authority = `https://login.microsoftonline.com/${tenantId}`;
const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174';
const redirectUri = origin.includes("5173") 
    ? "http://localhost:5173/product/signin-oidc" 
    : (import.meta.env.VITE_APP_REDIRECT_URI || "http://localhost:5174/signin-oidc");

const postLogoutRedirectUri = origin.includes("5173")
    ? "http://localhost:5173/product/logged-out"
    : (import.meta.env.VITE_APP_POST_LOGOUT_REDIRECT_URI || "http://localhost:5174/logged-out");

export const msalConfig: Configuration = {
    auth: {
        clientId,
        authority,
        redirectUri,
        postLogoutRedirectUri,
    },
    cache: {
        cacheLocation: "sessionStorage",
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

export const loginRequest = {
    scopes: ["openid", "profile", "email", "User.Read"]
};

export const apiRequest = {
    scopes: [`${clientId}/.default`]
};

export const productApiConfig = {
    baseUrl: import.meta.env.VITE_APP_PRODUCT_API_ENDPOINT || "",
};
