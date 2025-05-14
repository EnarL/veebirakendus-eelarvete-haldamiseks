
"use client";

import { Box, Container } from "@mui/material";
import { AuthCard } from "@/app/components/AuthCard";
import { RegistrationForm } from "@/app/components/RegistrationForm";

export default function Register() {
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
                    title="Registreeri"
                    subtitle="Loo endale konto meie rakendusse"
                >
                    <RegistrationForm />
                </AuthCard>
            </Container>
        </Box>
    );
}