"use client";
import { useEffect, useState, useCallback } from "react";
import {
    Box,
    Card,
    CardContent,
    useMediaQuery,
    useTheme,
    Container
} from "@mui/material";
import { useAllUserTransactions } from "@/app/hooks/useTransactionHooks";
import { useCreateTransaction } from "@/app/hooks/useCreateTransaction";
import { useDeleteTransaction } from "@/app/hooks/useDeleteTransaction";
import { useUpdateTransaction } from "@/app/hooks/useUpdateTransaction";
import { useImportTransactions } from "@/app/hooks/useImportTransactions";
import { PageHeader } from "@/app/components/kanded/PageHeader";
import { TransactionFilters } from "@/app/components/kanded/TransactionFilters";
import { TransactionList } from "@/app/components/kanded/TransactionList";
import { TransactionForm } from "@/app/components/kanded/TransactionForm";
import { Notification } from "@/app/components/kanded/Notification";
import { Entry } from "@/app/types/types";

export default function Kanded() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Using the custom hooks with destructuring the refetch function
    const { transactions, loading, error, refetchTransactions } = useAllUserTransactions();
    const { createTransaction, loading: creating, error: createError, success: createSuccess } = useCreateTransaction();
    const { deleteTransaction, loading: deleting, error: deleteError, success: deleteSuccess, deletedId } = useDeleteTransaction();
    const { updateTransaction, loading: updating, error: updateError, success: updateSuccess } = useUpdateTransaction();
    const { importTransactions, loading: importing, error: importError, successMessage } = useImportTransactions();

    const [entries, setEntries] = useState<Entry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
    const [formData, setFormData] = useState({
        open: false,
        isEditing: false,
        editEntry: null as Entry | null,
        entry: {
            id: null as number | null,
            kuupäev: new Date().toISOString().split("T")[0],
            summa: "",
            kategooria: "",
            kirjeldus: "",
        }
    });
    const [filters, setFilters] = useState({
        searchTerm: "",
        startDate: "",
        endDate: ""
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    // Memoize the showNotification function to prevent unnecessary re-renders
    const showNotification = useCallback((message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    }, []);

    // Effect to update entries when transactions change
    useEffect(() => {
        if (transactions?.length) {
            setEntries(transactions.map((tx: any) => ({
                id: tx.id,
                kuupäev: tx.transactionDate || tx.kuupäev || new Date().toISOString().split("T")[0],
                summa: tx.amount?.toString() || tx.summa || "",
                kategooria: tx.categoryName || tx.kategooria || "",
                kirjeldus: tx.description || tx.kirjeldus || "",
            })));
        } else {
            setEntries([]); // Clear entries if no transactions
        }
    }, [transactions]);

    // Effect to filter entries when entries or filters change
    useEffect(() => {
        const filtered = entries.filter(entry => {
            const { searchTerm, startDate, endDate } = filters;
            const matchesSearch = !searchTerm ||
                entry.kirjeldus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.kategooria.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesDateRange = true;
            if (startDate || endDate) {
                const entryDate = new Date(entry.kuupäev);
                if (startDate) matchesDateRange = entryDate >= new Date(startDate);
                if (endDate) matchesDateRange = matchesDateRange && entryDate <= new Date(endDate);
            }

            return matchesSearch && matchesDateRange;
        });

        setFilteredEntries(filtered);
    }, [entries, filters]);

    // Effect for import success/error messages
    useEffect(() => {
        if (successMessage) {
            showNotification(successMessage, "success");
            refetchTransactions(); // Refetch after successful import
        }
        if (importError) {
            showNotification(importError, "error");
        }
    }, [successMessage, importError, refetchTransactions, showNotification]);

    // Effect for create operation results
    useEffect(() => {
        if (createSuccess) {
            showNotification("Uus kanne edukalt lisatud!", "success");
            refetchTransactions(); // Refetch after successful creation
            closeForm();
        } else if (createError) {
            showNotification(createError || "Kande loomine ebaõnnestus!", "error");
        }
    }, [createSuccess, createError, refetchTransactions, showNotification]);

    // Effect for update operation results
    useEffect(() => {
        if (updateSuccess) {
            showNotification("Kanne edukalt uuendatud!", "success");
            refetchTransactions(); // Refetch after successful update
            closeForm();
        } else if (updateError) {
            showNotification(updateError || "Kande uuendamine ebaõnnestus!", "error");
        }
    }, [updateSuccess, updateError, refetchTransactions, showNotification]);

    // Effect for delete operation results - optimized to update state locally
    useEffect(() => {
        if (deleteSuccess && deletedId) {
            // Update entries locally without refetching
            setEntries(prevEntries => prevEntries.filter(entry => entry.id !== deletedId));
            showNotification("Kanne edukalt kustutatud!", "success");
        } else if (deleteError) {
            showNotification(deleteError || "Kande kustutamine ebaõnnestus!", "error");
        }
    }, [deleteSuccess, deleteError, deletedId, showNotification]);

    const openForm = (edit = false, entry?: Entry) => {
        setFormData({
            open: true,
            isEditing: edit,
            editEntry: edit && entry ? entry : null,
            entry: edit && entry ? {
                ...entry,

                id: entry.id ?? null
            } : {
                id: null,
                kuupäev: new Date().toISOString().split("T")[0],
                summa: "",
                kategooria: "",
                kirjeldus: "",
            }
        });
    };

    const closeForm = useCallback(() => setFormData(prev => ({ ...prev, open: false })), []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, entry: { ...prev.entry, [name!]: value } }));
    };

    const handleSubmit = async () => {
        const { isEditing, entry } = formData;

        if (!entry.summa || isNaN(parseFloat(entry.summa))) {
            showNotification("Summa peab olema korrektne number!", "error");
            return;
        }

        if (isEditing) {
            if (!entry.id) {
                showNotification("Transaction ID missing for update!", "error");
                return;
            }

            try {
                await updateTransaction(entry.id, {
                    amount: parseFloat(entry.summa),
                    transactionDate: entry.kuupäev,
                    categoryName: entry.kategooria,
                    description: entry.kirjeldus,
                });
                // The success/error will be handled by the effect
            } catch (err) {
                console.error("Transaction update error:", err);
            }
            return;
        }

        try {
            await createTransaction({
                amount: parseFloat(entry.summa),
                transactionDate: entry.kuupäev,
                categoryName: entry.kategooria,
                description: entry.kirjeldus,
            });
            // The success/error will be handled by the effect
        } catch (err) {
            console.error("Transaction creation error:", err);
        }
    };

    const handleDelete = async (entry: Entry) => {
        if (!entry || !entry.id) return;

        try {
            await deleteTransaction(entry.id);
            // State update is now handled in the useEffect
        } catch (err) {
            console.error("Transaction deletion error:", err);
        }
    };

    const handleImport = async (file: File) => {
        await importTransactions(file);
        // The success/error will be handled by the effect
    };

    return (
        <Box
            sx={{
                flexGrow: 1,
                p: isMobile ? 1 : 3,
                backgroundColor: "background.default",
                minHeight: "100vh"
            }}
        >
            <Container maxWidth="lg" disableGutters={isMobile}>
                <Card
                    sx={{
                        mb: 2,
                        overflow: "visible",
                        boxShadow: isMobile ? 1 : 3,
                        borderRadius: isMobile ? 1 : 2
                    }}
                >
                    <PageHeader
                        onAddNew={() => openForm()}
                        isMobile={isMobile}
                    />
                    <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                        <TransactionFilters
                            searchTerm={filters.searchTerm}
                            onSearchChange={(term) => setFilters(prev => ({ ...prev, searchTerm: term }))}
                            startDate={filters.startDate}
                            onStartDateChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                            endDate={filters.endDate}
                            onEndDateChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                            isMobile={isMobile}
                        />
                        <TransactionList
                            entries={entries}
                            filteredEntries={filteredEntries}
                            loading={loading || creating || updating || importing} // Removed 'deleting' to prevent list refresh
                            error={error}
                            onEdit={(entry) => openForm(true, entry)}
                            onDelete={(entry) => handleDelete(entry)}
                            isMobile={isMobile}
                        />
                    </CardContent>
                </Card>

                <TransactionForm
                    open={formData.open}
                    isEditing={formData.isEditing}
                    entry={formData.entry}
                    onClose={closeForm}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onImport={handleImport}
                    fullScreen={isMobile}
                />

                <Notification
                    open={snackbar.open}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                />
            </Container>
        </Box>
    );
}