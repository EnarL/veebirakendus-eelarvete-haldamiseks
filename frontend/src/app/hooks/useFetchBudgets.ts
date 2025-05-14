import { useEffect, useState, useCallback } from 'react';

const useFetchBudgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBudgets = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch budgets');
            }

            const data = await response.json();
            setBudgets(data);
        } catch (err) {
            // @ts-ignore
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    // Expose the fetchBudgets function as refetchBudgets for manual data refresh
    return { budgets, error, loading, refetchBudgets: fetchBudgets };
};

export default useFetchBudgets;