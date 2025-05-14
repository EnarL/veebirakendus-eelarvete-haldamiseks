package com.example.backend.users;

public record UserProfileDTO(
        String firstName,
        String lastName,
        String email
) {
}
