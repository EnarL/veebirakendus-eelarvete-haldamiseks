package com.example.backend.transaction;

import java.math.BigDecimal;

public record MonthlyExpenseDTO(
        int month, // Only the month number
        BigDecimal totalExpense
) {}