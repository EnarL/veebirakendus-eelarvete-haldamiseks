"use client";
import {useRouter} from 'next/navigation';
import {Box, CircularProgress, Typography, useMediaQuery, useTheme} from '@mui/material';
import Grid from '@mui/material/Grid';
import {useMemo} from 'react';

import {useAllUserTransactions, useUserExpenses} from '@/app/hooks/useTransactionHooks';
import useFetchBudgets from '@/app/hooks/useFetchBudgets';
import useFetchGoals from '@/app/hooks/useFetchGoals';
import {useMonthlySummary} from '@/app/hooks/useMonthlySummary';
import BudgetOverview from '@/app/components/dashboard/BudgetOverview';
import ExpensesByCategory from '@/app/components/dashboard/ExpensesByCategory';
import RecentTransactions from '@/app/components/dashboard/RecentTransactions';
import FinancialGoals from '@/app/components/dashboard/FinancialGoals';
import {useTotalSpentAmount} from '@/app/hooks/useTotalSpent';

export default function Dashboard(): JSX.Element {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    let error = null;

    const { transactions, loading: transactionsLoading } = useAllUserTransactions();
    if (!transactions && !transactionsLoading) error = "Failed to load transactions";

    const { expenses, loading: expensesLoading } = useUserExpenses();
    if (!expenses && !expensesLoading && !error) error = "Failed to load expenses";

    const { budgets, loading: budgetsLoading } = useFetchBudgets();
    if (!budgets && !budgetsLoading && !error) error = "Failed to load budgets";

    const { goals, loading: goalsLoading } = useFetchGoals();
    if (!goals && !goalsLoading && !error) error = "Failed to load goals";
    const navigateTo = (path: string): void => {
        router.push(path);
    };

    const budgetId = budgets && budgets.length > 0 ? budgets[0].id : null;
    const { totalSpent, loading: totalSpentLoading } = useTotalSpentAmount(budgetId);


    const colors = useMemo(() => {
        if (!expenses) return [];
        return expenses.map((_, idx) => `hsl(${(idx * 360) / expenses.length}, 70%, 50%)`);
    }, [expenses]);

    const initialLoading = expensesLoading || budgetsLoading || goalsLoading || transactionsLoading;

    if (initialLoading && !expenses && !budgets && !goals && !transactions) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    // Simplified error handling
    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={isMobile ? 1 : 2}>
            {/* Expenses By Category - LCP element given priority */}
            <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
                {expenses && (
                    <ExpensesByCategory
                        expenses={expenses}
                        colors={colors}
                        navigateTo={navigateTo}
                    />
                )}
            </Grid>

            {/* Budget Overview */}
            <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
                {budgets && (
                    <BudgetOverview
                        budgets={budgets}
                        totalSpent={totalSpent}
                        navigateTo={navigateTo}
                    />
                )}
            </Grid>

            {/* Financial Goals */}
            <Grid item xs={12} md={4} order={{ xs: 3, md: 3 }}>
                {goals && (
                    <FinancialGoals
                        goals={goals}
                        navigateTo={navigateTo}
                    />
                )}
            </Grid>

            {/* Recent Transactions - lower priority */}
            <Grid item xs={12} order={{ xs: 4, md: 4 }}>
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        mt: isMobile ? 1 : 2,
                    }}
                >
                    {transactions && (
                        <RecentTransactions
                            transactions={transactions.slice(0, 4)}
                            navigateTo={navigateTo}
                        />
                    )}
                </Box>
            </Grid>
        </Grid>
    );
}