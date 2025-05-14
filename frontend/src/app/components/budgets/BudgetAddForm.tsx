import React, { useState } from 'react';
import {
    Alert,
    Button,
    CircularProgress,
    Grid,
    InputAdornment,
    IconButton,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { Add, Assignment, CalendarMonth, Euro, Delete } from '@mui/icons-material';

// @ts-ignore
const BudgetAddForm = ({ onSubmit }) => {
    const [budget, setBudget] = useState({
        name: "",
        totalAmount: "",
        shared: false,
        startDate: "",
        endDate: "",
        categories: [{ categoryName: "" }],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e: { target: { name: any; value: any; checked: any; }; }) => {
        const { name, value, checked } = e.target;
        setBudget({
            ...budget,
            [name]: name === 'shared' ? checked : value
        });
    };

    const handleCategoryChange = (index: number, value: string) => {
        const updatedCategories = [...budget.categories];
        updatedCategories[index] = { categoryName: value }; // Update the categoryName property
        setBudget({ ...budget, categories: updatedCategories });
    };

    const addCategory = () => {
        setBudget({ ...budget, categories: [...budget.categories, { categoryName: "" }] });
    };

    const removeCategory = (index: number) => {
        const updatedCategories = budget.categories.filter((_, i) => i !== index);
        setBudget({ ...budget, categories: updatedCategories });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!budget.name || !budget.totalAmount || !budget.startDate || !budget.endDate) return;

        setLoading(true);
        try {
            await onSubmit({
                ...budget,
                totalAmount: Number(budget.totalAmount),
            });

            setSuccess(true);
            setBudget({
                name: "",
                totalAmount: "",
                shared: false,
                startDate: "",
                endDate: "",
                categories: [{ categoryName: "" }],
            });
        } catch (err) {
            // @ts-ignore
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
                Lisa uus eelarve
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>Eelarve on edukalt loodud!</Alert>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Eelarve nimi"
                            name="name"
                            fullWidth
                            required
                            value={budget.name}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Assignment color="action" /></InputAdornment>,
                            }}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Summa"
                            name="totalAmount"
                            type="number"
                            fullWidth
                            required
                            value={budget.totalAmount}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Euro color="action" /></InputAdornment>,
                                endAdornment: <InputAdornment position="end">€</InputAdornment>,
                            }}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Alguskuupäev"
                            name="startDate"
                            type="date"
                            fullWidth
                            required
                            value={budget.startDate}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><CalendarMonth color="action" /></InputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Tähtaeg"
                            name="endDate"
                            type="date"
                            fullWidth
                            required
                            value={budget.endDate}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><CalendarMonth color="action" /></InputAdornment>,
                            }}
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>
                            Kategooriad
                        </Typography>
                        {budget.categories.map((category, index) => (
                            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                <Grid item xs={10}>
                                    <TextField
                                        label={`Kategooria ${index + 1}`}
                                        value={category.categoryName}
                                        onChange={(e) => handleCategoryChange(index, e.target.value)}
                                        fullWidth
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton
                                        color="error"
                                        onClick={() => removeCategory(index)}
                                        disabled={loading}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={addCategory}
                            disabled={loading}
                        >
                            Lisa kategooria
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <Add />}
                            disabled={loading}
                        >
                            {loading ? 'Salvestamine...' : 'Salvesta eelarve'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default BudgetAddForm;