package com.example.backend.auth;

import com.example.backend.users.UserLoginRequest;
import com.example.backend.users.UserRegistrationRequest;
import com.example.backend.users.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final TokenService tokenService;

    public AuthController(AuthService authService, UserService userService, TokenService tokenService) {
        this.authService = authService;
        this.userService = userService;
        this.tokenService = tokenService;
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationRequest request){
        userService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping(value = "/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginRequest request, HttpServletResponse response) {
        authService.login(request, response);
        return ResponseEntity.ok("User logged in successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.noContent().build();
    }
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletResponse response) {
        tokenService.refreshToken(response);
        return ResponseEntity.noContent().build();
    }
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        authService.checkSession(request);
        return ResponseEntity.ok("Session is valid");
    }

}