// Modified useDeleteTransaction.ts
import { useState } from 'react';

export const useDeleteTransaction = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [deletedId, setDeletedId] = useState<number | null>(null);

    const deleteTransaction = async (id) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        setDeletedId(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete transaction');
            }

            setSuccess(true);
            setDeletedId(id); // Store the deleted ID
            return true; // Return successful result
        } catch (err) {
            setError(err.message || 'An error occurred while deleting');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteTransaction, loading, error, success, deletedId };
};