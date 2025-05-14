"use client";

import {Alert, Snackbar} from '@mui/material';

interface NotificationProps {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
    handleClose: () => void;
}

export default function Notification({
                                         open,
                                         message,
                                         severity,
                                         handleClose
                                     }: NotificationProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}