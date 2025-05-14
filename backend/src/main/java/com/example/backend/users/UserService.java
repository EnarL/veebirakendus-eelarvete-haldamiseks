package com.example.backend.users;

import com.example.backend.auth.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    private final SecurityUtils securityUtils;

    public UserService(UserRepository userRepository, SecurityUtils securityUtils) {
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }


    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public void register(UserRegistrationRequest request) {
        if (request.password() == null || request.password().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password cannot be null or empty");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with provided credentials already exists");
        }

        // Create and save the user
        Users user = Users.builder()
                .kasutajanimi(request.username())
                .eesnimi(request.firstname())
                .perekonnanimi(request.lastname())
                .email(request.email())
                .parool(encoder.encode(request.password())) // Ensure password is not null
                .build();
        userRepository.save(user);
    }

    public void changePassword(ChangePasswordRequest request) {
        UserPrincipal userPrincipal = securityUtils.getAuthenticatedUser();
        Users user = userRepository.findByKasutajanimi(userPrincipal.getUsername());
        if (!encoder.matches(request.currentPassword(), user.getParool())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current password is incorrect");
        }
        user.setParool(encoder.encode(request.newPassword()));

        userRepository.save(user);
    }

    public UserProfileDTO getCurrentUser() {
        UserPrincipal userPrincipal = securityUtils.getAuthenticatedUser();

        Users user = userRepository.findByKasutajanimi(userPrincipal.getUsername());

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return new UserProfileDTO(
                user.getEesnimi(),
                user.getPerekonnanimi(),
                user.getEmail()
        );
    }

    public void editProfile(UserProfileDTO request) {
        UserPrincipal userPrincipal = securityUtils.getAuthenticatedUser();
        Users user = userRepository.findByKasutajanimi(userPrincipal.getUsername());

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        if (request.firstName() != null) {
            user.setEesnimi(request.firstName());
        }
        if (request.lastName() != null) {
            user.setPerekonnanimi(request.lastName());
        }
        if (request.email() != null) {
            user.setEmail(request.email());
        }

        userRepository.save(user);
    }
}