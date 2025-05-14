"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import {
    Email,
    LockOutlined,
    PersonOutline,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import Link from "next/link";
import { useRegister } from "@/app/hooks/useRegister";

export function RegistrationForm() {
    const [eesnimi, setEesnimi] = useState('');
    const [perekonnanimi, setPerekonnanimi] = useState('');
    const [kasutajanimi, setKasutajanimi] = useState('');
    const [email, setEmail] = useState('');
    const [parool, setParool] = useState('');
    const [confirmParool, setConfirmParool] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [successMessageOpen, setSuccessMessageOpen] = useState(false);
    const { register, error: registerError, isLoading } = useRegister();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setValidationError('');

        if (!eesnimi || !perekonnanimi || !kasutajanimi || !email || !parool || !confirmParool) {
            setValidationError('Palun täida kõik väljad!');
            return;
        }

        if (parool !== confirmParool) {
            setValidationError('Paroolid ei kattu');
            return;
        }

        try {
            await register({
                username: kasutajanimi,
                firstname: eesnimi,
                lastname: perekonnanimi,
                email: email,
                password: parool,
            });

            // Show success message
            setSuccessMessageOpen(true);

            // Delay redirect to login
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            console.error("Registration error:", err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {(validationError || registerError) && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {validationError || registerError}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    margin="normal"
                    label="Eesnimi"
                    variant="outlined"
                    value={eesnimi}
                    onChange={(e) => setEesnimi(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Perekonnanimi"
                    variant="outlined"
                    value={perekonnanimi}
                    onChange={(e) => setPerekonnanimi(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Kasutajanimi"
                    variant="outlined"
                    value={kasutajanimi}
                    onChange={(e) => setKasutajanimi(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutline color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="E-posti aadress"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Parool"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    value={parool}
                    onChange={(e) => setParool(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlined color="primary" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Kinnita parool"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    value={confirmParool}
                    onChange={(e) => setConfirmParool(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlined color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                >
                    {isLoading ? "Registreerimine..." : "Registreeru"}
                </Button>

                <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Typography variant="body2">
                        Juba on konto?{" "}
                        <Link href="/login" passHref>
                            <Typography
                                component="span"
                                color="primary"
                                sx={{
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    "&:hover": { textDecoration: "underline" }
                                }}
                            >
                                Logi sisse
                            </Typography>
                        </Link>
                    </Typography>
                </Box>
            </form>

            <Snackbar
                open={successMessageOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessMessageOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setSuccessMessageOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Edukalt registreeritud!
                </Alert>
            </Snackbar>
        </>
    );
}
