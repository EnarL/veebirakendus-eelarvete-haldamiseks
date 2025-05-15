import React from 'react';
import {
    Avatar,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import {Delete, PersonAdd} from '@mui/icons-material';

interface Member {
    id: number;
    username: string;
    email: string;
}

interface BudgetMembersListProps {
    budgetId: number;
    members: Member[];
    onInviteMember: (budgetId: number) => void;
    onRemoveMember: (budgetId: number, memberId: number) => void;
}

const BudgetMembersList: React.FC<BudgetMembersListProps> = ({
                                                                 budgetId,
                                                                 members,
                                                                 onInviteMember,
                                                                 onRemoveMember
                                                             }) => {
    return (
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" color="primary">
                    Liikmed
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAdd />}
                    onClick={() => onInviteMember(budgetId)}
                >
                    Kutsu liige
                </Button>
            </Box>

            <List>
                {members.map((member) => (
                    <ListItem
                        key={member.id}
                        secondaryAction={

                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => onRemoveMember(budgetId, member.id)}
                                >
                                    <Delete />
                                </IconButton>

                        }
                    >
                        <ListItemAvatar>
                            <Avatar sx={{
                                bgcolor: "primary.main"
                            }}>
                                {member.username && member.username.length > 0 ? member.username[0].toUpperCase() : "?"}
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            primary={member.username}
                            disableTypography
                            secondary={
                                <Box sx={{ mt: 0.5 }}>
                                    <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mb: 0.5 }}>
                                        {member.email}
                                    </Typography>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default BudgetMembersList;