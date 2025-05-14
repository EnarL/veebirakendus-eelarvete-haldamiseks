package com.example.backend.transaction;

import java.math.BigDecimal;

public record MonthlyIncomeDTO(
        int month, // Only the month number
        BigDecimal totalIncome
) {}
