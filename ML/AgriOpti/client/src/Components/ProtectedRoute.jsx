import React from 'react';
import { Navigate } from 'react-router-dom';
import { canVisit } from '../utils/roleAccess';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Not logged in → redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role restriction provided and user doesn't qualify → redirect to dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace state={{ accessDenied: true }} />;
    }

    return children;
};

export default ProtectedRoute;
