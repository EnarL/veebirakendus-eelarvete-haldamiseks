"use client";

import {FormEvent} from 'react';
import {Box, Button, Divider, Grid, Paper, TextField, Typography} from '@mui/material';

interface PasswordFormProps {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    setCurrentPassword: (value: string) => void;
    setNewPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
    handlePasswordChange: (e: FormEvent) => void;
    handlePasswordReset: () => void;
}

export default function PasswordForm({
                                         currentPassword,
                                         newPassword,
                                         confirmPassword,
                                         setCurrentPassword,
                                         setNewPassword,
                                         setConfirmPassword,
                                         handlePasswordChange,
                                         handlePasswordReset
                                     }: PasswordFormProps) {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 2,
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                borderTop: '1px solid #0066cc',
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: "#333" }}>
                Parooli Muutmine
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handlePasswordChange} sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Praegune parool"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Uus parool"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Kinnita uus parool"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                            error={newPassword !== confirmPassword && confirmPassword !== ''}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                mt: 1,
                                bgcolor: '#0066cc',
                                '&:hover': { bgcolor: '#0055aa' }
                            }}
                        >
                            Uuenda Parool
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={handlePasswordReset}
                            sx={{
                                mt: 1,
                                ml: 2,
                                color: '#333',
                                borderColor: '#333',
                                '&:hover': { borderColor: '#000' }
                            }}
                        >
                            Lähtesta
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}