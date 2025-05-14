import { Box, Paper, Typography, Button, Card, CardContent, Avatar, LinearProgress } from '@mui/material';
import { ArrowForward, DateRange, MonetizationOn } from '@mui/icons-material';

// Define types
export interface Goal {
    id: string;
    name: string;
    target: number;
    current: number;
    deadline: string;
    progress?: number; // Optional if calculated dynamically
}

interface FinancialGoalsProps {
    goals: Goal[];
    navigateTo: (path: string) => void;
}

export default function FinancialGoals({ goals, navigateTo }: FinancialGoalsProps): JSX.Element {
    // Helper functions
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('et-EE', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const formatDate = (date: string): string => {
        return new Date(date).toLocaleDateString('et-EE');
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                position: 'relative'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ color: "text.primary" }}>
                    Eesmärgid
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    endIcon={<ArrowForward />}
                    onClick={() => navigateTo('/goals')}
                    sx={{ borderRadius: 2 }}
                >
                    Kõik eesmärgid
                </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {goals.map((goal, idx) => {
                    // Calculate the progress percentage
                    const progressValue = goal.target > 0
                        ? Math.min((goal.current / goal.target) * 100, 100)
                        : 0;

                    return (
                        <Card
                            key={idx}
                            sx={{
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                cursor: 'pointer',
                                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 15px rgba(0,0,0,0.07)' }
                            }}
                            onClick={() => navigateTo('/goals')}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6">{goal.name}</Typography>
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: "primary.light",
                                            color: "primary.dark",
                                        }}
                                    >
                                        <MonetizationOn />
                                    </Avatar>
                                </Box>

                                <Box sx={{ mt: 2, mb: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Number.isFinite(progressValue) ? progressValue : 0}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(0,0,0,0.05)',
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {Math.round(progressValue)}%
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <DateRange sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Tähtaeg: {formatDate(goal.deadline)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>
        </Paper>
    );
}