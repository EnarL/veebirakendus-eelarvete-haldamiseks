"use client";
import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
    Alert,
} from "@mui/material";
import { Delete, SaveAlt } from "@mui/icons-material";
import useCreateRule from "@/app/hooks/useCreateRule";
import useDeleteRule from "@/app/hooks/useDeleteRule";
import useFetchRules from "@/app/hooks/useFetchRules";

const AddRulesPage = () => {
    const [criterion, setCriterion] = useState("");
    const [id, setId] = useState("");
    const [category, setCategory] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const { rules, loading: fetchingRules, error: fetchError, refetch } = useFetchRules();
    const { createRule, loading: creatingRule, error: createError } = useCreateRule();
    const { deleteRule, loading: deletingRule, error: deleteError } = useDeleteRule();

    const handleAddRule = async () => {
        if (!criterion || !category) {
            setSnackbar({ open: true, message: "Täida kõik väljad!", severity: "error" });
            return;
        }

        try {
            await createRule({ criterion: criterion, categoryName: category, id: id });
            refetch(); // Refetch rules after adding a new one
            setId("");
            setCriterion("");
            setCategory("");
            setSnackbar({ open: true, message: "Reegel lisatud!", severity: "success" });
        } catch {
            setSnackbar({ open: true, message: createError || "Reegli lisamine ebaõnnestus!", severity: "error" });
        }
    };

    const handleDeleteRule = async (ruleId) => {
        try {
            await deleteRule(ruleId);
            refetch();
            setSnackbar({ open: true, message: "Reegel kustutatud!", severity: "success" });
        } catch {
            setSnackbar({ open: true, message: deleteError || "Reegli kustutamine ebaõnnestus!", severity: "error" });
        }
    };
    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default", minHeight: "100vh" }}>
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" color="primary">
                    Lisa Reegel
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
                    Lisa reegel, et kategoriseerida tehinguid märksõnade põhjal.
                </Typography>
            </Paper>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Uus Reegel
                        </Typography>
                        <TextField
                            label="Märksõna"
                            fullWidth
                            variant="outlined"
                            value={criterion}
                            onChange={(e) => setCriterion(e.target.value)}
                            sx={{ mb: 2 }}
                            placeholder="Nt. restoran"
                        />
                        <TextField
                            label="Kategooria"
                            fullWidth
                            variant="outlined"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            sx={{ mb: 3 }}
                            placeholder="Nt. Meelelahutus"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveAlt />}
                            fullWidth
                            onClick={handleAddRule}
                            disabled={creatingRule}
                        >
                            Lisa Reegel
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Olemasolevad Reeglid
                        </Typography>
                        {fetchingRules ? (
                            <Typography variant="body2" color="text.secondary">
                                Laen reegleid...
                            </Typography>
                        ) : fetchError ? (
                            <Typography variant="body2" color="error">
                                {fetchError}
                            </Typography>
                        ) : rules.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                Reegleid pole veel lisatud.
                            </Typography>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Märksõna</TableCell>
                                            <TableCell>Kategooria</TableCell>
                                            <TableCell>Tegevused</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rules.map((rule) => (
                                            <TableRow key={rule.id}>
                                                <TableCell>{rule.criterion}</TableCell>
                                                <TableCell>{rule.categoryName}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteRule(rule.id)}
                                                        disabled={deletingRule}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddRulesPage;