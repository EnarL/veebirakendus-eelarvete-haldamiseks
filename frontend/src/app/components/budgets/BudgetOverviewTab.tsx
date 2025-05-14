import React, { useEffect, useState, useCallback } from 'react';
import { Box, Card, CardContent, Grid, Paper, Typography, LinearProgress } from '@mui/material';
import { useSpentByCategory } from "@/app/hooks/useFetchSpentByCategory";

interface Budget {
    id: number;
    name: string;
    totalAmount: number;
    endDate: string;
    totalSpent?: number;
}

interface BudgetOverviewTabProps {
    budgets: Budget[];
}

// Component to fetch and calculate spent amount for a single budget
const BudgetSpentTracker: React.FC<{
    budget: Budget,
    onSpentUpdated: (budgetId: number, spent: number) => void
}> = ({ budget, onSpentUpdated }) => {
    const { data: spentData } = useSpentByCategory(budget.id, true);

    useEffect(() => {
        if (spentData && spentData.length > 0) {
            const calculatedTotal = spentData.reduce(
                (sum, category) => sum + (category.amount || 0), 0
            );
            onSpentUpdated(budget.id, calculatedTotal);
        }
    }, [spentData, budget.id, onSpentUpdated]);

    // This component doesn't render anything visually
    return null;
};

const BudgetOverviewTab: React.FC<BudgetOverviewTabProps> = ({ budgets }) => {
    // Track spent amounts for each budget
    const [spentAmounts, setSpentAmounts] = useState<Record<number, number>>({});

    // Calculate total spent across all budgets
    const totalSpent = Object.values(spentAmounts).reduce((sum, amount) => sum + amount, 0);

    // Calculate total budget amount
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.totalAmount, 0);

    // Calculate total percentage spent
    const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    // Use useCallback to memoize the handleSpentUpdated function
    // This prevents it from being recreated on every render
    const handleSpentUpdated = useCallback((budgetId: number, spent: number) => {
        setSpentAmounts(prev => ({
            ...prev,
            [budgetId]: spent
        }));
    }, []);

    return (
        <>
            {/* Hidden trackers to fetch spent data for each budget */}
            {budgets.map(budget => (
                <BudgetSpentTracker
                    key={budget.id}
                    budget={budget}
                    onSpentUpdated={handleSpentUpdated}
                />
            ))}

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Aktiivsed eelarved
                            </Typography>
                            <Typography variant="h4" component="div" color="primary">
                                {budgets.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Kogu eelarve
                            </Typography>
                            <Typography variant="h4" component="div" color="primary">
                                {totalBudget.toFixed(2)}€
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Kulutatud
                            </Typography>
                            <Typography variant="h4" component="div" color="primary">
                                {totalSpent.toFixed(2)}€
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper elevation={1} sx={{ p: 0, overflow: "hidden", mb: 3 }}>
                <Box sx={{ p: 2, backgroundColor: "primary.main", color: "white" }}>
                    <Typography variant="h6">
                        Hiljutised eelarved
                    </Typography>
                </Box>
                <Grid container spacing={0}>
                    {budgets.slice(0, 3).map((budget) => {
                        const budgetSpent = spentAmounts[budget.id] || 0;
                        const percentage = budget.totalAmount > 0 ?
                            Math.round((budgetSpent / budget.totalAmount) * 100) : 0;

                        return (
                            <Grid item xs={12} md={4} key={budget.id}>
                                <Card sx={{ m: 2, height: "calc(100% - 32px)" }}>
                                    <CardContent>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                            <Typography variant="subtitle1" component="div">
                                                {budget.name}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Tähtaeg: {new Date(budget.endDate).toLocaleDateString('et-EE')}
                                        </Typography>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                            <Typography variant="body2">
                                                {budgetSpent.toFixed(2)}€ / {budget.totalAmount.toFixed(2)}€
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color={
                                                    percentage > 90 ? 'error.main' :
                                                        percentage > 75 ? 'warning.main' : 'success.main'
                                                }
                                            >
                                                {percentage}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(percentage, 100)}
                                            color={
                                                percentage > 90 ? 'error' :
                                                    percentage > 75 ? 'warning' : 'success'
                                            }
                                            sx={{ height: 4, borderRadius: 1, mt: 1 }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Paper>
        </>
    );
};

export default BudgetOverviewTab;