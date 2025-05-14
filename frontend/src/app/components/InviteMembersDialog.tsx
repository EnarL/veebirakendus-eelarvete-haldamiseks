import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import {Email} from '@mui/icons-material';

interface InviteMemberDialogProps {
    open: boolean;
    onClose: () => void;
    onInvite: (email: string) => void;
}

const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   onInvite
                                                               }) => {
    const [inviteEmail, setInviteEmail] = useState("");

    const handleInvite = () => {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(inviteEmail)) {
            onInvite(inviteEmail);
            setInviteEmail("");
        } else {

            alert("Palun sisestage kehtiv e-posti aadress");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>Kutsu liige</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="E-posti aadress"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <Email color="action" sx={{ mr: 1 }} />
                        ),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Tühista
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleInvite}
                >
                    Kutsu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InviteMemberDialog;