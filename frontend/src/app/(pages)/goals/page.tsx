"use client";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import {
    Box,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import useFetchGoals from "@/app/hooks/useFetchGoals";
import { useCreateGoal } from "@/app/hooks/useCreateGoal";
import useDeleteGoal from "@/app/hooks/useDeleteGoal";
import { useUpdateGoal } from "@/app/hooks/useUpdateGoal";
import NewGoalForm from "@/app/components/goals/NewGoalForm";
import GoalsList from "@/app/components/goals/GoalsList";

interface Goal {
    id: number;
    name: string;
    target: number;
    current: number;
    deadline: string;
}

interface NewGoalData {
    name: string;
    target: number;
    current: number;
    deadline: string;
}

const GoalPage: NextPage = () => {
    const { goals: fetchedGoals, error, loading } = useFetchGoals();
    const { createGoal, loading: creatingGoal, error: createError } = useCreateGoal();
    const { deleteGoal, loading: deletingGoal, error: deleteError } = useDeleteGoal();
    const { updateGoal, isLoading: updatingGoal, error: updateError, success } = useUpdateGoal();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [editGoal, setEditGoal] = useState<Goal | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleCreateGoal = async (newGoal: NewGoalData): Promise<void> => {
        try {
            const createdGoal = await createGoal(newGoal);
            setGoals((prevGoals) => [...prevGoals, createdGoal]);
        } catch (err) {
            console.error("Error creating goal:", err);
        }
    };

    const handleDeleteGoal = async (id: number): Promise<void> => {
        await deleteGoal(id);

        if (!deleteError) {
            setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
        }
    };

    const handleEditGoal = (goal: Goal): void => {
        setEditGoal(goal);
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (editGoal) {
            try {
                await updateGoal(editGoal.id, {
                    name: editGoal.name,
                    target: editGoal.target,
                    current: editGoal.current,
                    deadline: editGoal.deadline,
                });

                if (success) {
                    setGoals((prevGoals) =>
                        prevGoals.map((goal) =>
                            goal.id === editGoal.id ? { ...goal, ...editGoal } : goal
                        )
                    );
                    setIsEditDialogOpen(false);
                }
            } catch (err) {
                console.error("Error updating goal:", err);
            }
        }
    };

    useEffect(() => {
        if (fetchedGoals) {
            setGoals(fetchedGoals);
        }
    }, [fetchedGoals]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: "background.default", minHeight: "100%", width: "100%", margin: 0, overflow: "hidden" }}>
            <Grid container sx={{ width: "100%", margin: 0, maxWidth: "none", p: 3 }}>
                <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                            Eesmärgid
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <NewGoalForm
                        onSubmit={handleCreateGoal}
                        loading={creatingGoal}
                        error={createError}
                    />
                </Grid>

                <Grid item xs={12}>
                    <GoalsList
                        goals={goals}
                        onDelete={handleDeleteGoal}
                        onEdit={handleEditGoal}
                    />
                </Grid>
            </Grid>

            {/* Edit Goal Dialog */}
            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
                <DialogTitle>Muuda eesmärki</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Eesmärgi nimi"
                        fullWidth
                        margin="normal"
                        value={editGoal?.name || ""}
                        onChange={(e) => setEditGoal((prev) => prev && { ...prev, name: e.target.value })}
                    />
                    <TextField
                        label="Sihtsumma"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={editGoal?.target || ""}
                        onChange={(e) => setEditGoal((prev) => prev && { ...prev, target: parseFloat(e.target.value) })}
                    />
                    <TextField
                        label="Praegune summa"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={editGoal?.current || ""}
                        onChange={(e) => setEditGoal((prev) => prev && { ...prev, current: parseFloat(e.target.value) })}
                    />
                    <TextField
                        label="Tähtaeg"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={editGoal?.deadline || ""}
                        onChange={(e) => setEditGoal((prev) => prev && { ...prev, deadline: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditDialogOpen(false)} color="secondary">
                        Tühista
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary" disabled={updatingGoal}>
                        {updatingGoal ? "Salvestamine..." : "Salvesta"}
                    </Button>
                </DialogActions>
                {updateError && (
                    <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                        {updateError}
                    </Typography>
                )}
            </Dialog>
        </Box>
    );
};

export default GoalPage;