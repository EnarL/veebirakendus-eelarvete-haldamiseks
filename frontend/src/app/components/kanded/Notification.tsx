import { Alert, Snackbar } from "@mui/material";

interface NotificationProps {
    open: boolean;
    message: string;
    severity: "success" | "error";
    onClose: () => void;
}

export const Notification = ({ open, message, severity, onClose }: NotificationProps) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
};