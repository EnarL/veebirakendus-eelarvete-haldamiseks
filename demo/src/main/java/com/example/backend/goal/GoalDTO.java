package com.example.backend.goal;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalDTO(
        Long id,
        String name,
        BigDecimal current,
        BigDecimal target,
        LocalDate deadline

) {}