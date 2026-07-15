import { useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import type { SsoSilentRequest } from "@azure/msal-browser";

export interface AutoLoginProps {
    loginRequest?: SsoSilentRequest;
}

export const AutoLogin = ({ loginRequest }: AutoLoginProps) => {
    const { instance, accounts, inProgress } = useMsal();
    const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

    // Sync logged-in user state to cookie so other apps on localhost can read the loginHint
    useEffect(() => {
        if (accounts.length > 0 && accounts[0]) {
            document.cookie = `sso_login_hint=${encodeURIComponent(accounts[0].username)}; path=/; max-age=31536000; SameSite=Lax`;
        }
    }, [accounts]);

    useEffect(() => {
        // Prevent auto-login on auth callback or logout pages
        const ignoredPaths = ["/signin-oidc", "/signout-callback-oidc", "/logged-out"];
        if (ignoredPaths.some(path => window.location.pathname.endsWith(path))) {
            return;
        }

        // Attempt silent SSO if the user is not logged in here but might be logged in on the IDP (Azure AD)
        if (accounts.length === 0 && inProgress === InteractionStatus.None && !autoLoginAttempted) {
            setAutoLoginAttempted(true);

            // Read the shared login hint cookie
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) {
                    const popped = parts.pop();
                    return popped ? decodeURIComponent(popped.split(';').shift() || "") : "";
                }
                return null;
            };

            const loginHint = getCookie("sso_login_hint");
            const silentRequest = {
                ...(loginRequest || { scopes: ["openid", "profile"] }),
                ...(loginHint ? { loginHint } : {})
            };
            
            instance.ssoSilent(silentRequest).catch(error => {
                console.error("Silent SSO failed:", error);
                
                // Fallback: If we had a login hint (meaning user is logged in on another tab),
                // but silent SSO failed (likely due to third-party cookie restrictions),
                // we perform a redirect login. Since the session is active in Azure AD,
                // this will quickly redirect and log the user in without requiring credentials.
                if (loginHint) {
                    console.info("Attempting fallback redirect login using loginHint...");
                    instance.loginRedirect({
                        ...silentRequest,
                        scopes: silentRequest.scopes || ["openid", "profile"],
                        redirectUri: loginRequest?.redirectUri || window.location.origin + "/signin-oidc"
                    }).catch(err => {
                        console.error("Fallback redirect login failed:", err);
                    });
                }
            });
        }
    }, [instance, accounts.length, inProgress, loginRequest, autoLoginAttempted]);

    return null;
};

