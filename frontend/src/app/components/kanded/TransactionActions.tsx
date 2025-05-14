import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface TransactionActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export const TransactionActions = ({ onEdit, onDelete }: TransactionActionsProps) => {
    return (
        <>
            <Tooltip title="Muuda">
                <IconButton
                    onClick={onEdit}
                    size="small"
                    color="primary"
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Kustuta">
                <IconButton
                    onClick={onDelete}
                    size="small"
                    color="error"
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </>
    );
};