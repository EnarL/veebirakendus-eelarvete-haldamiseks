package com.example.backend.category;

import java.util.List;

public record CategoryDTO(
        Long id,
        String name,
        Long userId,
        boolean isGlobal,
        List<Long> transactionIds
) {}