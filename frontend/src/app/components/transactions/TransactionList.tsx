"use client";

import {Box, Divider, Grid, Paper, Typography} from '@mui/material';

interface Transaction {
    transactionType: 'INCOME' | 'EXPENSE';
    amount: number;
    transactionDate: string;
    categoryName: string;
    description: string;
}

interface TransactionsListProps {
    transactions: Transaction[];
    filterValue: string;
    startDate: string;
    endDate: string;
}

export default function TransactionsList({
                                             transactions,
                                             filterValue,
                                             startDate,
                                             endDate
                                         }: TransactionsListProps) {
    // Format amount with sign based on transaction type
    const getFormattedAmount = (transaction: Transaction) => {
        const amount = transaction.transactionType === 'EXPENSE' ? transaction.amount : transaction.amount;
        return amount.toLocaleString('et-EE', { style: 'currency', currency: 'EUR' });
    };

    const filteredTransactions = transactions
        ? transactions.filter((transaction: Transaction) => {
            const transactionDate = new Date(transaction.transactionDate);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && transactionDate < start) return false;
            if (end && transactionDate > end) return false;

            if (filterValue === 'Tulud') return transaction.transactionType === 'INCOME';
            if (filterValue === 'Kulud') return transaction.transactionType === 'EXPENSE';
            return true;
        })
        : [];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3 }}>
                    {filteredTransactions.length === 0 ? (
                        <Typography align="center" sx={{ py: 4 }}>
                            {filterValue !== 'Kõik'
                                ? `Filtreeritud ${filterValue.toLowerCase()} puuduvad`
                                : 'Tehingud puuduvad'}
                        </Typography>
                    ) : (
                        filteredTransactions.map((transaction: Transaction, index: number) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Grid container spacing={2} sx={{ alignItems: 'center', p: 1 }}>
                                    <Grid item xs>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            {transaction.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                                {new Date(transaction.transactionDate).toLocaleDateString('et-EE')}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    bgcolor: 'rgba(0,0,0,0.08)',
                                                    px: 1,
                                                    py: 0.3,
                                                    borderRadius: 1
                                                }}
                                            >
                                                {transaction.categoryName}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 700
                                            }}
                                        >
                                            {getFormattedAmount(transaction)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mt: 2 }} />
                            </Box>
                        ))
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}