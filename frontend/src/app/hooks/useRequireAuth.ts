import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/app/context/AuthUserContext";

export const useRequireAuth = () => {
    const { isLoggedIn } = useAuthUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, router]);

    return { isLoggedIn };
};
export default useRequireAuth;