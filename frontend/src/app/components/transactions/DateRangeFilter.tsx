"use client";

import { Grid, TextField, InputAdornment, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface DateRangeFilterProps {
    startDate: string;
    endDate: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
}

export default function DateRangeFilter({
                                            startDate,
                                            endDate,
                                            setStartDate,
                                            setEndDate
                                        }: DateRangeFilterProps) {
    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={5}>
                <TextField
                    label="Alguskuupäev"
                    type="date"
                    fullWidth
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CalendarTodayIcon color="action" fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={12} md={5}>
                <TextField
                    label="Lõppkuupäev"
                    type="date"
                    fullWidth
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CalendarTodayIcon color="action" fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {
                        setStartDate('');
                        setEndDate('');
                    }}
                >
                    Lähtesta
                </Button>
            </Grid>
        </Grid>
    );
}