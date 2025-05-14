"use client";

import { FormEvent, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import ProfileForm from '@/app/components/settings/ProfileForm';
import PasswordForm from '@/app/components/settings/PasswordForm';
import Notification from '@/app/components/settings/Notification';
import { useChangePassword } from '@/app/hooks/useChangePassword';
import { useFetchUserData } from '@/app/hooks/useFetchUserData';
import { useUpdateUserData } from '@/app/hooks/useUpdateUserData';

export default function SettingsPage() {
    const { userData, loading: userLoading, error: userError } = useFetchUserData();
    const { updateUserData, loading: updateLoading, error: updateError } = useUpdateUserData();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const { changePassword, loading: passwordLoading, error: passwordError } = useChangePassword();

    useEffect(() => {
        if (userData) {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
        }
    }, [userData]);

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email) {
            showSnackbar('Palun täitke kõik väljad', 'error');
            return;
        }

        try {
            await updateUserData({ firstName, lastName, email });
            showSnackbar('Profiil edukalt uuendatud!', 'success');
        } catch {
            showSnackbar(updateError || 'Profiili uuendamine ebaõnnestus', 'error');
        }
    };

    const handlePasswordChange = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            showSnackbar('Palun täitke kõik väljad', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            showSnackbar('Uued paroolid ei ühti', 'error');
            return;
        }

        try {
            await changePassword({ currentPassword, newPassword, confirmationPassword: confirmPassword });
            showSnackbar('Parool edukalt muudetud!', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch {
            showSnackbar(passwordError || 'Parooli muutmine ebaõnnestus', 'error');
        }
    };

    const handleProfileReset = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
    };

    const handlePasswordReset = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    if (userLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (userError) {
        return <Typography>Error: {userError}</Typography>;
    }

    return (
        <Box
            sx={{
                flexGrow: 1,
                p: 4,
                backgroundColor: "background.default",
                minHeight: "100vh",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    color: "#0066cc", // Blue color
                    fontWeight: 600,
                }}
            >
                Seaded
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <ProfileForm
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        setFirstName={setFirstName}
                        setLastName={setLastName}
                        setEmail={setEmail}
                        handleProfileUpdate={handleProfileUpdate}
                        handleProfileReset={handleProfileReset}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <PasswordForm
                        currentPassword={currentPassword}
                        newPassword={newPassword}
                        confirmPassword={confirmPassword}
                        setCurrentPassword={setCurrentPassword}
                        setNewPassword={setNewPassword}
                        setConfirmPassword={setConfirmPassword}
                        handlePasswordChange={handlePasswordChange}
                        handlePasswordReset={handlePasswordReset}
                        loading={passwordLoading}
                    />
                </Grid>
            </Grid>

            <Notification
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                handleClose={() => setSnackbarOpen(false)}
            />
        </Box>
    );
}