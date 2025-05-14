import { useState, useEffect } from "react";

export const useSpentByCategory = (budgetId: number | null) => {
    const [data, setData] = useState<Record<string, number> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!budgetId) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        const fetchSpentByCategory = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/${budgetId}/spent-by-category`, {
                    method: "GET",
                    credentials: "include", // Include cookies if needed
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSpentByCategory();
    }, [budgetId]);

    return { data, loading, error };
};