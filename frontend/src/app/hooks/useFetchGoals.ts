import { useEffect, useState } from 'react';

const useFetchGoals = () => {
    const [goals, setGoals] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
        const fetchGoals = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goal`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch goals');
                }

                const data = await response.json();
                setGoals(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchGoals();
        }, []);

        return { goals, loading, error, refetch: fetchGoals };
};

export default useFetchGoals;