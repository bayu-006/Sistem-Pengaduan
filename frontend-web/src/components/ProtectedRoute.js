import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, requiredRole }) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role;

    // Jika tidak login, redirect ke login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Jika route membutuhkan role tertentu
    if (requiredRole) {
        // Cek apakah user role sesuai
        if (Array.isArray(requiredRole)) {
            if (!requiredRole.includes(userRole)) {
                return <Navigate to="/login" replace />;
            }
        } else {
            if (userRole !== requiredRole) {
                return <Navigate to="/login" replace />;
            }
        }
    }

    return element;
};

export default ProtectedRoute;
