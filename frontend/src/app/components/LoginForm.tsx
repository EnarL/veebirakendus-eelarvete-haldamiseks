"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Alert, Box, Button, IconButton, InputAdornment, TextField, Typography,} from "@mui/material";
import {LockOutlined, PersonOutline, Visibility, VisibilityOff} from "@mui/icons-material";
import Link from "next/link";
import {useAuth} from "@/app/hooks/useAuth";

export function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState("");
    const { login, error: authError, isLoading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setValidationError("Palun täida kõik väljad!");
            return;
        }

        try {
            await login({ username, password });
        } catch (err) {
            console.error("Login submission error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {(validationError || authError) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {validationError || authError}
                </Alert>
            )}

            <TextField
                fullWidth
                margin="normal"
                label="Kasutajanimi"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                label="Parool"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockOutlined color="primary" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                aria-label={showPassword ? "Peida parool" : "Näita parooli"} // "Hide password" or "Show password" in Estonian
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
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
                {isLoading ? "Sisselogimine..." : "Logi sisse"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                    Pole veel kontot?{" "}
                    <Link
                        href="/register"
                        passHref
                        // @ts-ignore - Next.js route exists but TypeScript doesn't know about it
                    >
                        <Typography
                            component="span"
                            color="primary"
                            sx={{
                                textDecoration: "none",
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" }
                            }}
                        >
                            Registreeru
                        </Typography>
                    </Link>
                </Typography>
            </Box>
        </form>
    );
}