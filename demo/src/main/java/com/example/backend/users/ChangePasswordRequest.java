package com.example.backend.users;

public record ChangePasswordRequest(
        String currentPassword,
        String newPassword,
        String confirmationPassword
) {

}
