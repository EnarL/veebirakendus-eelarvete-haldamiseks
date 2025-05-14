package com.example.backend.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionDTO(
        Long id,
        TransactionType transactionType,
        BigDecimal amount,
        LocalDate transactionDate,
        String categoryName,
        String description
) {}