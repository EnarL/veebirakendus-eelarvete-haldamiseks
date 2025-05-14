package com.example.backend.transaction;

import java.math.BigDecimal;

public record MonthlySummaryDTO(
        int month,
        BigDecimal totalIncome,
        BigDecimal totalExpense
) {}