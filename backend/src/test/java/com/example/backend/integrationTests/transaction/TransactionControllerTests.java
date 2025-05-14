package com.example.backend.integrationTests.transaction;

import com.example.backend.transaction.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
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
public class TransactionControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TransactionService transactionService;

    private TransactionDTO mockExpenseTransaction;
    private TransactionDTO mockIncomeTransaction;
    private List<TransactionDTO> mockTransactionList;
    private List<MonthlyIncomeDTO> mockMonthlyIncomeList;
    private List<MonthlyExpenseDTO> mockMonthlyExpenseList;
    private List<MonthlySummaryDTO> mockMonthlySummaryList;

    @BeforeEach
    void setup() throws Exception {
        // Create mock transactions
        mockExpenseTransaction = new TransactionDTO(
                1L,
                TransactionType.EXPENSE,
                new BigDecimal("85.75"),
                LocalDate.of(2025, 5, 10),
                "Groceries",
                "Grocery Shopping"
        );

        mockIncomeTransaction = new TransactionDTO(
                2L,
                TransactionType.INCOME,
                new BigDecimal("3000.00"),
                LocalDate.of(2025, 5, 1),
                "Salary",
                "Monthly Salary"
        );

        // Create a list of mock transactions
        mockTransactionList = List.of(mockExpenseTransaction, mockIncomeTransaction);

        // Create mock monthly income data
        mockMonthlyIncomeList = List.of(
                new MonthlyIncomeDTO(
                        5, // Just the month number (May)
                        new BigDecimal("3000.00")
                ),
                new MonthlyIncomeDTO(
                        4, // Just the month number (April)
                        new BigDecimal("2950.00")
                )
        );

        // Create mock monthly expense data
        mockMonthlyExpenseList = List.of(
                new MonthlyExpenseDTO(
                        5, // Just the month number (May)
                        new BigDecimal("1500.00")
                ),
                new MonthlyExpenseDTO(
                        4, // Just the month number (April)
                        new BigDecimal("1600.00")
                )
        );

        // Create mock monthly summary data
        mockMonthlySummaryList = List.of(
                new MonthlySummaryDTO(
                        5, // Just the month number (May)
                        new BigDecimal("3000.00"),
                        new BigDecimal("1500.00")
                ),
                new MonthlySummaryDTO(
                        4, // Just the month number (April)
                        new BigDecimal("2950.00"),
                        new BigDecimal("1600.00")
                )
        );

        // Setup service mock responses
        when(transactionService.getAllUserTransactions()).thenReturn(mockTransactionList);
        when(transactionService.getAllUserExpenses()).thenReturn(List.of(mockExpenseTransaction));
        when(transactionService.getAllUserIncomes()).thenReturn(List.of(mockIncomeTransaction));
        when(transactionService.getAllUserIncomesByMonth()).thenReturn(mockMonthlyIncomeList);
        when(transactionService.getAllUserExpensesByMonth()).thenReturn(mockMonthlyExpenseList);
        when(transactionService.getAllUserMonthlySummary()).thenReturn(mockMonthlySummaryList);
        when(transactionService.addTransaction(any(TransactionDTO.class))).thenReturn(mockExpenseTransaction);
        doNothing().when(transactionService).updateTransaction(eq(1L), any(TransactionDTO.class));
        doNothing().when(transactionService).deleteTransaction(1L);
        doNothing().when(transactionService).importTransactionsFromCsv(any());
    }

    @Test
    @WithMockUser
    void getAllUserTransactions_ShouldReturnTransactionsList() throws Exception {
        mockMvc.perform(get("/transaction"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].description").value("Grocery Shopping"))
                .andExpect(jsonPath("$[0].amount").value(85.75))
                .andExpect(jsonPath("$[0].transactionType").value("EXPENSE"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].description").value("Monthly Salary"))
                .andExpect(jsonPath("$[1].transactionType").value("INCOME"));
    }

    @Test
    @WithMockUser
    void getAllUserExpenses_ShouldReturnExpensesList() throws Exception {
        mockMvc.perform(get("/transaction/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].description").value("Grocery Shopping"))
                .andExpect(jsonPath("$[0].transactionType").value("EXPENSE"));
    }

    @Test
    @WithMockUser
    void getAllUserIncomes_ShouldReturnIncomesList() throws Exception {
        mockMvc.perform(get("/transaction/incomes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(2))
                .andExpect(jsonPath("$[0].description").value("Monthly Salary"))
                .andExpect(jsonPath("$[0].transactionType").value("INCOME"));
    }

    @Test
    @WithMockUser
    void getAllUserIncomesByMonth_ShouldReturnMonthlyIncomesList() throws Exception {
        mockMvc.perform(get("/transaction/incomesByMonth"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].month").value(5))
                .andExpect(jsonPath("$[0].totalIncome").value(3000.00))
                .andExpect(jsonPath("$[1].month").value(4))
                .andExpect(jsonPath("$[1].totalIncome").value(2950.00));
    }

    @Test
    @WithMockUser
    void getAllUserExpensesByMonth_ShouldReturnMonthlyExpensesList() throws Exception {
        mockMvc.perform(get("/transaction/expensesByMonth"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].month").value(5))
                .andExpect(jsonPath("$[0].totalExpense").value(1500.00))
                .andExpect(jsonPath("$[1].month").value(4))
                .andExpect(jsonPath("$[1].totalExpense").value(1600.00));
    }

    @Test
    @WithMockUser
    void getAllUserMonthlySummary_ShouldReturnMonthlySummaryList() throws Exception {
        mockMvc.perform(get("/transaction/monthlySummary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].month").value(5))
                .andExpect(jsonPath("$[0].totalIncome").value(3000.00))
                .andExpect(jsonPath("$[0].totalExpense").value(1500.00))
                .andExpect(jsonPath("$[1].month").value(4))
                .andExpect(jsonPath("$[1].totalIncome").value(2950.00))
                .andExpect(jsonPath("$[1].totalExpense").value(1600.00));
    }

    @Test
    @WithMockUser
    void createTransaction_ShouldReturnCreatedTransaction() throws Exception {
        TransactionDTO newTransaction = new TransactionDTO(
                null,
                TransactionType.EXPENSE,
                new BigDecimal("120.50"),
                LocalDate.of(2025, 5, 15),
                "Dining Out",
                "Restaurant dinner"
        );

        mockMvc.perform(post("/transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newTransaction)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.description").value("Grocery Shopping"))
                .andExpect(jsonPath("$.amount").value(85.75));
    }

    @Test
    @WithMockUser
    void updateTransaction_ShouldReturnNoContent() throws Exception {
        TransactionDTO updatedTransaction = new TransactionDTO(
                1L,
                TransactionType.EXPENSE,
                new BigDecimal("90.25"),
                LocalDate.of(2025, 5, 10),
                "Groceries",
                "Updated description"
        );

        mockMvc.perform(put("/transaction/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedTransaction)))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void deleteTransaction_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/transaction/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void importTransactions_ShouldReturnSuccessMessage() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "transactions.csv",
                "text/csv",
                "date,type,amount,categoryName,description\n2025-05-20,EXPENSE,100.00,Food,Restaurant".getBytes()
        );

        mockMvc.perform(multipart("/transaction/import")
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("Transactions imported successfully"));
    }
}