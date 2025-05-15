"use client";
import React, {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {Box} from "@mui/material";
import Sidebar from "@/app/components/Sidebar";
import {AuthUserProvider, useAuthUser} from "@/app/context/AuthUserContext";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import Header from "@/app/components/Header";
import useTokenRefresh from "@/app/hooks/useRefreshToken";

const ClientOnlyLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <AuthUserProvider>
            <AuthWrapper>
                <ClientContent isClient={isClient} pathname={pathname} router={router}>
                    {children}
                </ClientContent>
            </AuthWrapper>
        </AuthUserProvider>
    );
};

const ClientContent: React.FC<{
    children: React.ReactNode;
    isClient: boolean;
    pathname: string;
    router: ReturnType<typeof useRouter>;
}> = ({ children, isClient, pathname, router }) => {
    const { isLoggedIn, loading } = useAuthUser();

    useTokenRefresh();

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

    // Loading state
    if (!isClient || loading || (!isLoggedIn && pathname !== "/login" && pathname !== "/register")) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    // Main layout with conditional rendering based on auth state
    return (
        <>
            {isLoggedIn && (
                <>
                    <Header />
                    <Box sx={{ display: "flex" }}>
                        <Sidebar />
                        <Box
                            sx={{
                                flexGrow: 1,
                                ml: { xs: 0, md: "260px" },
                                pt: "72px",
                                width: { xs: "100%", md: `calc(100% - 260px)` },
                            }}
                        >
                            {children}
                        </Box>
                    </Box>
                </>
            )}
            {!isLoggedIn && <Box>{children}</Box>}
        </>
    );
};

export default ClientOnlyLayout;