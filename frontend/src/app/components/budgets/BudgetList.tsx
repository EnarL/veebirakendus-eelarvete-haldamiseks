"use client"
import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton,
    Collapse,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    LinearProgress,
    TextField,
    Stack, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import BudgetCategoryChart from '@/app/components/budgets/BudgetCategoryChart';
import { useSpentByCategory } from "@/app/hooks/useFetchSpentByCategory";

interface Member {
    id: number;
    username: string;
    email: string;
}

interface Category {
    id: number;
    name: string;
    budgetId: number;
}

interface Budget {
    id: number;
    name: string;
    totalAmount: number;
    shared: boolean;
    members: Member[];
    categories: Category[];
    startDate: string;
    endDate: string;
    spentPercentage?: number;
    totalSpent?: number;
}

interface BudgetListProps {
    budgets: Budget[];
    onInviteMember: (budgetId: number) => void;
    onRemoveMember: (budgetId: number, memberId: number) => void;
    onDeleteBudget: (budgetId: number) => void;
    onAddCategory: (budgetId: number, categoryName: string) => void;
    onRemoveCategory: (budgetId: number, categoryId: number) => void;
    expandedBudgetId: number | null;
    onExpandClick: (budgetId: number) => void;
    categoryData: CategoryData[] | null;
    categoryLoading: boolean;
    categoryError: string | null;
}

interface CategoryData {
    categoryName: string;
    amount: number;
}

// The key change is in the CategoryManager component in BudgetList.tsx

// CategoryManager component with improved loading indicators

const CategoryManager: React.FC<{
    budgetId: number;
    categories: Category[];
    onAddCategory: (budgetId: number, categoryName: string) => void;
    onRemoveCategory: (budgetId: number, categoryId: number) => void;
}> = ({ budgetId, categories, onAddCategory, onRemoveCategory }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isRemoving, setIsRemoving] = useState<number | null>(null);
    const [isAddingInProgress, setIsAddingInProgress] = useState(false);

    const handleAddCategory = async () => {
        if (newCategoryName.trim()) {
            setIsAddingInProgress(true);
            try {
                await onAddCategory(budgetId, newCategoryName.trim());
                setNewCategoryName('');
                setIsAddingCategory(false);
            } catch (err) {
                console.error('Error adding category:', err);
            } finally {
                setIsAddingInProgress(false);
            }
        }
    };

    const handleRemoveCategory = async (categoryId: number) => {
        setIsRemoving(categoryId);
        try {
            await onRemoveCategory(budgetId, categoryId);
        } catch (err) {
            console.error('Error removing category:', err);
        } finally {
            setIsRemoving(null);
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryIcon sx={{ mr: 1 }} />
                Kategooriad
            </Typography>

            {categories && categories.length > 0 ? (
                <List dense>
                    {categories.map((category) => (
                        <ListItem
                            key={category.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="remove category"
                                    onClick={() => handleRemoveCategory(category.id)}
                                    disabled={isRemoving === category.id}
                                >
                                    {isRemoving === category.id ?
                                        <CircularProgress size={20} /> :
                                        <RemoveCircleOutlineIcon color="error" />
                                    }
                                </IconButton>
                            }
                        >
                            <ListItemText primary={category.name || category.categoryName} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Kategooriad puuduvad. Lisa uus kategooria allpool.
                </Typography>
            )}

            {isAddingCategory ? (
                <Box sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <TextField
                            label="Kategooria nimi"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            size="small"
                            fullWidth
                            disabled={isAddingInProgress}
                        />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleAddCategory}
                            disabled={!newCategoryName.trim() || isAddingInProgress}
                            startIcon={isAddingInProgress ? <CircularProgress size={16} /> : <AddCircleOutlineIcon />}
                        >
                            {isAddingInProgress ? 'Lisamine...' : 'Lisa'}
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setIsAddingCategory(false)}
                            disabled={isAddingInProgress}
                        >
                            Tühista
                        </Button>
                    </Stack>
                </Box>
            ) : (
                <Button
                    startIcon={<AddCircleOutlineIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => setIsAddingCategory(true)}
                    sx={{ mt: 1 }}
                >
                    Lisa kategooria
                </Button>
            )}
        </Box>
    );
};
const BudgetWithSpent: React.FC<{
    budget: Budget;
    expandedBudgetId: number | null;
    onExpandClick: (budgetId: number) => void;
    onInviteMember: (budgetId: number) => void;
    onRemoveMember: (budgetId: number, memberId: number) => void;
    onAddCategory: (budgetId: number, categoryName: string) => void;
    onRemoveCategory: (budgetId: number, categoryId: number) => void;
    handleDeleteClick: (budgetId: number) => void;
    handleRemoveMemberClick: (budgetId: number, memberId: number) => void;
}> = ({
          budget,
          expandedBudgetId,
          onExpandClick,
          onInviteMember,
          onRemoveMember,
          onAddCategory,
          onRemoveCategory,
          handleDeleteClick,
          handleRemoveMemberClick,
      }) => {
    // Fetch spent data for this budget regardless of expanded state
    const { data: spentData, loading: spentLoading, error: spentError } = useSpentByCategory(budget.id, true);
    const [totalSpent, setTotalSpent] = useState(budget.totalSpent || 0);

    // Update total spent whenever spentData changes
    useEffect(() => {
        if (spentData && spentData.length > 0) {
            const calculatedTotal = spentData.reduce((sum, category) => sum + (category.amount || 0), 0);
            setTotalSpent(calculatedTotal);
        }
    }, [spentData]);

    const spentPercentage = (totalSpent / budget.totalAmount) * 100;

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="div">
                        {budget.name}
                        {budget.shared && (
                            <Chip
                                size="small"
                                icon={<ShareIcon />}
                                label="Jagatud"
                                color="primary"
                                variant="outlined"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Typography>
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteClick(budget.id)}
                        color="error"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Kokku: {budget.totalAmount.toFixed(2)} €
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Kulutatud: {totalSpent.toFixed(2)} €
                    </Typography>
                    <Typography
                        variant="body2"
                        color={
                            spentPercentage > 90
                                ? 'error.main'
                                : spentPercentage > 75
                                    ? 'warning.main'
                                    : 'success.main'
                        }
                    >
                        {spentPercentage.toFixed(1)}%
                    </Typography>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={Math.min(spentPercentage, 100)}
                    color={
                        spentPercentage > 90
                            ? 'error'
                            : spentPercentage > 75
                                ? 'warning'
                                : 'success'
                    }
                    sx={{ height: 10, borderRadius: 1, mt: 1, mb: 2 }}
                />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Periood: {new Date(budget.startDate).toLocaleDateString('et-EE')} -{' '}
                    {new Date(budget.endDate).toLocaleDateString('et-EE')}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                        Kategooriad:
                    </Typography>
                    {budget.categories && budget.categories.length > 0 ? (
                        budget.categories.map((category) => (
                            <Chip
                                key={category.id}
                                label={category.categoryName}
                                size="small"
                                variant="outlined"
                                color="primary"
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Kategooriad puuduvad
                        </Typography>
                    )}
                </Box>
            </CardContent>

            <CardActions>
                <Button
                    size="small"
                    onClick={() => onExpandClick(budget.id)}
                    endIcon={expandedBudgetId === budget.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                    {expandedBudgetId === budget.id ? 'Vähem' : 'Rohkem'}
                </Button>
                {budget.shared && (
                    <Button
                        size="small"
                        startIcon={<ShareIcon />}
                        onClick={() => onInviteMember(budget.id)}
                    >
                        Kutsu liige
                    </Button>
                )}
            </CardActions>

            <Collapse in={expandedBudgetId === budget.id} timeout="auto" unmountOnExit>
                <Divider />
                <CardContent>
                    <BudgetCategoryChart
                        budgetId={budget.id}
                        budgetName={budget.name}
                        categoryData={spentData}
                        loading={spentLoading}
                        error={spentError}
                    />

                    {/* Category Management Section */}
                    <CategoryManager
                        budgetId={budget.id}
                        categories={budget.categories || []}
                        onAddCategory={onAddCategory}
                        onRemoveCategory={onRemoveCategory}
                    />

                    {budget.shared && (
                        <>
                            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                                Liikmed
                            </Typography>
                            <List>
                                {budget.members.map((member) => (
                                    <ListItem
                                        key={member.id}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="remove"
                                                onClick={() => handleRemoveMemberClick(budget.id, member.id)}
                                            >
                                                <RemoveCircleOutlineIcon color="error" />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={member.username || 'Kasutaja'}
                                            secondary={member.email}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </CardContent>
            </Collapse>
        </Card>
    );
};

const BudgetList: React.FC<BudgetListProps> = ({
                                                   budgets,
                                                   onInviteMember,
                                                   onRemoveMember,
                                                   onDeleteBudget,
                                                   onAddCategory,
                                                   onRemoveCategory,
                                                   expandedBudgetId,
                                                   onExpandClick,
                                                   categoryData,
                                                   categoryLoading,
                                                   categoryError,
                                               }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [budgetToDelete, setBudgetToDelete] = React.useState<number | null>(null);
    const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = React.useState(false);
    const [memberToRemove, setMemberToRemove] = React.useState<{ budgetId: number; memberId: number } | null>(null);
    const [removeCategoryDialogOpen, setRemoveCategoryDialogOpen] = React.useState(false);
    const [categoryToRemove, setCategoryToRemove] = React.useState<{ budgetId: number; categoryId: number } | null>(null);

    const handleDeleteClick = (budgetId: number) => {
        setBudgetToDelete(budgetId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (budgetToDelete !== null) {
            onDeleteBudget(budgetToDelete);
        }
        setDeleteDialogOpen(false);
        setBudgetToDelete(null);
    };

    const handleRemoveMemberClick = (budgetId: number, memberId: number) => {
        setMemberToRemove({ budgetId, memberId });
        setRemoveMemberDialogOpen(true);
    };

    const handleRemoveMemberConfirm = () => {
        if (memberToRemove) {
            onRemoveMember(memberToRemove.budgetId, memberToRemove.memberId);
        }
        setRemoveMemberDialogOpen(false);
        setMemberToRemove(null);
    };

    const handleRemoveCategoryClick = (budgetId: number, categoryId: number) => {
        setCategoryToRemove({ budgetId, categoryId });
        setRemoveCategoryDialogOpen(true);
    };

    const handleRemoveCategoryConfirm = () => {
        if (categoryToRemove) {
            onRemoveCategory(categoryToRemove.budgetId, categoryToRemove.categoryId);
        }
        setRemoveCategoryDialogOpen(false);
        setCategoryToRemove(null);
    };

    if (!budgets || budgets.length === 0) {
        return (
            <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="body1">
                    Teil pole veel eelarveid. Palun looge uus eelarve "Lisa uus eelarve" vahekaardi kaudu.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <Grid container spacing={3}>
                {budgets.map((budget) => (
                    <Grid item xs={12} key={budget.id}>
                        <BudgetWithSpent
                            budget={budget}
                            expandedBudgetId={expandedBudgetId}
                            onExpandClick={onExpandClick}
                            onInviteMember={onInviteMember}
                            onRemoveMember={onRemoveMember}
                            onAddCategory={onAddCategory}
                            onRemoveCategory={onRemoveCategory}
                            handleDeleteClick={handleDeleteClick}
                            handleRemoveMemberClick={handleRemoveMemberClick}
                        />
                    </Grid>
                ))}
            </Grid>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Kinnita kustutamine</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Kas olete kindel, et soovite selle eelarve kustutada? Seda toimingut ei saa tagasi võtta.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Tühista</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Kustuta
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={removeMemberDialogOpen} onClose={() => setRemoveMemberDialogOpen(false)}>
                <DialogTitle>Kinnita liikme eemaldamine</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Kas olete kindel, et soovite selle liikme eelarvest eemaldada?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRemoveMemberDialogOpen(false)}>Tühista</Button>
                    <Button onClick={handleRemoveMemberConfirm} color="error" autoFocus>
                        Eemalda
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={removeCategoryDialogOpen} onClose={() => setRemoveCategoryDialogOpen(false)}>
                <DialogTitle>Kinnita kategooria eemaldamine</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Kas olete kindel, et soovite selle kategooria eemaldada? Kõik sellega seotud kulud säilivad, kuid need muutuvad kategoriseerimata kuludeks.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRemoveCategoryDialogOpen(false)}>Tühista</Button>
                    <Button onClick={handleRemoveCategoryConfirm} color="error" autoFocus>
                        Eemalda
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BudgetList;