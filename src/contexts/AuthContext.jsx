import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const syncUserToBackend = async (firebaseUser, role = 'buyer') => {
        try {
            const token = await firebaseUser.getIdToken();

            // Sync with backend
            const response = await fetch('http://localhost:5000/api/auth/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    role,
                    name: firebaseUser.displayName
                })
            });

            if (!response.ok) {
                console.error('Backend sync failed');
                return null;
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Error syncing user:', error);
            return null;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Get fresh token
                const token = await currentUser.getIdToken();
                // Store minimal info locally if needed, but rely on context for state

                // Sync to get role/db data
                const backendUser = await syncUserToBackend(currentUser);

                setUser({ ...currentUser, ...backendUser, token });
                setUserRole(backendUser?.role || 'buyer');
            } else {
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = async (email, password, name, role = 'buyer') => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });

        // Force token refresh to update profile? No need, just sync
        const backendUser = await syncUserToBackend(result.user, role);
        setUserRole(backendUser?.role);
        return result;
    };

    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const backendUser = await syncUserToBackend(result.user);
        setUserRole(backendUser?.role);
        return result;
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setUserRole(null);
    };

    const isAdminUser = user?.email === 'jhasaurav562@gmail.com' || userRole === 'admin';
    const isSeller = userRole === 'seller' || isAdminUser;

    const value = {
        user,
        userRole,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        isAdmin: isAdminUser,
        isSeller
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
