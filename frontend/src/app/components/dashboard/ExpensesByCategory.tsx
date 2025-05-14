import { Box, Paper, Typography, Grid, IconButton } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Doughnut } from 'react-chartjs-2';

// Define types
export interface Expense {
    id: string;
    amount: number;
    categoryName: string;
}

interface ExpensesByCategoryProps {
    expenses: Expense[];
    colors: string[];
    navigateTo: (path: string) => void;
}

export default function ExpensesByCategory({ expenses, colors, navigateTo }: ExpensesByCategoryProps): JSX.Element {
    // Helper function to format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('et-EE', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    // Get the current month name in Estonian
    const getCurrentMonthName = (): string => {
        const month = new Intl.DateTimeFormat('et-EE', { month: 'long' }).format(new Date());
        return month.charAt(0).toUpperCase() + month.slice(1);
    };

    // Calculate total expenses
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    // Chart options
    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'right' as const },
        },
        cutout: '65%',
    };

    // Chart data
    const categorySpendingData = {
        labels: expenses.map(expense => expense.categoryName),
        datasets: [
            {
                data: expenses.map(expense => expense.amount),
                backgroundColor: colors,
                borderWidth: 0,
            },
        ],
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': { boxShadow: '0 6px 15px rgba(0,0,0,0.07)' }
            }}
            onClick={() => navigateTo('/transactions')}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ color: "text.primary" }}>
                    {getCurrentMonthName()} kulutused kategooriate Järgi
                </Typography>
                <IconButton
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigateTo('/transactions');
                    }}
                >
                    <ArrowForward />
                </IconButton>
            </Box>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Doughnut data={categorySpendingData} options={doughnutOptions} />
            </Box>
            <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    {expenses.map((expense, idx) => (
                        <Grid item xs={6} md={4} key={idx}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1,
                                    borderRadius: 2,
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        backgroundColor: colors[idx],
                                        mr: 1
                                    }}
                                />
                                <Box>
                                    <Typography variant="body2">{expense.categoryName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatCurrency(expense.amount)} ({((expense.amount / totalExpenses) * 100).toFixed(1)}%)
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Paper>
    );
}