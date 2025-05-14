package com.example.backend.integrationTests.category;

import com.example.backend.category.CategoryDTO;
import com.example.backend.category.CategoryService;
import com.example.backend.users.UsersDTO;
import com.example.backend.auth.JWTUtil;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for CategoryController
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=none",
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
public class CategoryControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CategoryService categoryService;

    @MockitoBean
    private JWTUtil jwtUtil; // If needed for security

    private CategoryDTO mockCategory;
    private List<CategoryDTO> mockCategoryList;
    private List<UsersDTO> mockUsersList;

    @BeforeEach
    void setup() {
        mockCategory = new CategoryDTO(1L, "Test Category", 3L, false, null);
        mockCategoryList = List.of(mockCategory);
        mockUsersList = List.of(new UsersDTO("user", "testuser", "Test User", "testuser@example.com"));

        when(categoryService.getCategory(1L)).thenReturn(mockCategory);
        when(categoryService.getAllCategories()).thenReturn(mockCategoryList);
        when(categoryService.getUsersForGlobalCategory(1L)).thenReturn(mockUsersList);
    }

    @Test
    @WithMockUser
    void getCategory_ShouldReturnCategory() throws Exception {
        mockMvc.perform(get("/category/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Category"));
    }

    @Test
    @WithMockUser
    void getAllCategories_ShouldReturnListOfCategories() throws Exception {
        mockMvc.perform(get("/category"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Test Category"));
    }

    @Test
    @WithMockUser
    void deleteCategory_ShouldReturnNoContent() throws Exception {
        doNothing().when(categoryService).deleteCategory(1L);

        mockMvc.perform(delete("/category/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void getUsersForGlobalCategory_ShouldReturnUsers() throws Exception {
        mockMvc.perform(get("/category/1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("user"))
                .andExpect(jsonPath("$[0].email").value("testuser@example.com"));
    }

    @Test
    @WithMockUser
    void addGlobalCategoryToBudget_ShouldReturnSuccessMessage() throws Exception {
        doNothing().when(categoryService).addGlobalCategoryToBudget(eq(1L), any(String.class));

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("categoryName", "Test Category");

        mockMvc.perform(post("/category/1/category")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().string("Category added to budget successfully"));
    }

    @Test
    @WithMockUser
    void createCategory_ShouldReturnSuccessMessage() throws Exception {
        doNothing().when(categoryService).addCategory(any(CategoryDTO.class));

        mockMvc.perform(post("/category")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockCategory)))
                .andExpect(status().isOk())
                .andExpect(content().string("Category created successfully"));
    }

    @Test
    @WithMockUser
    void updateCategory_ShouldReturnNoContent() throws Exception {
        doNothing().when(categoryService).updateCategory(eq(1L), any(CategoryDTO.class));

        mockMvc.perform(put("/category/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockCategory)))
                .andExpect(status().isNoContent());
    }
}