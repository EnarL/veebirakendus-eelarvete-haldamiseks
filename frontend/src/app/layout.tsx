"use client";

import Sidebar from "@/app/components/Sidebar";
import { Box } from "@mui/material";
import ClientOnlyLayout from "@/app/ClientOnlyLayout";
import { AuthUserProvider, useAuthUser } from "@/app/context/AuthUserContext";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import Header from "@/app/components/Header";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AuthUserProvider>
            <html lang="en">
            <body>
            <AuthWrapper>
                <ClientOnlyLayout>
                    <ContentLayout>{children}</ContentLayout>
                </ClientOnlyLayout>
            </AuthWrapper>
            </body>
            </html>
        </AuthUserProvider>
    );
};

const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn, loading } = useAuthUser();

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

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

export default RootLayout;