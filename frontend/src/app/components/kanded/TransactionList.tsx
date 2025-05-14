// Updated TransactionList.tsx
import { Alert, Box, CircularProgress, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Entry } from "@/app/types/types";
import { formatDate, formatSumma } from "@/app/utils/formatters";
import { TransactionActions } from "./TransactionActions";

interface TransactionListProps {
    entries: Entry[];
    filteredEntries: Entry[];
    loading: boolean;
    error: string | null;
    onEdit: (entry: Entry) => void;
    onDelete: (entry: Entry) => void;
}

export const TransactionList = ({
                                    entries,
                                    filteredEntries,
                                    loading,
                                    error,
                                    onEdit,
                                    onDelete,
                                }: TransactionListProps) => {
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                Viga tehingute laadimisel: {error}
            </Alert>
        );
    }

    if (entries.length === 0) {
        return (
            <Alert severity="info" sx={{ my: 2 }}>
                Kandeid pole veel lisatud. Alusta uue kande loomisega!
            </Alert>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ boxShadow: "none", overflow: "hidden", borderRadius: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Kuupäev</TableCell>
                        <TableCell>Summa</TableCell>
                        <TableCell>Kategooria</TableCell>
                        <TableCell>Kirjeldus</TableCell>
                        <TableCell align="center">Tegevused</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredEntries.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                <Typography variant="body1" sx={{ py: 2 }}>
                                    Otsingule vastavaid kandeid ei leitud
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredEntries.map((entry) => (
                            <TableRow
                                key={entry.id}
                                sx={{
                                    "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 102, 153, 0.03)" },
                                    transition: "background-color 0.2s",
                                    "&:hover": { backgroundColor: "rgba(0, 102, 153, 0.07)" },
                                }}
                            >
                                <TableCell>{formatDate(entry.kuupäev)}</TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: "medium",
                                        color: parseFloat(entry.summa) >= 0 ? "success.main" : "error.main",
                                    }}
                                >
                                    {formatSumma(entry.summa)}
                                </TableCell>
                                <TableCell>{entry.kategooria}</TableCell>
                                <TableCell>{entry.kirjeldus}</TableCell>
                                <TableCell align="center">
                                    <TransactionActions
                                        onEdit={() => onEdit(entry)}
                                        onDelete={() => onDelete(entry)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};