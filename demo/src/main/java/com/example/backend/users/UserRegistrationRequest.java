package com.example.backend.users;

public record UserRegistrationRequest(
        String username,
        String firstname,
        String lastname,
        String email,
        String password
) {}
