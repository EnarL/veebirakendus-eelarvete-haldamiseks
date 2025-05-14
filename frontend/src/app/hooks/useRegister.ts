"use client";

import {useState} from 'react';

interface RegistrationCredentials {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
}

interface UseRegisterReturn {
    register: (credentials: RegistrationCredentials) => Promise<void>;
    error: string | null;
    isLoading: boolean;
}

export function useRegister(): UseRegisterReturn {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const register = async (credentials: RegistrationCredentials) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                // For error responses, try to parse as JSON first
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    throw new Error(data.message || 'Registreerimine ebaõnnestus');
                } else {
                    // If not JSON, get the text
                    const text = await response.text();
                    throw new Error(text || 'Registreerimine ebaõnnestus');
                }
            }

            // Handle successful response
            // Check the content type before trying to parse as JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                // For plain text success messages, just return the text
                const text = await response.text();
                return { message: text };
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registreerimisel tekkis viga');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { register, error, isLoading };
}