import React from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GoalCard from "./GoalCard";

interface Goal {
    id: number;
    name: string;
    target: number;
    current: number;
    deadline: string;
}

interface GoalsListProps {
    goals: Goal[];
    onDelete: (id: number) => void;
    onEdit: (goal: Goal) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, onDelete, onEdit }) => {
    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Sinu eesmärgid
            </Typography>

            <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>
                {goals.map((goal, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <GoalCard
                            goal={goal}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    </Grid>
                ))}
            </Grid>

            {goals.length === 0 && (
                <Paper elevation={3} sx={{ textAlign: "center", borderRadius: 3, p: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                        Sul pole ühtegi seatud eesmärki. Alusta esimese eesmärgi lisamisega!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ mt: 2 }}
                    >
                        Lisa esimene eesmärk
                    </Button>
                </Paper>
            )}
        </Box>
    );
};

export default GoalsList;