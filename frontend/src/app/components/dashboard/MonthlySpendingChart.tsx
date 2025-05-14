import 'chart.js/auto';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface MonthlySpendingChartProps {
    data: ChartData<'line'>;
    navigateTo: (path: string) => void;
}

export default function MonthlySpendingChart({ data, navigateTo }: MonthlySpendingChartProps): JSX.Element {
    const lineChartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 10,
                    padding: 10,
                },
            },
            title: {
                display: true,
                text: 'Kulud ja Sissetulekud Kuu Lõikes',
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                cursor: 'pointer',
                width: '100%',
                '&:hover': { boxShadow: '0 6px 15px rgba(0,0,0,0.07)' },
                overflow: 'hidden',
            }}
            onClick={() => navigateTo('/statistics')}
        >
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'text.primary',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                        }}
                    >
                        Kulud ja Sissetulekud Kuu Lõikes
                    </Typography>
                    <IconButton
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigateTo('/statistics');
                        }}
                    >
                        <ArrowForward />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        height: 350,
                        width: '100%',
                        maxWidth: '100%',
                        position: 'relative',
                    }}
                >
                    <Line data={data} options={lineChartOptions} />
                </Box>
            </Box>
        </Paper>
    );
}