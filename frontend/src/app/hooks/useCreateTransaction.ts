import { useState } from 'react';

export const useCreateTransaction = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createTransaction = async (transactionData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create transaction');
            }

            const result = await response.json();
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred while creating transaction');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createTransaction, loading, error, success };
};