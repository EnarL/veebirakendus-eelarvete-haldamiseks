package com.example.backend.auth;

import com.example.backend.users.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Component
public class SecurityUtils {

    public static Optional<UserPrincipal> getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal) {
            return Optional.of((UserPrincipal) principal);
        }
        return Optional.empty();
    }

    public static String getAuthenticatedEmail(){
        return SecurityUtils.getAuthenticatedUser()
                .map(UserPrincipal::getEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated")); // Throw exception if not authenticated
    }

    public static Long getAuthenticatedUserId() {
        return SecurityUtils.getAuthenticatedUser()
                .map(UserPrincipal::getUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated")); // Throw exception if not authenticated
    }

}