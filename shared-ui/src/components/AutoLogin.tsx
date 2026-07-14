import { useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, SsoSilentRequest } from "@azure/msal-browser";

export interface AutoLoginProps {
    loginRequest?: SsoSilentRequest;
}

export const AutoLogin = ({ loginRequest }: AutoLoginProps) => {
    const { instance, accounts, inProgress } = useMsal();

    useEffect(() => {
        // Attempt silent SSO if the user is not logged in here but might be logged in on the IDP (Azure AD)
        if (accounts.length === 0 && inProgress === InteractionStatus.None) {
            const hasAttempted = sessionStorage.getItem('autoLoginAttempted');
            
            if (!hasAttempted) {
                sessionStorage.setItem('autoLoginAttempted', 'true');
                
                instance.ssoSilent(loginRequest || { scopes: ["openid", "profile"] }).catch(error => {
                    console.debug("Silent SSO failed. User is not logged in:", error);
                    // We purposefully DO NOT call loginRedirect here.
                    // This allows the user to browse as a guest without being forced to log in.
                });
            }
        }
    }, [instance, accounts.length, inProgress, loginRequest]);

    return null;
};
