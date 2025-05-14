import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: "#006699" },
        secondary: { main: "#003366" },
        background: { default: "#E6F2F7" },
        text: { primary: "#333333" },
        success: { main: "#4caf50" },
        error: { main: "#f44336" },
    },
    typography: {
        h5: { fontWeight: 600 },
        h6: { fontWeight: 500 },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: "#006699",
                    color: "#fff",
                    fontWeight: 600,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: 12 },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: { overflow: "visible" },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;