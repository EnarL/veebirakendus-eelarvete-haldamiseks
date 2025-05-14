"use client"
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUserContextType {
    isLoggedIn: boolean;
    kasutajanimi: string;
    eesnimi: string;
    perekonnanimi: string;
    email: string;
    loading: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setKasutajanimi: (username: string) => void;
    setEesnimi: (firstname: string) => void;
    setPerekonnanimi: (lastname: string) => void;
    setEmail: (email: string) => void;
    logout: () => Promise<void>;
}

const AuthUserContext = createContext<AuthUserContextType | undefined>(undefined);

export const AuthUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [kasutajanimi, setKasutajanimi] = useState('');
    const [eesnimi, setEesnimi] = useState('');
    const [perekonnanimi, setPerekonnanimi] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setKasutajanimi(data.kasutajanimi);
                setEesnimi(data.eesnimi);
                setPerekonnanimi(data.perekonnanimi);
                setEmail(data.email);
                setIsLoggedIn(true);
            } else {
                console.info("User is not logged in");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setIsLoggedIn(false);
                setKasutajanimi("");
                setEesnimi("");
                setPerekonnanimi("");
                setIsLoggedIn(false);
                router.push("/login");
            } else {
                console.error("Failed to log out");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [router]);

    return (
        <AuthUserContext.Provider
            value={{
        isLoggedIn,
            kasutajanimi,
            eesnimi,
            perekonnanimi,
            email,
            loading,
            setIsLoggedIn,
            setKasutajanimi,
            setEesnimi,
            setPerekonnanimi,
            setEmail,
            logout,
    }}
>
    {children}
    </AuthUserContext.Provider>
);
};

export const useAuthUser = (): AuthUserContextType => {
    const context = React.useContext(AuthUserContext);
    if (!context) {
        throw new Error('useAuthUser must be used within an AuthUserProvider');
    }
    return context;
};