import {ReactNode} from "react";
import {Box, Card, CardContent, Typography} from "@mui/material";

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <Card sx={{ py: 2, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                </Box>
                {children}
            </CardContent>
        </Card>
    );
}