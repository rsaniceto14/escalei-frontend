// src/components/PrivateRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { token, isLoading } = useAuth();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-echurch-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!token) {
        console.log('aaaaa')
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
