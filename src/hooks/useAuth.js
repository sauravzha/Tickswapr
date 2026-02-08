import { useContext } from 'react';
import { AuthContext, useAuth as useAuthContext } from '../contexts/AuthContext';

// Re-export the useAuth hook from AuthContext
export const useAuth = useAuthContext;

// Additional auth utilities
export const useAuthState = () => {
    const { user, loading } = useAuth();

    return {
        user,
        loading,
        isAuthenticated: !!user,
        isLoading: loading
    };
};

export const useUserRole = () => {
    const { userRole, isAdmin, isSeller } = useAuth();

    return {
        role: userRole,
        isAdmin,
        isSeller,
        isBuyer: userRole === 'buyer'
    };
};

export const useRequireAuth = (redirectTo = '/login') => {
    const { user, loading } = useAuth();

    // Return state for components to handle redirect
    return {
        user,
        loading,
        shouldRedirect: !loading && !user,
        redirectTo
    };
};

export default useAuth;
