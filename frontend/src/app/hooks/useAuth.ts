"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {useAuthUser} from "@/app/context/AuthUserContext";

interface LoginCredentials {
    username: string;
    password: string;
}

interface UseAuthReturn {
    login: (credentials: LoginCredentials) => Promise<void>;
    error: string | null;
    isLoading: boolean;
}

export function useAuth(): UseAuthReturn {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setIsLoggedIn } = useAuthUser();

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                }),
                credentials: 'include',
            });

            if (response.ok) {
                setError('');
                setIsLoggedIn(true);
                router.push('/');
            } else {
                setError("Vigased sisselogimisandmed. Palun proovi uuesti.");
                setIsLoading(false); // Reset loading state when login fails
            }
        } catch (error) {
            console.error('Sisselogimine ebaõnnestus:', error);
            setError('Tekkis viga. Palun proovi uuesti.');
            setIsLoading(false); // Reset loading state on error
        } finally {
            setIsLoading(false); // Reset loading state after the request

        }
    };

    return { login, error, isLoading };
}