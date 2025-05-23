// src/routes/PrivateRouter.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from 'src/contexts/UserContext'; // Thêm useUser

const PrivateRoute = ({ children }) => {
    const { user } = useUser(); // Lấy user từ UserContext
    const location = useLocation();

    if (!user.isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;