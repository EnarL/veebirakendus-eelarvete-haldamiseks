package com.example.backend.unitTests.category;

import com.example.backend.auth.SecurityUtils;
import com.example.backend.budget.Budget;
import com.example.backend.budget.BudgetRepository;
import com.example.backend.category.*;
import com.example.backend.transaction.Transaction;
import com.example.backend.transaction.TransactionRepository;
import com.example.backend.users.Users;
import com.example.backend.users.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTests {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private CategoryService categoryService;

    private Users testUser;
    private Category testCategory;
    private Transaction testTransaction;
    private Budget testBudget;

    @BeforeEach
    void setUp() {
        testUser = Users.builder()
                .id(1L)
                .email("test@example.com")
                .kasutajanimi("TestUser")
                .build();

        testTransaction = Transaction.builder()
                .id(1L)
                .amount(new BigDecimal("50.00"))
                .description("Test Transaction")
                .build();

        testCategory = Category.builder()
                .id(1L)
                .name("Test Category")
                .userId(1L)
                .isGlobal(false)
                .transactions(List.of(testTransaction))
                .build();

        // Create a mutable list for categories
        List<Category> mutableCategories = new ArrayList<>();
        mutableCategories.add(testCategory);

        testBudget = Budget.builder()
                .id(1L)
                .name("Test Budget")
                .categories(mutableCategories) // Use mutable list
                .members(new ArrayList<>(List.of(testUser))) // Ensure members list is mutable
                .build();
    }

    @Test
    void addCategory_ShouldSaveCategory() {
        // Arrange
        CategoryDTO categoryDTO = new CategoryDTO(
                null, "Test Category", 1L, false, List.of(1L)
        );
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(categoryRepository.findByNameAndUserId("test category", 1L)).thenReturn(Optional.empty());
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(testTransaction));

        // Act
        categoryService.addCategory(categoryDTO);

        // Assert
        ArgumentCaptor<Category> categoryCaptor = ArgumentCaptor.forClass(Category.class);
        verify(categoryRepository).save(categoryCaptor.capture());
        Category savedCategory = categoryCaptor.getValue();

        assertEquals("test category", savedCategory.getName());
        assertEquals(1L, savedCategory.getUserId());
        assertFalse(savedCategory.isGlobal());
        assertEquals(1, savedCategory.getTransactions().size());
    }

    @Test
    void getCategory_ShouldReturnCategoryDTO() {
        // Arrange
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));

        // Act
        CategoryDTO result = categoryService.getCategory(1L);

        // Assert
        assertEquals("Test Category", result.name());
        assertEquals(1L, result.userId());
        assertFalse(result.isGlobal());
        assertEquals(1, result.transactionIds().size());
    }

    @Test
    void addGlobalCategoryToBudget_ShouldAddCategory() {
        // Arrange
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));
        when(categoryRepository.findByName("Global Category")).thenReturn(Optional.empty());

        // Act
        categoryService.addGlobalCategoryToBudget(1L, "Global Category");

        // Assert
        verify(categoryRepository).save(any(Category.class));
        verify(budgetRepository).save(testBudget);
    }

    @Test
    void deleteCategory_ShouldDeleteCategory() {
        // Act
        categoryService.deleteCategory(1L);

        // Assert
        verify(categoryRepository).deleteById(1L);
    }

    @Test
    void updateCategory_ShouldUpdateCategory() {
        // Arrange
        CategoryDTO categoryDTO = new CategoryDTO(
                1L, "Updated Category", 1L, true, List.of(1L)
        );
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(testTransaction));

        // Act
        categoryService.updateCategory(1L, categoryDTO);

        // Assert
        verify(categoryRepository).save(testCategory);
        assertEquals("Updated Category", testCategory.getName());
        assertTrue(testCategory.isGlobal());
    }

    @Test
    void getAllCategories_ShouldReturnCategories() {
        // Arrange
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(categoryRepository.findByUserId(1L)).thenReturn(List.of(testCategory));
        when(budgetRepository.findByMembersId(1L)).thenReturn(List.of(testBudget));

        // Act
        List<CategoryDTO> result = categoryService.getAllCategories();

        // Assert
        assertEquals(1, result.size());
        assertEquals("Test Category", result.get(0).name());
    }
}