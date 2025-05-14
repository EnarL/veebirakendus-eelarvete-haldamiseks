import { useEffect, useState } from 'react';
import { useAuthUser } from '@/app/context/AuthUserContext';

const useAuth = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuthUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (!isLoggedIn) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-session`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [isLoggedIn, setIsLoggedIn]);

    return { loading };
};

export default useAuth;