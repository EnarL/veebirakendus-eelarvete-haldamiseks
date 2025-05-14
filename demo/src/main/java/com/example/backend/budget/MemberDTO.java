package com.example.backend.budget;

public record MemberDTO(
        String email,
        Long id,
        String username
) {}