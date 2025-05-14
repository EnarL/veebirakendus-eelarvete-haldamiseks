import { useState, useEffect } from "react";

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

export const useFetchUserData = () => {
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Failed to fetch user data");
                }

                const data = await response.json();
                setUserData(data);
            } catch (err: any) {
                setError(err.message || "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { userData, loading, error };
};