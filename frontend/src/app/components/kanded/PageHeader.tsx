import {Box, Button, CardHeader, Stack, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface PageHeaderProps {
    onAddNew: () => void;
}

export const PageHeader = ({ onAddNew }: PageHeaderProps) => {
    return (
        <CardHeader
            title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" color="primary.main">
                        Kanded
                    </Typography>
                </Box>
            }
            action={
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={onAddNew}
                        sx={{
                            mt: 1,
                            transition: "all 0.2s",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            },
                        }}
                    >
                        Lisa uus kanne
                    </Button>
                </Stack>
            }
        />
    );
};