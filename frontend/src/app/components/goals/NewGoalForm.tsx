import React, { useState, FormEvent } from "react";
import {
    Button,
    Divider,
    Grid,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

interface NewGoalData {
    name: string;
    target: number;
    current: number;
    deadline: string;
}

interface NewGoalFormProps {
    onSubmit: (goal: NewGoalData) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const NewGoalForm: React.FC<NewGoalFormProps> = ({ onSubmit, loading, error }) => {
    const [goalName, setGoalName] = useState<string>("");
    const [goalAmount, setGoalAmount] = useState<string>("");
    const [goalCurrent, setGoalCurrent] = useState<string>("");
    const [goalDeadline, setGoalDeadline] = useState<string>("");

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newGoal = {
            name: goalName,
            target: parseFloat(goalAmount),
            current: parseFloat(goalCurrent),
            deadline: goalDeadline,
        };

        await onSubmit(newGoal);

        // Clear the form fields after successful submission
        setGoalName("");
        setGoalAmount("");
        setGoalCurrent("");
        setGoalDeadline("");
    };

    return (
        <Paper elevation={3} sx={{ borderRadius: 2, mb: 4, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Lisa uus eesmärk
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleFormSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            label="Eesmärgi nimi"
                            fullWidth
                            variant="outlined"
                            required
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            label="Sihtsumma"
                            type="number"
                            fullWidth
                            variant="outlined"
                            required
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">€</InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            label="Praegune summa"
                            type="number"
                            fullWidth
                            variant="outlined"
                            required
                            value={goalCurrent}
                            onChange={(e) => setGoalCurrent(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">€</InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            label="Tähtaeg"
                            type="date"
                            fullWidth
                            variant="outlined"
                            required
                            value={goalDeadline}
                            onChange={(e) => setGoalDeadline(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            sx={{ mt: 1 }}
                        >
                            {loading ? "Salvestamine..." : "Salvesta eesmärk"}
                        </Button>
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default NewGoalForm;