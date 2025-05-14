import 'chart.js/auto';
import { Box, Paper, Typography, Button, Card, CardContent, Grid, LinearProgress } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

export interface Budget {
    id: string;
    name: string;
    totalAmount: number;
    color?: string;
}

interface BudgetOverviewProps {
    budgets: Budget[];
    totalSpent: number | null;
    navigateTo: (path: string) => void;
}

export default function BudgetOverview({ budgets, totalSpent, navigateTo }: BudgetOverviewProps): JSX.Element {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('et-EE', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ color: "text.primary" }}>
                    Eelarved
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    endIcon={<ArrowForward />}
                    onClick={() => navigateTo('/budgets')}
                    sx={{ borderRadius: 2 }}
                >
                    Kõik eelarved
                </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {budgets.map((budget, idx) => {
                    const progressValue =totalSpent > 0
                        ? Math.min((totalSpent / budget.totalAmount) * 100, 100)
                        : 0;

                    return (
                        <Card
                            key={idx}
                            sx={{
                                borderLeft: `4px solid`,
                                borderLeftColor: budget.color || 'primary.main',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                cursor: 'pointer',
                                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 15px rgba(0,0,0,0.07)' },
                            }}
                            onClick={() => navigateTo(`/budgets/${budget.id}`)}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 1 }}>{budget.name}</Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">Kokku</Typography>
                                        <Typography variant="body1" fontWeight="medium">{formatCurrency(budget.totalAmount)}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">Kulutatud</Typography>
                                        <Typography variant="body1" fontWeight="medium">{formatCurrency(totalSpent || 0)}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">Alles</Typography>
                                        <Typography variant="body1" fontWeight="medium">{formatCurrency(budget.totalAmount - totalSpent || 0)}</Typography>
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 2, mb: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Number.isFinite(progressValue) ? progressValue : 0} // Ensure value is finite
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(0,0,0,0.05)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: budget.color || 'primary.main',
                                            },
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" align="right">
                                    {Math.round(progressValue)}% kasutatud
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>
        </Paper>
    );
}