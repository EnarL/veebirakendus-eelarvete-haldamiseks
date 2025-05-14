package com.example.backend.users;

public record UserLoginRequest(
        String username,
        String password
) {
}
