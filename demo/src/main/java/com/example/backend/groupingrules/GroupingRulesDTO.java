package com.example.backend.groupingrules;

public record GroupingRulesDTO(
        Long id,
        String criterion,
        String categoryName,
        Boolean isActive
) {}