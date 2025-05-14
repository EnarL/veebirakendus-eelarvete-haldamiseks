package com.example.backend.unitTests.transaction;

import com.example.backend.auth.SecurityUtils;
import com.example.backend.category.Category;
import com.example.backend.category.CategoryRepository;
import com.example.backend.groupingrules.GroupingRulesRepository;
import com.example.backend.transaction.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTests {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SecurityUtils securityUtils;

    @Mock
    private GroupingRulesRepository groupingRulesRepository;

    @InjectMocks
    private TransactionService transactionService;

    private Transaction testTransaction;
    private TransactionDTO testTransactionDTO;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = Category.builder()
                .id(1L)
                .name("Test Category")
                .build();

        testTransaction = Transaction.builder()
                .id(1L)
                .userId(1L)
                .transactionType(TransactionType.EXPENSE)
                .amount(new BigDecimal("100.00"))
                .transactionDate(LocalDate.now())
                .category(testCategory)
                .description("Test Transaction")
                .build();

        testTransactionDTO = new TransactionDTO(
                1L,
                TransactionType.EXPENSE,
                new BigDecimal("100.00"),
                LocalDate.now(),
                "Test Category",
                "Test Transaction"
        );
    }

    @Test
    void addTransaction_ShouldSaveAndReturnTransactionDTO() {
        // Arrange
        when(categoryRepository.findByName("Test Category")).thenReturn(Optional.of(testCategory));
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);

        // Act
        TransactionDTO result = transactionService.addTransaction(testTransactionDTO);

        // Assert
        assertEquals(testTransactionDTO.amount(), result.amount());
        assertEquals(testTransactionDTO.categoryName(), result.categoryName());
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void deleteTransaction_ShouldCallRepositoryDelete() {
        // Act
        transactionService.deleteTransaction(1L);

        // Assert
        verify(transactionRepository).deleteById(1L);
    }

    @Test
    void updateTransaction_ShouldUpdateAndSaveTransaction() {
        // Arrange
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(testTransaction));
        when(categoryRepository.findByName("Updated Category")).thenReturn(Optional.of(testCategory));

        TransactionDTO updatedDTO = new TransactionDTO(
                1L,
                TransactionType.INCOME,
                new BigDecimal("200.00"),
                LocalDate.now(),
                "Updated Category",
                "Updated Description"
        );

        // Act
        transactionService.updateTransaction(1L, updatedDTO);

        // Assert
        verify(transactionRepository).save(testTransaction);
        assertEquals("Updated Description", testTransaction.getDescription());
        assertEquals(new BigDecimal("200.00"), testTransaction.getAmount());
    }

    @Test
    void getAllUserTransactions_ShouldReturnListOfTransactionDTOs() {
        // Arrange
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(transactionRepository.findAll()).thenReturn(List.of(testTransaction));

        // Act
        List<TransactionDTO> result = transactionService.getAllUserTransactions();

        // Assert
        assertEquals(1, result.size());
        assertEquals(testTransactionDTO.description(), result.get(0).description());
    }

    @Test
    void getAllUserExpenses_ShouldReturnListOfExpenseTransactionDTOs() {
        // Arrange
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(transactionRepository.findAll()).thenReturn(List.of(testTransaction));

        // Act
        List<TransactionDTO> result = transactionService.getAllUserExpenses();

        // Assert
        assertEquals(1, result.size());
        assertEquals(TransactionType.EXPENSE, result.get(0).transactionType());
    }

    @Test
    void getAllUserIncomes_ShouldReturnListOfIncomeTransactionDTOs() {
        // Arrange
        Transaction incomeTransaction = Transaction.builder()
                .id(2L)
                .userId(1L)
                .transactionType(TransactionType.INCOME)
                .amount(new BigDecimal("500.00"))
                .transactionDate(LocalDate.now())
                .category(testCategory)
                .description("Income Transaction")
                .build();

        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(transactionRepository.findAll()).thenReturn(List.of(incomeTransaction));

        // Act
        List<TransactionDTO> result = transactionService.getAllUserIncomes();

        // Assert
        assertEquals(1, result.size());
        assertEquals(TransactionType.INCOME, result.get(0).transactionType());
    }
}