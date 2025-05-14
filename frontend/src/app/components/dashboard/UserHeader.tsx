import { Box, Grid, Paper, Typography } from '@mui/material';

interface UserHeaderProps {
    monthlyExpenses: number;
    monthlyIncomes: number;
}

export default function UserHeader({ monthlyExpenses, monthlyIncomes }: UserHeaderProps): JSX.Element {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('et-EE', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const profitOrLoss = monthlyIncomes - monthlyExpenses;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '20vh',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                }}
            >
                <Grid container spacing={6}>
                    <Grid item xs={4}>
                        <Box>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Monthly Expenses</Typography>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'inline-block',
                                }}
                            >
                                {formatCurrency(monthlyExpenses)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Monthly Incomes</Typography>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(90deg, #42a5f5, #478ed1)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'inline-block',
                                }}
                            >
                                {formatCurrency(monthlyIncomes)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Profit/Loss</Typography>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    background: profitOrLoss >= 0
                                        ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
                                        : 'linear-gradient(90deg, #e53935, #ef5350)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'inline-block',
                                }}
                            >
                                {formatCurrency(profitOrLoss)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}