import {useEffect, useState} from 'react';

export interface MonthlySummary {
    month: number;
    totalIncome: number;
    totalExpense: number;
}

export function useMonthlySummary() {
    const [data, setData] = useState<MonthlySummary[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMonthlySummary = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/monthlySummary`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result: MonthlySummary[] = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlySummary();
    }, []);

    return { data, loading, error };
}