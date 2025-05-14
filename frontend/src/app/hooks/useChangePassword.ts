import { useState, useCallback } from 'react';

export function useChangePassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const changePassword = useCallback(async (passwordData: { currentPassword: string, newPassword: string, confirmationPassword: string }) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/changepassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(passwordData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    return { changePassword, loading, error, success };
}