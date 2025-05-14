"use client";

import { Box, Container } from "@mui/material";
import { AuthCard } from "@/app/components/AuthCard";
import { LoginForm } from "@/app/components/LoginForm";

export default function Login() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "background.default",
            }}
        >
            <Container maxWidth="sm">
                <AuthCard
                    title="Logi sisse"
                    subtitle="Tere tulemast! Palun logi sisse oma kontoga."
                >
                    <LoginForm />
                </AuthCard>
            </Container>
        </Box>
    );
}