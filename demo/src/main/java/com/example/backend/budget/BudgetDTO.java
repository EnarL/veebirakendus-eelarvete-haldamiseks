package com.example.backend.budget;

import com.example.backend.category.BudgetCategoryDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record BudgetDTO(
        Long id,
        String name,
        BigDecimal totalAmount,
        List<BudgetCategoryDTO> categories,
        boolean shared,
        List<MemberDTO> members,
        LocalDate startDate,
        LocalDate endDate
) {}