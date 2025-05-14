import { Grid, Stack, TextField, Button, useTheme, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface TransactionFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    startDate: string;
    onStartDateChange: (value: string) => void;
    endDate: string;
    onEndDateChange: (value: string) => void;
    isMobile?: boolean;
}

export const TransactionFilters = ({
                                       searchTerm,
                                       onSearchChange,
                                       startDate,
                                       onStartDateChange,
                                       endDate,
                                       onEndDateChange,
                                       isMobile
                                   }: TransactionFiltersProps) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isOnMobile = isMobile !== undefined ? isMobile : isSmallScreen;

    const handleReset = () => {
        onStartDateChange("");
        onEndDateChange("");
    };

    return (
        <Grid container spacing={isOnMobile ? 1 : 2} sx={{ mb: isOnMobile ? 2 : 3 }}>
            <Grid item xs={12} sm={6} md={4}>
                <TextField
                    fullWidth
                    placeholder="Otsi kande järgi..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: isOnMobile ? "0.8rem" : "0.8rem" }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Alguskuupäev"
                    type="date"
                    value={startDate}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ fontSize: isOnMobile ? "0.8rem" : "0.8rem" }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Stack
                    direction={isOnMobile ? "column" : "row"}
                    spacing={isOnMobile ? 1 : 2}
                    sx={{ width: "100%" }}
                >
                    <TextField
                        label="Lõppkuupäev"
                        type="date"
                        value={endDate}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => onEndDateChange(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ fontSize: isOnMobile ? "0.8rem" : "1rem" }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReset}
                        sx={{
                            fontSize: isOnMobile ? "0.75rem" : "0.8rem",
                            padding: isOnMobile ? "4px 4px" : undefined,
                            minWidth: isOnMobile ? "80px" : undefined
                        }}
                        size={isOnMobile ? "small" : "medium"}
                    >
                        Lähtesta
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};