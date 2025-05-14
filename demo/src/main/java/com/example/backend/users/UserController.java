package com.example.backend.users;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    @PostMapping("/changepassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok("Password changed successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserRegistrationRequest request) {
        userService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }
    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }
    @PutMapping("/editProfile")
    public ResponseEntity<?> editProfile(@RequestBody @Valid UserProfileDTO request) {
        userService.editProfile(request);
        return ResponseEntity.ok("Profile updated successfully");
    }


}