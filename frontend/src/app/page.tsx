"use client";
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';

import { useAllUserTransactions, useUserExpenses } from '@/app/hooks/useTransactionHooks';
import useFetchBudgets from '@/app/hooks/useFetchBudgets';
import useFetchGoals from '@/app/hooks/useFetchGoals';
import { useMonthlySummary } from '@/app/hooks/useMonthlySummary';
import BudgetOverview from '@/app/components/dashboard/BudgetOverview';
import ExpensesByCategory from '@/app/components/dashboard/ExpensesByCategory';
import RecentTransactions from '@/app/components/dashboard/RecentTransactions';
import FinancialGoals from '@/app/components/dashboard/FinancialGoals';
import { useTotalSpentAmount } from '@/app/hooks/useTotalSpent';

export default function Dashboard(): JSX.Element {
    const { transactions, loading: transactionsLoading, error: transactionsError } = useAllUserTransactions();
    const { expenses, loading: expensesLoading, error: expensesError } = useUserExpenses();
    const { budgets, loading: budgetsLoading, error: budgetsError } = useFetchBudgets();
    const { goals, loading: goalsLoading, error: goalsError } = useFetchGoals();
    const { data: monthlySummary, loading: summaryLoading, error: summaryError } = useMonthlySummary();

    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const navigateTo = (path: string): void => {
        router.push(path);
    };

    const budgetId = budgets.length > 0 ? budgets[0].id : null;
    const { totalSpent, loading: totalSpentLoading, error: totalSpentError } = useTotalSpentAmount(budgetId);

    if (expensesLoading || budgetsLoading || goalsLoading || transactionsLoading || summaryLoading || totalSpentLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }
    if (expensesError || budgetsError || goalsError || transactionsError || summaryError || totalSpentError) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography variant="h6" color="error">
                    {expensesError || budgetsError || goalsError || transactionsError || summaryError || totalSpentError}
                </Typography>
            </Box>
        );
    }

    const colors = expenses.map((_, idx) => `hsl(${(idx * 360) / expenses.length}, 70%, 50%)`);

    return (
        <Grid container spacing={isMobile ? 1 : 2}>
            <Grid item xs={12} md={4}>
                <BudgetOverview budgets={budgets} totalSpent={totalSpent} navigateTo={navigateTo} />
            </Grid>
            <Grid item xs={12} md={4}>
                <ExpensesByCategory expenses={expenses} colors={colors} navigateTo={navigateTo} />
            </Grid>
            <Grid item xs={12} md={4}>
                <FinancialGoals goals={goals} navigateTo={navigateTo} />
            </Grid>
            <Grid item xs={12}>
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        mt: isMobile ? 1 : 2,
                    }}
                >
                    <RecentTransactions transactions={transactions.slice(5, 9)} navigateTo={navigateTo} />
                </Box>
            </Grid>
        </Grid>
    );
}