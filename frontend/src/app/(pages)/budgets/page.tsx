"use client"
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';

import BudgetOverviewTab from '@/app/components/budgets/BudgetOverviewTab';
import BudgetAddForm from '@/app/components/budgets/BudgetAddForm';
import BudgetList from '@/app/components/budgets/BudgetList';
import InviteMemberDialog from '@/app/components/InviteMembersDialog';
import useFetchBudgets from '@/app/hooks/useFetchBudgets';
import { useCreateBudget, BudgetDTO, BudgetCategoryDTO } from "@/app/hooks/useCreateBudget";
import { useDeleteBudget } from "@/app/hooks/useDeleteBudget";
import { useInviteMember } from '@/app/hooks/useInviteMember';
import { useRemoveMember } from '@/app/hooks/useRemoveMember';
import { useSpentByCategory } from "@/app/hooks/useFetchSpentByCategory";
import { useAddCategoryToBudget } from '@/app/hooks/useAddCategoryToBudget';
import { useRemoveCategoryFromBudget } from '@/app/hooks/useRemoveCategoryFromBudget';

interface Member {
    id: number;
    username: string;
    email: string;
}

interface Category {
    id: number;
    name: string;
    budgetId: number;
}

interface Budget {
    id: number;
    name: string;
    totalAmount: number;
    categories: Category[];
    shared: boolean;
    members: Member[];
    startDate: string;
    endDate: string;
    totalSpent?: number;
    spentPercentage?: number;
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}

const BudgetsPage: React.FC = () => {
    const { budgets: apiBudgets, error, loading, refetchBudgets } = useFetchBudgets();
    const { createBudget, loading: createLoading, error: createError, success: createSuccess } = useCreateBudget();
    const { deleteBudget, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDeleteBudget();
    const { inviteMember, loading: inviteLoading, error: inviteError, success: inviteSuccess } = useInviteMember();
    const { removeMember, loading: removeLoading, error: removeError, success: removeSuccess } = useRemoveMember();
    const { addCategoryToBudget, loading: addCategoryLoading, error: addCategoryError, success: addCategorySuccess } = useAddCategoryToBudget();
    const { removeCategoryFromBudget, loading: removeCategoryLoading, error: removeCategoryError, success: removeCategorySuccess } = useRemoveCategoryFromBudget();

    const [expandedBudgetId, setExpandedBudgetId] = useState<number | null>(null);
    const { data: categoryData, loading: categoryLoading, error: categoryError } = useSpentByCategory(expandedBudgetId);

    const handleExpandClick = (budgetId: number) => {
        setExpandedBudgetId(expandedBudgetId === budgetId ? null : budgetId);
    };
    const [tabValue, setTabValue] = useState(0);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [inviteMemberDialog, setInviteMemberDialog] = useState(false);
    const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success"
    });

    const showNotification = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    }, []);

    useEffect(() => {
        if (apiBudgets) {
            const transformed = apiBudgets.map((budget: any) => ({
                id: budget.id,
                name: budget.name,
                totalAmount: budget.totalAmount,
                categories: budget.categories || [],
                shared: budget.shared || false,
                members: (budget.members || []).map((member: any) => ({
                    id: member.id,
                    username: member.username,
                    email: member.email,
                })),
                startDate: budget.startDate,
                endDate: budget.endDate,
                totalSpent: 0,
                spentPercentage: 0,
            }));
            setBudgets(transformed);
        }
    }, [apiBudgets]);

    useEffect(() => {
        if (createSuccess) {
            showNotification("Uus eelarve on edukalt loodud!", "success");
            setTabValue(0);
            refetchBudgets();
        } else if (createError) {
            showNotification(`Viga eelarve loomisel: ${createError}`, "error");
        }
    }, [createSuccess, createError, refetchBudgets, showNotification]);

    useEffect(() => {
        if (inviteSuccess) {
            showNotification("Liige on edukalt kutsutud!", "success");
            refetchBudgets();
        } else if (inviteError) {
            showNotification(`Viga liikme kutsumisel: ${inviteError}`, "error");
        }
    }, [inviteSuccess, inviteError, refetchBudgets, showNotification]);

    useEffect(() => {
        if (removeSuccess) {
            showNotification("Liige on edukalt eemaldatud!", "success");
            refetchBudgets(); // Refetch after successful member removal
        } else if (removeError) {
            showNotification(`Viga liikme eemaldamisel: ${removeError}`, "error");
        }
    }, [removeSuccess, removeError, refetchBudgets, showNotification]);

    useEffect(() => {
        if (deleteSuccess) {
            showNotification("Eelarve on edukalt kustutatud!", "success");
            refetchBudgets(); // Refetch after successful deletion
        } else if (deleteError) {
            showNotification(`Viga eelarve kustutamisel: ${deleteError}`, "error");
        }
    }, [deleteSuccess, deleteError, refetchBudgets, showNotification]);

    useEffect(() => {
        if (addCategorySuccess) {
            showNotification("Kategooria on edukalt lisatud!", "success");
            refetchBudgets(); // Refetch after successful category addition
        } else if (addCategoryError) {
            showNotification(`Viga kategooria lisamisel: ${addCategoryError}`, "error");
        }
    }, [addCategorySuccess, addCategoryError, refetchBudgets, showNotification]);

    useEffect(() => {
        if (removeCategorySuccess) {
            showNotification("Kategooria on edukalt eemaldatud!", "success");
            refetchBudgets(); // Refetch after successful category removal
        } else if (removeCategoryError) {
            showNotification(`Viga kategooria eemaldamisel: ${removeCategoryError}`, "error");
        }
    }, [removeCategorySuccess, removeCategoryError, refetchBudgets, showNotification]);

    const handleDeleteBudget = async (budgetId: number) => {
        try {
            await deleteBudget(budgetId);
        } catch (err) {
            showNotification("Viga eelarve kustutamisel", "error");
        }
    };

    const handleSubmit = async (newBudget: BudgetDTO) => {
        await createBudget(newBudget);

    };

    const handleAddCategory = async (budgetId: number, categoryName: string) => {
        try {
            const result = await addCategoryToBudget(budgetId, categoryName);

            if (result.success) {
                setBudgets(prevBudgets =>
                    prevBudgets.map(budget => {
                        if (budget.id === budgetId) {
                            const tempId = Date.now();

                            return {
                                ...budget,
                                categories: [
                                    ...budget.categories,
                                    {
                                        id: tempId,
                                        name: categoryName,
                                        categoryName: categoryName,
                                        budgetId: budgetId
                                    }
                                ]
                            };
                        }
                        return budget;
                    })
                );
            } else {
                showNotification("Viga kategooria lisamisel", "error");
            }
        } catch (err) {
            showNotification("Viga kategooria lisamisel", "error");
        }
    };


    const handleRemoveCategory = async (budgetId: number, categoryId: number) => {
        try {
            const result = await removeCategoryFromBudget(budgetId, categoryId);

            if (result.success) {
                // Update local state immediately after successful removal
                setBudgets(prevBudgets =>
                    prevBudgets.map(budget => {
                        if (budget.id === budgetId) {
                            // Remove the category from this budget
                            return {
                                ...budget,
                                categories: budget.categories.filter(cat => cat.id !== categoryId)
                            };
                        }
                        return budget;
                    })
                );
            } else {
                showNotification("Viga kategooria eemaldamisel", "error");
            }
        } catch (err) {
            showNotification("Viga kategooria eemaldamisel", "error");
        }
    };
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleInviteMember = (budgetId: number) => {
        setSelectedBudgetId(budgetId);
        setInviteMemberDialog(true);
    };

    const handleAddMember = async (email: string) => {
        if (selectedBudgetId) {
            await inviteMember(selectedBudgetId, email);
        } else {
            showNotification("Eelarve ID puudub", "error");
        }
        setInviteMemberDialog(false);
    };

    const handleRemoveMember = async (budgetId: number, memberId: number) => {
        await removeMember(budgetId, memberId);
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    if (loading && !budgets.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Paper elevation={3} sx={{ p: 3, bgcolor: 'error.light' }}>
                    <Typography variant="h6" color="error">
                        Viga andmete laadimisel
                    </Typography>
                    <Typography>{error}</Typography>
                </Paper>
            </Box>
        );
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default", minHeight: "100vh" }}>
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 2 }}>
                    Eelarved
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Siin saate luua ja hallata oma eelarveid.
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="budget tabs">
                        <Tab label="Ülevaade" id="tab-0" />
                        <Tab label="Lisa uus eelarve" id="tab-1" />
                        <Tab label="Kõik eelarved" id="tab-2" />
                    </Tabs>
                </Box>
            </Paper>
            {tabValue === 0 && <BudgetOverviewTab budgets={budgets}/>}
            {tabValue === 1 && <BudgetAddForm onSubmit={handleSubmit} />}
            {tabValue === 2 && (

                <BudgetList
                    budgets={budgets}
                    onInviteMember={handleInviteMember}
                    onRemoveMember={handleRemoveMember}
                    onDeleteBudget={handleDeleteBudget}
                    onAddCategory={handleAddCategory}
                    onRemoveCategory={handleRemoveCategory}
                    expandedBudgetId={expandedBudgetId}
                    onExpandClick={handleExpandClick}
                    categoryData={categoryData}
                    categoryLoading={categoryLoading}
                    categoryError={categoryError}
                />
            )}



            <InviteMemberDialog
                open={inviteMemberDialog}
                onClose={() => setInviteMemberDialog(false)}
                onInvite={handleAddMember}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BudgetsPage;