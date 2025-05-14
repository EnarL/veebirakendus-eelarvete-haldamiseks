"use client";
import React, { useState, useEffect } from "react";
import { useAuthUser } from "@/app/context/AuthUserContext";
import useTokenRefresh from "@/app/hooks/useRefreshToken";
import { useRouter, usePathname } from "next/navigation";

const ClientOnlyLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { loading, isLoggedIn } = useAuthUser();
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useTokenRefresh();

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Redirect immediately if not logged in
    useEffect(() => {
        if (
            isClient &&
            !loading &&
            !isLoggedIn &&
            pathname !== "/login" &&
            pathname !== "/register"
        ) {
            router.replace("/login");
        }
    }, [isClient, loading, isLoggedIn, pathname, router]);

    // Render nothing until authentication state is resolved
    if (!isClient || loading || (!isLoggedIn && pathname !== "/login" && pathname !== "/register")) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ClientOnlyLayout;