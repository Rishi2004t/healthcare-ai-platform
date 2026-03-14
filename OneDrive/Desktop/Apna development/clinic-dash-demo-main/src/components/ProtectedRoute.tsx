import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireOtp?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireOtp = false }) => {
    const { isAuthenticated, isOtpVerified } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireOtp && !isOtpVerified) {
        return <Navigate to="/otp" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
