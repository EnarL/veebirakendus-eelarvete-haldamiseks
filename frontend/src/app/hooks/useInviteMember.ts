import {useState} from "react";

export const useInviteMember = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const inviteMember = async (budgetId: number, inviteeEmail: string) => {
        if (!inviteeEmail || !inviteeEmail.includes('@')) {
            setError('Invalid email address');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/budget/${budgetId}/invite?inviteeEmail=${encodeURIComponent(inviteeEmail)}`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to invite member');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { inviteMember, loading, error, success };
};