"use client";
import {NextPage} from "next";
import {useEffect, useState, useCallback} from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import {Add, Delete, Edit, Search} from "@mui/icons-material";
import {useFetchCategories} from "@/app/hooks/useFetchCategories";
import useDeleteCategory from "@/app/hooks/useDeleteCategory";
import useCreateCategory from "@/app/hooks/useCreateCategory";

interface Category {
    id?: number;
    name: string;
}

const CategoriesPage: NextPage = () => {
    const { categories: fetchedCategories, loading: isLoading, error } = useFetchCategories();
    const { deleteCategory, loading: deleteLoading, error: deleteError, success: deleteSuccess, deletedId } = useDeleteCategory();
    const { createCategory, loading: creatingCategory, error: createError, success } = useCreateCategory();
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editCategory, setEditCategory] = useState<Category>({ name: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    // Memoize showNotification for consistent reference
    const showNotification = useCallback((message: string, severity: "success" | "error" | "info" | "warning") => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    }, []);

    useEffect(() => {
        if (fetchedCategories) {


            if (Array.isArray(fetchedCategories)) {
                const mappedCategories = fetchedCategories.map((item) => {
                    if (typeof item === 'object' && item !== null && 'name' in item) {
                        return item;
                    }
                    // If item is a string (the name directly)
                    return { name: String(item || '') };
                });
                console.log("Mapped categories:", mappedCategories);
                setCategories(mappedCategories);
            } else {
                console.error("fetchedCategories is not an array:", fetchedCategories);
            }
        }
    }, [fetchedCategories]);

    // Effect to filter categories when categories or searchTerm changes
    useEffect(() => {
        const filtered = categories.filter(cat => {
            const catName = String(cat.name || '');
            return catName.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredCategories(filtered);
    }, [categories, searchTerm]);

    // Effect for delete operation results
    useEffect(() => {
        if (deleteSuccess && deletedId) {
            // Update categories locally without refetching
            setCategories(prevCategories => prevCategories.filter(cat => cat.id !== deletedId));
            showNotification("Kategooria kustutatud!", "success");
        } else if (deleteError) {
            showNotification(deleteError, "error");
        }
    }, [deleteSuccess, deleteError, deletedId, showNotification]);

    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            try {
                await createCategory({ name: newCategory, isGlobal: false });
                setCategories(prev => [...prev, { name: newCategory }]);
                setNewCategory("");
                showNotification("Kategooria lisatud edukalt!", "success");
            } catch (err) {
                showNotification(createError || "Kategooria lisamine ebaõnnestus!", "error");
            }
        }
    };

    const handleDeleteCategory = async (categoryName: string, id?: number) => {
        if (!id) {
            // If no ID, filter by name (client-side only)
            setCategories(categories.filter(cat => cat.name !== categoryName));
            showNotification("Kategooria kustutatud!", "success");
            return;
        }

        try {
            await deleteCategory(id);
            // The state update will be handled in the useEffect
        } catch (err) {
            console.error("Error deleting category:", err);
        }
    };

    const handleOpenEditDialog = (category: Category) => {
        setEditCategory({ ...category });
        setOpenDialog(true);
    };

    const handleUpdateCategory = () => {
        if (editCategory.name.trim()) {
            setCategories(categories.map(cat =>
                cat.id === editCategory.id ? { ...cat, name: editCategory.name } : cat
            ));
            setOpenDialog(false);
            showNotification("Kategooria uuendatud!", "success");
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default", minHeight: "100vh" }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3, display: "flex", flexDirection: "column" }}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 2 }}>
                    Kategooriad
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            label="Lisa uus kategooria"
                            fullWidth
                            variant="outlined"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddCategory}
                                        disabled={!newCategory.trim()}
                                        startIcon={<Add />}
                                        sx={{ ml: 1 }}
                                    >
                                        Lisa
                                    </Button>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    paddingRight: 1,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Otsi kategooriaid..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                            }}
                            size="medium"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ p: 0, overflow: "hidden" }}>
                <Box sx={{ p: 2, backgroundColor: "primary.main", color: "white" }}>
                    <Typography variant="h6">
                        Olemasolevad kategooriad ({filteredCategories.length})
                    </Typography>
                </Box>

                {isLoading ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="body1" color="text.secondary">
                            Kategooriaid laaditakse...
                        </Typography>
                    </Box>
                ) : error ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="body1" color="error">
                            Viga kategooriate laadimisel!
                        </Typography>
                    </Box>
                ) : filteredCategories.length > 0 ? (
                    <List sx={{ width: '100%', bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
                        {filteredCategories.map((category, index) => (
                            <Box key={category.id || `cat-${index}`} sx={{ mb: index < filteredCategories.length - 1 ? 2 : 0 }}>
                                <ListItem
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                    }}
                                    secondaryAction={
                                        <Box sx={{ display: "flex", gap: 1, marginRight: 2 }}>
                                            <IconButton
                                                edge="end"
                                                aria-label="edit"
                                                onClick={() => handleOpenEditDialog(category)}
                                                sx={{ color: "primary.main" }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleDeleteCategory(category.name, category.id)}
                                                sx={{ color: "error.main" }}
                                                disabled={deleteLoading && deletedId === category.id}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {category.name}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </Box>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="body1" color="text.secondary">
                            {searchTerm ? "Otsingutulemusi ei leitud." : "Kategooriad puuduvad. Lisage uus kategooria."}
                        </Typography>
                    </Box>
                )}
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Muuda kategooriat</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Kategooria nimi"
                        fullWidth
                        variant="outlined"
                        value={editCategory.name}
                        onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Tühista
                    </Button>
                    <Button
                        onClick={handleUpdateCategory}
                        color="primary"
                        variant="contained"
                        disabled={!editCategory.name.trim()}
                    >
                        Salvesta
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity as "success" | "error" | "info" | "warning"}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CategoriesPage;