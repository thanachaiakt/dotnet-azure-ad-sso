import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { Navigate } from "react-router";
import React from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectPath?: string;
    loadingComponent?: React.ReactNode;
}

export const ProtectedRoute = ({ 
    children, 
    redirectPath = "/", 
    loadingComponent 
}: ProtectedRouteProps) => {
    const isAuthenticated = useIsAuthenticated();
    const { inProgress } = useMsal();

    if (inProgress !== InteractionStatus.None) {
        return (
            loadingComponent || (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        border: '3px solid #333', borderTopColor: '#646cff',
                        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )
        ) as React.ReactElement;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return children as React.ReactElement;
};
