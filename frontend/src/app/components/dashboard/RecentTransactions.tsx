import 'chart.js/auto';
import {Avatar, Box, Button, List, ListItem, ListItemIcon, Paper, Typography} from '@mui/material';
import {ArrowDownward, ArrowForward, ArrowUpward, Category, DateRange, MoreHoriz} from '@mui/icons-material';

export interface Transaction {
    id: string;
    transactionType: 'INCOME' | 'EXPENSE';
    amount: number;
    transactionDate: string;
    category: string;
    description: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
    navigateTo: (path: string) => void;
}

export default function RecentTransactions({ transactions, navigateTo }: RecentTransactionsProps): JSX.Element {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('et-EE', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const formatDate = (date: string): string => {
        return new Date(date).toLocaleDateString('et-EE');
    };

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ color: "text.primary" }}>
                    Viimased Tehingud
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    endIcon={<ArrowForward />}
                    onClick={() => navigateTo('/transactions')}
                    sx={{ borderRadius: 2 }}
                >
                    Kõik tehingud
                </Button>
            </Box>
            <List sx={{ width: '100%' }}>
                {transactions.map((transaction, index) => (
                    <ListItem
                        key={`${transaction.id}-${index}`}
                        sx={{
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            mb: 1,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' }
                        }}
                        onClick={() => navigateTo('/transactions')}
                    >
                        <ListItemIcon>
                            {transaction.transactionType === 'INCOME' ? (
                                <Avatar sx={{ bgcolor: "success.light", color: "success.dark" }}>
                                    <ArrowUpward />
                                </Avatar>
                            ) : (
                                <Avatar sx={{ bgcolor: "error.light", color: "error.dark" }}>
                                    <ArrowDownward />
                                </Avatar>
                            )}
                        </ListItemIcon>

                        {/* Using a custom implementation instead of ListItemText */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* Primary content */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1" component="span" fontWeight="medium">
                                    {transaction.description}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    component="span"
                                    fontWeight="medium"
                                    color={transaction.transactionType === 'INCOME' ? 'success.main' : 'error.main'}
                                >
                                    {transaction.transactionType === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </Typography>
                            </Box>

                            {/* Secondary content */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <DateRange sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" component="span" color="text.secondary">
                                        {formatDate(transaction.transactionDate)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Category sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" component="span" color="text.secondary">
                                        {transaction.category}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </ListItem>
                ))}
            </List>

            {/* Show more button outside the List component */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                    onClick={() => navigateTo('/transactions')}
                    startIcon={<MoreHoriz />}
                    sx={{ borderRadius: 2 }}
                >
                    Näita rohkem
                </Button>
            </Box>
        </Paper>
    );
}