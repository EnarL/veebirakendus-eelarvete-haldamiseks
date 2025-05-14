"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/app/context/AuthUserContext";

interface UseLogoutReturn {
    logout: () => Promise<void>;
    error: string | null;
    isLoading: boolean;
}

export function useLogout(): UseLogoutReturn {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setIsLoggedIn } = useAuthUser();

    const logout = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Logout failed");
            }

            setIsLoggedIn(false);
            router.push("/login"); // Redirect to login after logout
        } catch (err: any) {
            console.error("Logout error:", err);
            setError(err.message || "Logout failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return { logout, error, isLoading };
}