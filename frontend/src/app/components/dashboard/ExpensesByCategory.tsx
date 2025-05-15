import {Box, Grid, IconButton, Paper, Typography} from '@mui/material';
import {ArrowForward} from '@mui/icons-material';
import {memo, useMemo} from 'react';
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

// Only register the ChartJS elements we need
ChartJS.register(ArcElement, Tooltip, Legend);

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

// Using memo to prevent unnecessary re-renders
const ExpensesByCategory = memo(function ExpensesByCategory({
                                                                expenses,
                                                                colors,
                                                                navigateTo
                                                            }: ExpensesByCategoryProps): JSX.Element {
    // Helper function to format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('et-EE', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    // Get the current month name in Estonian - move outside component or memoize if needed
    const monthName = useMemo(() => {
        const month = new Intl.DateTimeFormat('et-EE', { month: 'long' }).format(new Date());
        return month.charAt(0).toUpperCase() + month.slice(1);
    }, []);

    // Calculate total expenses - memoize to avoid recalculation on each render
    const totalExpenses = useMemo(() =>
            expenses.reduce((acc, expense) => acc + expense.amount, 0),
        [expenses]
    );

    // Pre-calculate percentages once
    const expensesWithPercentages = useMemo(() =>
            expenses.map(expense => ({
                ...expense,
                percentage: ((expense.amount / totalExpenses) * 100).toFixed(1)
            })),
        [expenses, totalExpenses]
    );

    // Simplified chart options
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Remove legend to improve performance
                position: 'right' as const
            },
        },
        cutout: '65%',
        // Disable animations for initial render to speed up first paint
        animation: {
            duration: 0
        }
    };

    // Memoize chart data
    const categorySpendingData = useMemo(() => ({
        labels: expenses.map(expense => expense.categoryName),
        datasets: [
            {
                data: expenses.map(expense => expense.amount),
                backgroundColor: colors,
                borderWidth: 0,
            },
        ],
    }), [expenses, colors]);

    // Handle click without creating a new function on each render
    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigateTo('/transactions');
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
                '&:hover': { boxShadow: '0 6px 15px rgba(0,0,0,0.07)' },
                // Add hardware acceleration
                transform: 'translateZ(0)',
                willChange: 'transform',
            }}
            onClick={() => navigateTo('/transactions')}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{
                        color: "text.primary",
                        // Add fixed height to prevent layout shifts
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {monthName} kulutused kategooriate Järgi
                </Typography>
                <IconButton
                    color="primary"
                    onClick={handleIconClick}
                    aria-label="Vaata kõiki tehinguid" // Add an accessible name in Estonian
                    sx={{ transform: 'translateZ(0)' }}
                >
                    <ArrowForward />
                </IconButton>
            </Box>

            {/* Fixed height container for the chart */}
            <Box
                sx={{
                    height: 250,
                    width: '100%',
                    position: 'relative',
                    // Hardware acceleration
                    transform: 'translateZ(0)',
                }}
            >
                <Doughnut data={categorySpendingData} options={doughnutOptions} />
            </Box>

            {/* Categories list with fixed layout */}
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                    {expensesWithPercentages.map((expense, idx) => (
                        <Grid item xs={6} md={4} key={expense.id || idx}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1,
                                    borderRadius: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: colors[idx],
                                        mr: 1,
                                        flexShrink: 0,
                                    }}
                                />
                                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                    <Typography variant="body2" noWrap>{expense.categoryName}</Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {formatCurrency(expense.amount)} ({expense.percentage}%)
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Paper>
    );
});

export default ExpensesByCategory;