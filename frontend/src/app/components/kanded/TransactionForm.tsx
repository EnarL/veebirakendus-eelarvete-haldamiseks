import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Entry } from "@/app/types/types";
import { useState } from "react";

interface TransactionFormProps {
    open: boolean;
    isEditing: boolean;
    entry: Entry;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
    onSubmit: () => void;
    onImport: (file: File) => void; // Callback for file import
}

export const TransactionForm = ({
                                    open,
                                    isEditing,
                                    entry,
                                    onClose,
                                    onChange,
                                    onSubmit,
                                    onImport,
                                }: TransactionFormProps) => {
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleImportSubmit = () => {
        if (selectedFile) {
            onImport(selectedFile);
            setImportDialogOpen(false);
            setSelectedFile(null);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ color: "primary.main" }}>
                    {isEditing ? "Muuda kannet" : "Lisa uus kanne"}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                margin="dense"
                                label="Kuupäev"
                                type="date"
                                fullWidth
                                name="kuupäev"
                                value={entry.kuupäev}
                                onChange={onChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                margin="dense"
                                label="Summa"
                                type="number"
                                fullWidth
                                name="summa"
                                value={entry.summa}
                                onChange={onChange}
                                InputProps={{
                                    startAdornment: <Typography variant="body2" sx={{ mr: 0.5 }}>€</Typography>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                margin="dense"
                                label="Kategooria"
                                fullWidth
                                name="kategooria"
                                value={entry.kategooria}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Kirjeldus"
                                fullWidth
                                multiline
                                rows={3}
                                name="kirjeldus"
                                value={entry.kirjeldus}
                                onChange={onChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={onClose} color="inherit" variant="outlined">
                        Tühista
                    </Button>
                    <Button
                        onClick={onSubmit}
                        color="primary"
                        variant="contained"
                        startIcon={isEditing ? <EditIcon /> : <AddIcon />}
                    >
                        {isEditing ? "Salvesta muudatused" : "Lisa kanne"}
                    </Button>
                    <Button
                        onClick={() => setImportDialogOpen(true)}
                        color="secondary"
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                    >
                        Impordi väljavõte
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Import Dialog */}
            <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: "primary.main" }}>Impordi väljavõte</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box
                        onDrop={handleFileDrop}
                        onDragOver={(e) => e.preventDefault()}
                        sx={{
                            border: "2px dashed",
                            borderColor: "primary.main",
                            borderRadius: 2,
                            p: 3,
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                    >
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Lohista fail siia või klõpsa allolevale nupule
                        </Typography>
                        <Button variant="contained" component="label">
                            Otsi arvutist
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                        {selectedFile && (
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Valitud fail: {selectedFile.name}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setImportDialogOpen(false)} color="inherit" variant="outlined">
                        Tühista
                    </Button>
                    <Button
                        onClick={handleImportSubmit}
                        color="primary"
                        variant="contained"
                        disabled={!selectedFile}
                    >
                        Impordi
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};