package com.example.backend.category;

import java.util.List;

public record BudgetCategoryDTO(
        Long id,String categoryName, List<Long> transactionIds) {}