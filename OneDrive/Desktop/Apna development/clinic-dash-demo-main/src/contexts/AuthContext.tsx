import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';

interface User {
    id: number;
    email: string;
    role: string;
    full_name?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isOtpVerified: boolean;
    user: User | null;
    signup: (data: any) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('auth_token'));
    const [isOtpVerified, setIsOtpVerified] = useState(() => localStorage.getItem('auth_otp_verified') === 'true');
    const [user, setUser] = useState<User | null>(null);

    const loadUser = async () => {
        try {
            const response = await authApi.me();
            setUser(response.data);
        } catch (error) {
            console.error('Failed to load user:', error);
            logout();
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadUser();
        }
    }, [isAuthenticated]);

    const signup = async (data: any) => {
        try {
            await authApi.signup(data);
            setIsOtpVerified(true);
            localStorage.setItem('auth_otp_verified', 'true');
        } catch (error: any) {
            console.error('Signup failed:', error);
            throw new Error(error.response?.data?.detail || 'Signup failed');
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            const { access_token } = response.data;

            localStorage.setItem('auth_token', access_token);
            setIsAuthenticated(true);
            setIsOtpVerified(true);
            localStorage.setItem('auth_otp_verified', 'true');
            await loadUser();
        } catch (error: any) {
            console.error('Login failed:', error);
            throw new Error(error.response?.data?.detail || 'Login failed');
        }
    };

    const verifyOtp = async (email: string, otp: string): Promise<{ success: boolean; message?: string }> => {
        try {
            await authApi.verifyOtp({ email, otp });
            setIsOtpVerified(true);
            localStorage.setItem('auth_otp_verified', 'true');
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.detail || 'Invalid OTP' };
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIsOtpVerified(false);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_otp_verified');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isOtpVerified, user, signup, login, verifyOtp, logout }}>
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
