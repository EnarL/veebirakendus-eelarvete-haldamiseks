"use client";
import { useEffect } from "react";
import { useAuthUser } from "@/app/context/AuthUserContext";

const useTokenRefresh = () => {
    const { isLoggedIn } = useAuthUser();

    useEffect(() => {
        if (!isLoggedIn) {
            console.log("User is not authenticated, skipping token refresh.");
            return;
        }

        const refreshAccessToken = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
                    method: "POST",
                    credentials: "include",
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        console.error("Failed to refresh token, user is not authenticated.");
                    } else {
                        console.error("Failed to refresh token, logging out...");
                    }
                }
            } catch (error) {
                console.error("Error refreshing token:", error);
            }
        };

        refreshAccessToken();
        const interval = setInterval(refreshAccessToken, 8 * 60 * 1000);

        return () => clearInterval(interval);
    }, [isLoggedIn]);

    return null;
};

export default useTokenRefresh;