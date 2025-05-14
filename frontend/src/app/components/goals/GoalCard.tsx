import React from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    LinearProgress,
    Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface Goal {
    id: number;
    name: string;
    target: number;
    current: number;
    deadline: string;
}

interface GoalCardProps {
    goal: Goal;
    onDelete: (id: number) => void;
    onEdit: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete, onEdit }) => {
    const formatCurrency = (amount: string | number | bigint) => {
        // @ts-ignore
        return new Intl.NumberFormat("et-EE", { style: "currency", currency: "EUR" }).format(amount);
    };

    const calculateDaysLeft = (deadline: string | number | Date) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const progress = (goal.current / goal.target) * 100;
    const daysLeft = calculateDaysLeft(goal.deadline);

    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                backgroundColor: "background.primary",
                height: "100%",
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {goal.name}
                    </Typography>
                    <Box>
                        <IconButton size="small" sx={{ mr: 1 }} onClick={() => onEdit(goal)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onDelete(goal.id)}
                        >
                            <DeleteOutlineIcon fontSize="small" color="error" />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    {/* Changed to span to avoid p > div nesting */}
                    <Typography variant="body2" color="text.secondary" component="span">
                        Tähtaeg:{" "}
                    </Typography>
                    <Chip
                        size="small"
                        label={`${new Date(goal.deadline).toLocaleDateString(
                            "et-EE"
                        )} (${daysLeft} päeva)`}
                        color={daysLeft < 30 ? "warning" : "default"}
                        sx={{ fontWeight: 500, ml: 1 }}
                    />
                </Box>

                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Eesmärk: {formatCurrency(goal.target)}
                    </Typography>
                    <Typography
                        variant="body2"
                        fontWeight="medium"
                        color={progress >= 100 ? "secondary.main" : "text.primary"}
                    >
                        Praegune: {formatCurrency(goal.current)} ({Math.round(progress)}%)
                    </Typography>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={progress > 100 ? 100 : progress}
                    color={progress >= 100 ? "secondary" : "primary"}
                    sx={{ mt: 2, height: 8, borderRadius: 5 }}
                />

                {progress >= 100 && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 2,
                        }}
                    >
                        <CheckCircleIcon
                            color="secondary"
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                        />
                        <Typography
                            variant="body2"
                            color="secondary.main"
                            fontWeight="medium"
                        >
                            Eesmärk saavutatud!
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default GoalCard;