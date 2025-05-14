import { useState, useCallback } from "react";

export const useTotalSpentAmount = () => {
    const [totalSpent, setTotalSpent] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTotalSpent = useCallback(async (budgetId: number) => {
        if (!budgetId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/${budgetId}/total-spent`, {
                method: "GET",
                credentials: "include", // Include cookies
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setTotalSpent(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { totalSpent, loading, error, fetchTotalSpent };
};