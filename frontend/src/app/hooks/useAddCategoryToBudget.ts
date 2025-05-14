import { useState } from 'react';

interface AddCategoryResponse {
    success: boolean;
    message?: string;
    categoryId?: number;
}

export const useAddCategoryToBudget = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const addCategoryToBudget = async (budgetId: number, categoryName: string): Promise<AddCategoryResponse> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/budgets/${budgetId}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryName }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || 'Failed to add category to budget';
                throw new Error(errorMessage);
            }
            let categoryId: number | undefined;
            try {
                const responseData = await response.json();
                categoryId = responseData.id || responseData.categoryId;
            } catch (e) {
            }

            setSuccess(true);
            return { success: true, categoryId };
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { addCategoryToBudget, loading, error, success };
};