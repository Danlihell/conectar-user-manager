import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
    id: string;
    name: string;
    role: 'admin' | 'user';
}

interface AuthContextType {
    token: string | null;
    user: UserPayload | null;
    login: (newToken: string) => void;
    logout: () => void;
    isLoggedIn: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedPayload: { exp: number; sub: string; username: string; role: 'admin' | 'user' } = jwtDecode(storedToken);
                if (decodedPayload.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                } else {
                    setToken(storedToken);
                    setUser({ id: decodedPayload.sub, name: decodedPayload.username, role: decodedPayload.role });
                }
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        const decodedPayload: { sub: string; username: string; role: 'admin' | 'user' } = jwtDecode(newToken);
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser({ id: decodedPayload.sub, name: decodedPayload.username, role: decodedPayload.role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (

        <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};