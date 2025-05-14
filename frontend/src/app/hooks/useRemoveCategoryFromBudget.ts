import { useState } from 'react';

interface RemoveCategoryResponse {
    success: boolean;
    message?: string;
}

export const useRemoveCategoryFromBudget = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const removeCategoryFromBudget = async (budgetId: number, categoryId: number): Promise<RemoveCategoryResponse> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/budgets/${budgetId}/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || 'Failed to remove category from budget';
                throw new Error(errorMessage);
            }

            setSuccess(true);
            return { success: true };
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { removeCategoryFromBudget, loading, error, success };
};