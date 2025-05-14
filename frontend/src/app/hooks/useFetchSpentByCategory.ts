import { useState, useEffect } from "react";

interface CategoryData {
    categoryName: string;
    amount: number;
}

export const useSpentByCategory = (budgetId: number | null, alwaysFetch: boolean = false) => {
    const [data, setData] = useState<CategoryData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!budgetId && !alwaysFetch) {
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


                const result = await response.json() as Record<string, unknown>;


                const transformedData: CategoryData[] = Object.entries(result).map(([categoryName, amount]) => ({
                    categoryName,

                    amount: typeof amount === 'number' ? amount :
                        typeof amount === 'string' ? parseFloat(amount) : 0,
                }));

                setData(transformedData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSpentByCategory();
    }, [budgetId, alwaysFetch]);

    return { data, loading, error };
};