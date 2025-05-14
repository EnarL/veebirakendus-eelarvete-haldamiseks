import { ChartData } from 'chart.js';

interface MonthlySummary {
    month: number;
    totalIncome: number;
    totalExpense: number;
}

const monthNames = [
    'Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni',
    'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember'
];

/**
 * Generate monthly spending data for the line chart
 * Processes the fetched monthly summary data.
 */
export const generateMonthlySpendingData = (monthlySummary: MonthlySummary[]): ChartData<'line'> => {
    return {
        labels: monthlySummary.map((item) => monthNames[item.month - 1]),
        datasets: [
            {
                label: 'Kulud',
                data: monthlySummary.map((item) => item.totalExpense),
                fill: true,
                backgroundColor: 'rgba(58, 134, 255, 0.1)',
                borderColor: 'rgba(58, 134, 255, 1)',
                tension: 0.4,
            },
            {
                label: 'Sissetulek',
                data: monthlySummary.map((item) => item.totalIncome),
                fill: true,
                backgroundColor: 'rgba(56, 176, 0, 0.1)',
                borderColor: 'rgba(56, 176, 0, 1)',
                tension: 0.4,
            },
        ],
    };
};