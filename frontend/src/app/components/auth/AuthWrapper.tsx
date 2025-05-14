"use client";
import useAuth from "@/app/api/check-session";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    useAuth();

    return <>{children}</>;
};

export default AuthWrapper;