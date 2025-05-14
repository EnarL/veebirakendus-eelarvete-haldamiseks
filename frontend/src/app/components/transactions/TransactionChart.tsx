"use client";

import {Box, Paper} from '@mui/material';
import {Bar} from 'react-chartjs-2';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Transaction {
    transactionType: 'INCOME' | 'EXPENSE';
    amount: number;
    transactionDate: string;
    categoryName: string;
    description: string;
}

interface TransactionsChartProps {
    transactions: Transaction[];
    loading: boolean;
}

export default function TransactionsChart({ transactions, loading }: TransactionsChartProps) {
    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Igakuised Kulud ja Tulud' },
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true }
        },
    };

    const processChartData = () => {
        if (loading || !transactions.length) {
            return {
                labels: [],
                datasets: [
                    {
                        label: 'Kulud',
                        data: [],
                        backgroundColor: 'rgba(239, 83, 80, 0.6)',
                        borderColor: 'rgba(229, 57, 53, 1)',
                        borderWidth: 1,
                        borderRadius: 4,
                    },
                    {
                        label: 'Tulud',
                        data: [],
                        backgroundColor: 'rgba(38, 166, 154, 0.6)',
                        borderColor: 'rgba(0, 137, 123, 1)',
                        borderWidth: 1,
                        borderRadius: 4,
                    },
                ],
            };
        }

        const monthlyData: Record<string, { expenses: number; incomes: number; monthName: string }> = {};

        const estonianMonths = [
            'Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni',
            'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember'
        ];

        transactions.forEach((transaction: Transaction) => {
            const date = new Date(transaction.transactionDate);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            const monthName = estonianMonths[date.getMonth()];

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { expenses: 0, incomes: 0, monthName };
            }

            if (transaction.transactionType === 'EXPENSE') {
                monthlyData[monthKey].expenses -= transaction.amount;
            } else {
                monthlyData[monthKey].incomes += transaction.amount;
            }
        });
        const sortedMonths = Object.keys(monthlyData).sort();

        return {
            labels: sortedMonths.map(month => monthlyData[month].monthName),
            datasets: [
                {
                    label: 'Kulud',
                    data: sortedMonths.map(month => monthlyData[month].expenses),
                    backgroundColor: 'rgba(239, 83, 80, 0.6)',
                    borderColor: 'rgba(229, 57, 53, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                },
                {
                    label: 'Tulud',
                    data: sortedMonths.map(month => monthlyData[month].incomes),
                    backgroundColor: 'rgba(38, 166, 154, 0.6)',
                    borderColor: 'rgba(0, 137, 123, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                },
            ],
        };
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ height: 400, position: 'relative' }}>
                <Bar options={chartOptions} data={processChartData()} />
            </Box>
        </Paper>
    );
}