"use client";

import {useState} from 'react';
import {Box, Divider, Tab, Tabs, Typography} from '@mui/material';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';
import {useAllUserTransactions} from '@/app/hooks/useTransactionHooks';

import TransactionsChart from '@/app/components/transactions/TransactionChart';
import TransactionFilters from '@/app/components/transactions/TransactionFilter';
import DateRangeFilter from '@/app/components/transactions/DateRangeFilter';
import TransactionsList from '@/app/components/transactions/TransactionList';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TransactionsPage() {
    const [tabValue, setTabValue] = useState(0);
    const [filterValue, setFilterValue] = useState('Kõik');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { transactions, loading, error } = useAllUserTransactions();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleFilterChangeAction = (event: React.SyntheticEvent, newValue: string) => {
        setFilterValue(newValue);
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom color="primary">
                Tehingud
            </Typography>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{ mb: 3 }}
                TabIndicatorProps={{ style: { height: 3, borderRadius: 3 } }}
            >
                <Tab label="Visuaalne Vaade" />
                <Tab label="Andmete Vaade" />
            </Tabs>
            <Divider sx={{ mb: 3 }} />
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <Typography>Andmete laadimine...</Typography>
                </Box>
            )}
            {error && (
                <Box sx={{ my: 4, p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
                    <Typography color="error">Viga: {error}</Typography>
                </Box>
            )}
            {!loading && !error && tabValue === 0 && (
                <TransactionsChart
                    transactions={transactions}
                    loading={loading}
                />
            )}
            {!loading && !error && tabValue === 1 && (
                <>
                    <TransactionFilters
                        filterValue={filterValue}
                        handleFilterChangeAction={handleFilterChangeAction}
                    />

                    <DateRangeFilter
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />

                    <TransactionsList
                        transactions={transactions}
                        filterValue={filterValue}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </>
            )}
        </Box>
    );
}