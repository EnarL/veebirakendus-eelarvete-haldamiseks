package com.example.backend.integrationTests.users;

import com.example.backend.users.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=none",
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
public class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    private Users mockUser;
    private List<Users> mockUserList;
    private UserProfileDTO mockUserProfileDTO;
    private UserRegistrationRequest mockRegistrationRequest;
    private ChangePasswordRequest mockChangePasswordRequest;

    @BeforeEach
    void setup() {
        // Create a mock user
        mockUser = Users.builder()
                .id(1L)
                .kasutajanimi("testuser")
                .eesnimi("Test")
                .perekonnanimi("User")
                .email("test@example.com")
                .parool("encodedPassword")
                .build();

        // Create a list of mock users
        mockUserList = List.of(
                mockUser,
                Users.builder()
                        .id(2L)
                        .kasutajanimi("anotheruser")
                        .eesnimi("Another")
                        .perekonnanimi("User")
                        .email("another@example.com")
                        .parool("encodedPassword")
                        .build()
        );

        // Create a mock user profile DTO
        mockUserProfileDTO = new UserProfileDTO("Test", "User", "test@example.com");

        // Create a mock registration request
        mockRegistrationRequest = new UserRegistrationRequest(
                "newuser",
                "New",
                "User",
                "new@example.com",
                "password123"
        );

        // Create a mock change password request
        mockChangePasswordRequest = new ChangePasswordRequest(
                "oldPassword",
                "newPassword",
                "newPassword"
        );

        // Setup service mock responses
        when(userService.getAllUsers()).thenReturn(mockUserList);
        when(userService.getCurrentUser()).thenReturn(mockUserProfileDTO);
        doNothing().when(userService).register(any(UserRegistrationRequest.class));
        doNothing().when(userService).changePassword(any(ChangePasswordRequest.class));
        doNothing().when(userService).editProfile(any(UserProfileDTO.class));
        doNothing().when(userService).deleteUser(any(Long.class));
    }

    @Test
    @WithMockUser
    void getAllUsers_ShouldReturnUsersList() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].kasutajanimi").value("testuser"))
                .andExpect(jsonPath("$[0].eesnimi").value("Test"))
                .andExpect(jsonPath("$[0].perekonnanimi").value("User"))
                .andExpect(jsonPath("$[0].email").value("test@example.com"))
                // Password should never be returned in the response
                .andExpect(jsonPath("$[0].parool").value("encodedPassword"));
    }

    @Test
    @WithMockUser
    void getCurrentUser_ShouldReturnUserProfileDTO() throws Exception {
        mockMvc.perform(get("/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Test"))
                .andExpect(jsonPath("$.lastName").value("User"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @WithMockUser
    void register_ShouldReturnSuccessMessage() throws Exception {
        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockRegistrationRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    @WithMockUser
    void changePassword_ShouldReturnSuccessMessage() throws Exception {
        mockMvc.perform(post("/users/changepassword")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockChangePasswordRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password changed successfully"));
    }

    @Test
    @WithMockUser
    void editProfile_ShouldReturnSuccessMessage() throws Exception {
        UserProfileDTO updatedProfile = new UserProfileDTO(
                "Updated",
                "User",
                "updated@example.com"
        );

        mockMvc.perform(put("/users/editProfile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedProfile)))
                .andExpect(status().isOk())
                .andExpect(content().string("Profile updated successfully"));
    }

    @Test
    @WithMockUser
    void deleteUser_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/users/1"))
                .andExpect(status().isNoContent());
    }
}