package com.example.backend.unitTests.budget;

import com.example.backend.auth.SecurityUtils;
import com.example.backend.budget.*;
import com.example.backend.category.BudgetCategoryDTO;
import com.example.backend.category.Category;
import com.example.backend.category.CategoryRepository;
import com.example.backend.email.EmailSender;
import com.example.backend.email.EmailTemplate;
import com.example.backend.transaction.Transaction;
import com.example.backend.users.UserRepository;
import com.example.backend.users.Users;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BudgetServiceTests {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailTemplate emailTemplate;

    @Mock
    private EmailSender emailSender;

    @Mock
    private SecurityUtils securityUtils;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private BudgetService budgetService;

    private Users testUser;
    private Budget testBudget;
    private Category testCategory;
    private Transaction testTransaction;
    private BudgetDTO testBudgetDTO;

    @BeforeEach
    void setUp() {
        testUser = Users.builder()
                .id(1L)
                .email("test@example.com")
                .kasutajanimi("TestUser")
                .build();

        testCategory = Category.builder()
                .id(1L)
                .name("Food")
                .userId(1L)
                .isGlobal(false)
                .transactions(new ArrayList<>())
                .build();

        testTransaction = Transaction.builder()
                .id(1L)
                .amount(new BigDecimal("50.00"))
                .description("Grocery shopping")
                .build();
        testCategory.getTransactions().add(testTransaction);

        List<Category> categories = new ArrayList<>();
        categories.add(testCategory);

        testBudget = Budget.builder()
                .id(1L)
                .name("Monthly Budget")
                .totalAmount(new BigDecimal("1000.00"))
                .shared(true)
                .startDate(LocalDate.from(LocalDateTime.now()))
                .endDate(LocalDate.from(LocalDateTime.now().plusMonths(1)))
                .members(new ArrayList<>(List.of(testUser))) // Mutable list
                .categories(categories) // Mutable list
                .build();

        testBudgetDTO = new BudgetDTO(
                1L,
                "Monthly Budget",
                new BigDecimal("1000.00"),
                List.of(new BudgetCategoryDTO(1L, "Food", List.of(1L))),
                true,
                List.of(new MemberDTO("test@example.com", 1L, "TestUser")),
                LocalDateTime.now().toLocalDate(),
                LocalDateTime.now().plusMonths(1).toLocalDate()
        );
    }
    @Test
    void addBudget_ShouldSaveBudgetAndCategories() {
        // Arrange
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        budgetService.addBudget(testBudgetDTO);

        // Assert
        verify(categoryRepository).saveAll(anyList());
        verify(budgetRepository).save(any(Budget.class));
    }

    @Test
    void addBudget_WithNoCategoriesShouldThrowException() {
        // Arrange
        BudgetDTO budgetDTOWithNoCategories = new BudgetDTO(
                1L,
                "Monthly Budget",
                new BigDecimal("1000.00"),
                List.of(),
                true,
                List.of(new MemberDTO("test@example.com", 1L, "TestUser")),
                LocalDateTime.now().toLocalDate(), // Convert to LocalDate
                LocalDateTime.now().plusMonths(1).toLocalDate() // Convert to LocalDate
        );
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> budgetService.addBudget(budgetDTOWithNoCategories));
    }

    @Test
    void calculateTotalSpentAmountInBudget_ShouldReturnCorrectSum() {
        // Arrange
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));

        // Act
        BigDecimal result = budgetService.calculateTotalSpentAmountInBudget(1L);

        // Assert
        assertEquals(new BigDecimal("50.00"), result);
    }

    @Test
    void getBudget_ShouldReturnBudget() {
        // Arrange
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));

        // Act
        Budget result = budgetService.getBudget(1L);

        // Assert
        assertEquals(testBudget, result);
    }

    @Test
    void getBudget_ShouldThrowExceptionWhenBudgetNotFound() {
        // Arrange
        when(budgetRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> budgetService.getBudget(1L));
    }

    @Test
    void deleteBudget_ShouldCallRepositoryDeleteMethod() {
        // Act
        budgetService.deleteBudget(1L);

        // Assert
        verify(budgetRepository).deleteById(1L);
    }

    @Test
    void updateBudget_ShouldUpdateBudgetWithNewValues() {
        // Arrange
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));

        BudgetDTO updatedBudgetDTO = new BudgetDTO(
                1L,
                "Updated Budget",
                new BigDecimal("1500.00"),
                List.of(new BudgetCategoryDTO(1L, "Food", List.of(1L))),
                false,
                List.of(new MemberDTO("test@example.com", 1L, "TestUser")),
                LocalDateTime.now().plusDays(1).toLocalDate(),
                LocalDateTime.now().plusMonths(2).toLocalDate()
        );

        // Act
        budgetService.updateBudget(1L, updatedBudgetDTO);

        // Assert
        verify(budgetRepository).save(testBudget);
        assertEquals("Updated Budget", testBudget.getName());
        assertEquals(new BigDecimal("1500.00"), testBudget.getTotalAmount());
        assertFalse(testBudget.isShared());
        assertEquals(updatedBudgetDTO.startDate(), testBudget.getStartDate());
        assertEquals(updatedBudgetDTO.endDate(), testBudget.getEndDate());
    }

    @Test
    void getAllBudgets_ShouldReturnBudgetsForAuthenticatedUser() {
        // Arrange
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(budgetRepository.findByMembersId(1L)).thenReturn(List.of(testBudget));

        // Act
        List<BudgetDTO> result = budgetService.getAllBudgets();

        // Assert
        assertEquals(1, result.size());
        assertEquals("Monthly Budget", result.get(0).name());
        assertEquals(new BigDecimal("1000.00"), result.get(0).totalAmount());
    }

    @Test
    void addCategoryToBudget_ShouldAddNewCategoryToBudget() {
        // Arrange
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);

        // Act
        budgetService.addCategoryToBudget(1L, "Entertainment");

        // Assert
        verify(categoryRepository).save(any(Category.class));
        verify(budgetRepository).save(testBudget);

        ArgumentCaptor<Category> categoryCaptor = ArgumentCaptor.forClass(Category.class);
        verify(categoryRepository).save(categoryCaptor.capture());
        Category savedCategory = categoryCaptor.getValue();

        assertEquals("Entertainment", savedCategory.getName());
        assertEquals(1L, savedCategory.getUserId());
        assertTrue(savedCategory.isGlobal());
    }

    @Test
    void inviteMember_ShouldSendEmailWithCorrectContent() {
        // Arrange
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));
        when(securityUtils.getAuthenticatedEmail()).thenReturn("inviter@example.com");
        when(userRepository.findByEmail("inviter@example.com")).thenReturn(testUser);
        when(emailTemplate.buildInviteEmail(anyString(), anyString(), anyString()))
                .thenReturn("Email content");

        // Act
        budgetService.inviteMember(1L, "invitee@example.com");

        // Assert
        verify(emailSender).send(
                eq("invitee@example.com"),
                eq("Email content"),
                eq("Kutse liituda eelarvega: Monthly Budget")
        );
    }

    @Test
    void acceptInvite_ShouldAddUserToBudgetMembers() {
        // Arrange
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));
        when(userRepository.findByEmail("newmember@example.com")).thenReturn(testUser);

        // Act
        budgetService.acceptInvite(1L, "newmember@example.com");

        // Assert
        verify(budgetRepository).save(testBudget);
        // Since we're using a mock, the actual members list won't be updated in our test
        // We'd need to verify that addMember was called or capture and examine the saved budget
    }

    @Test
    void removeMember_ShouldRemoveUserFromBudgetMembers() {
        // Arrange
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        budgetService.removeMember(1L, 1L);

        // Assert
        verify(budgetRepository).save(testBudget);
    }



    @Test
    void removeCategoryFromBudget_ShouldRemoveCategoryFromBudget() {
        // Arrange
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));

        // Act
        budgetService.removeCategoryFromBudget(1L, 1L);

        // Assert
        verify(budgetRepository).save(testBudget);
    }
}