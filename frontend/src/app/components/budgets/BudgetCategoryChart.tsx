"use client"
import React from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryData {
    categoryName: string;
    amount: number;
}

interface BudgetCategoryChartProps {
    budgetId: number;
    budgetName: string;
    categoryData: CategoryData[] | null;
    loading: boolean;
    error: string | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const BudgetCategoryChart: React.FC<BudgetCategoryChartProps> = ({
                                                                     budgetId,
                                                                     budgetName,
                                                                     categoryData,
                                                                     loading,
                                                                     error
                                                                 }) => {
    const chartData = React.useMemo(() => {
        if (!categoryData) return null;

        return {
            labels: categoryData.map((item) => item.categoryName),
            datasets: [
                {
                    data: categoryData.map((item) => item.amount),
                    backgroundColor: COLORS,
                    borderWidth: 0,
                },
            ],
        };
    }, [categoryData]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                Kategooriate andmete laadimisel tekkis viga: {error}
            </Alert>
        );
    }

    if (!categoryData || categoryData.length === 0) {
        return (
            <Alert severity="info" sx={{ mb: 2 }}>
                Selle eelarve jaoks pole veel kategooriate kulusid.
            </Alert>
        );
    }

    const totalSpent = categoryData.reduce((sum, item) => sum + item.amount, 0);

    return (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                {budgetName} - Kulud kategooriate kaupa
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Kogukulu: {totalSpent.toFixed(2)} €
            </Typography>

            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Doughnut data={chartData} options={{
                    responsive: true,
                    plugins: {
                        legend: { position: 'right' },
                    },
                    cutout: '65%',
                }} />
            </Box>
        </Paper>
    );
};

export default BudgetCategoryChart;