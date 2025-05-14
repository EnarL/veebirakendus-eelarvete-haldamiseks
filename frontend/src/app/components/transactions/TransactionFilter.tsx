"use client";

import { Tab, Tabs } from '@mui/material';

interface TransactionFiltersProps {
    filterValue: string;
    handleFilterChangeAction: (event: React.SyntheticEvent, newValue: string) => void;
}

export default function TransactionFilters({
                                               filterValue,
                                               handleFilterChangeAction
                                           }: TransactionFiltersProps) {
    return (
        <Tabs
            value={filterValue}
            onChange={handleFilterChangeAction}
            sx={{ mb: 3 }}
            TabIndicatorProps={{ style: { height: 3, borderRadius: 3 } }}
        >
            <Tab label="Kõik" value="Kõik" />
            <Tab label="Tulud" value="Tulud" />
            <Tab label="Kulud" value="Kulud" />
        </Tabs>
    );
}