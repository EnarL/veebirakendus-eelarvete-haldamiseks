import React from "react";
import useAuth from "@/app/api/check-session";
import { useLogout } from "@/app/hooks/useLogout";
import { useAuthUser } from "@/app/context/AuthUserContext";
import {LogoutButton} from "@/app/components/LogoutButton";

const AuthLinks: React.FC = () => {
    const { loading } = useAuth();
    const { logout, isLoading, error } = useLogout();
    const { isLoggedIn } = useAuthUser();

    if (loading || isLoading || !isLoggedIn) {
        return null;
    }

    return (
        <div className="flex flex-row items-center space-x-2">
            <a
                href="#"
                onClick={async (event) => {
                    event.preventDefault();
                    try {
                        await logout();
                        console.log("User logged out successfully");
                    } catch (err) {
                        console.error("Logout failed:", error);
                    }
                }}
                className="hover:text-green-500 text-[18px]"
            >
               <LogoutButton />
            </a>
        </div>
    );
};

export default AuthLinks;