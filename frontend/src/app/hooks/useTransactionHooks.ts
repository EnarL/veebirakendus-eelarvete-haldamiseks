import {useCallback, useEffect, useState} from 'react';
export const useAllUserTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Create a fetchTransactions function and memoize it with useCallback
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();
            setTransactions(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching transactions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return { transactions, loading, error, refetchTransactions: fetchTransactions };
};

export const useUserExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/expenses`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Failed to fetch expenses');
                }
                const data = await response.json();
                setExpenses(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    return { expenses, loading, error };
};

export const useUserIncomes = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transcation/incomes`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Failed to fetch incomes');
                }
                const data = await response.json();
                setIncomes(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIncomes();
    }, []);

    return { incomes, loading, error };
};