"use client";

import {FormEvent} from 'react';
import {Box, Button, Divider, Grid, Paper, TextField, Typography} from '@mui/material';

interface ProfileFormProps {
    firstName: string;
    lastName: string;
    email: string;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setEmail: (value: string) => void;
    handleProfileUpdate: (e: FormEvent) => void;
    handleProfileReset: () => void;
}

export default function ProfileForm({
                                        firstName,
                                        lastName,
                                        email,
                                        setFirstName,
                                        setLastName,
                                        setEmail,
                                        handleProfileUpdate,
                                        handleProfileReset
                                    }: ProfileFormProps) {
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
                Andmete muutmine
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleProfileUpdate} sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Eesnimi"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Perenimi"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="E-post"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
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
                            Salvesta Andmed
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={handleProfileReset}
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