import React from "react";
import { Navigate } from "react-router-dom";
import useUserStore from '@/stores/useUserStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isLogin } = useUserStore();
    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;