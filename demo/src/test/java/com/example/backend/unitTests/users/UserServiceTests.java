package com.example.backend.unitTests.users;

import com.example.backend.auth.SecurityUtils;
import com.example.backend.users.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityUtils securityUtils;

    @Mock
    private BCryptPasswordEncoder encoder;

    @InjectMocks
    private UserService userService;

    private Users testUser;

    @BeforeEach
    void setUp() {
        testUser = Users.builder()
                .id(1L)
                .kasutajanimi("testuser")
                .eesnimi("Test")
                .perekonnanimi("User")
                .email("test@example.com")
                .parool(new BCryptPasswordEncoder().encode("oldPassword")) // Encode the password
                .build();
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers() {
        // Arrange
        when(userRepository.findAll()).thenReturn(List.of(testUser));

        // Act
        List<Users> result = userService.getAllUsers();

        // Assert
        assertEquals(1, result.size());
        assertEquals("testuser", result.get(0).getKasutajanimi());
    }

    @Test
    void deleteUser_ShouldCallRepositoryDelete() {
        // Act
        userService.deleteUser(1L);

        // Assert
        verify(userRepository).deleteById(1L);
    }

    @Test
    void register_ShouldSaveNewUser() {
        // Arrange
        UserRegistrationRequest request = new UserRegistrationRequest(
                "testuser",
                "Test",
                "User",
                "test@example.com",
                "password"
        );
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);

        // Act
        userService.register(request);

        // Assert
        verify(userRepository).save(any(Users.class));
    }

    @Test
    void register_ShouldThrowExceptionIfEmailExists() {
        // Arrange
        UserRegistrationRequest request = new UserRegistrationRequest(
                "testuser",
                "Test",
                "User",
                "test@example.com",
                "password"
        );
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> userService.register(request));
        assertEquals(HttpStatus.CONFLICT.value(), exception.getStatusCode().value());
    }


    @Test
    void changePassword_ShouldThrowExceptionIfOldPasswordIsIncorrect() {
        // Arrange
        ChangePasswordRequest request = new ChangePasswordRequest("wrongPassword", "newPassword", "newPassword");
        UserPrincipal userPrincipal = new UserPrincipal(testUser); // Pass Users object
        when(securityUtils.getAuthenticatedUser()).thenReturn(userPrincipal);
        when(userRepository.findByKasutajanimi("testuser")).thenReturn(testUser);

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> userService.changePassword(request));
        assertEquals(HttpStatus.UNAUTHORIZED.value(), exception.getStatusCode().value());
    }
    @Test
    void getCurrentUser_ShouldReturnUserProfileDTO() {
        // Arrange
        UserPrincipal userPrincipal = new UserPrincipal(testUser); // Pass Users object
        when(securityUtils.getAuthenticatedUser()).thenReturn(userPrincipal);
        when(userRepository.findByKasutajanimi("testuser")).thenReturn(testUser);

        // Act
        UserProfileDTO result = userService.getCurrentUser();

        // Assert
        assertEquals("Test", result.firstName());
        assertEquals("User", result.lastName());
        assertEquals("test@example.com", result.email());
    }

    @Test
    void editProfile_ShouldUpdateUserProfile() {
        // Arrange
        UserProfileDTO request = new UserProfileDTO("UpdatedFirstName", "UpdatedLastName", "updated@example.com");
        UserPrincipal userPrincipal = new UserPrincipal(testUser); // Pass Users object
        when(securityUtils.getAuthenticatedUser()).thenReturn(userPrincipal);
        when(userRepository.findByKasutajanimi("testuser")).thenReturn(testUser);

        // Act
        userService.editProfile(request);

        // Assert
        verify(userRepository).save(testUser);
        assertEquals("UpdatedFirstName", testUser.getEesnimi());
        assertEquals("UpdatedLastName", testUser.getPerekonnanimi());
        assertEquals("updated@example.com", testUser.getEmail());
    }
}