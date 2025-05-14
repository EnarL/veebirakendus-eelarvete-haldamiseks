package com.example.backend.integrationTests.budget;

import com.example.backend.budget.Budget;
import com.example.backend.budget.BudgetDTO;
import com.example.backend.budget.BudgetService;
import com.example.backend.category.AddCategoryRequest;
import com.example.backend.category.CategorySpentDTO;
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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
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
public class BudgetControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private BudgetService budgetService;

    private BudgetDTO mockBudgetDTO;

    public BudgetControllerTests(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @BeforeEach
    void setup() {
        // Setup mock budget DTO
        mockBudgetDTO = new BudgetDTO(
                1L, "Test Budget", new BigDecimal("1000.00"),
                new ArrayList<>(), false, new ArrayList<>(), null, null
        );

        // Setup mock budget entity
        Budget mockBudget = new Budget();
        mockBudget.setId(1L);
        mockBudget.setName("Test Budget");
        mockBudget.setTotalAmount(new BigDecimal("1000.00"));

        // Setup mock category spent list
        List<CategorySpentDTO> mockCategorySpentList = List.of(
                new CategorySpentDTO("Groceries", new BigDecimal("250.00")),
                new CategorySpentDTO("Utilities", new BigDecimal("150.00"))
        );

        // Configure mock service behavior
        when(budgetService.getBudget(1L)).thenReturn(mockBudget);
        when(budgetService.getAllBudgets()).thenReturn(List.of(mockBudgetDTO));
        when(budgetService.calculateTotalSpentAmountInBudget(1L)).thenReturn(new BigDecimal("400.00"));
        when(budgetService.getSpentAmountByCategoryForBudget(1L)).thenReturn(mockCategorySpentList);

        doNothing().when(budgetService).addBudget(any(BudgetDTO.class));
        doNothing().when(budgetService).updateBudget(anyLong(), any(BudgetDTO.class));
        doNothing().when(budgetService).deleteBudget(anyLong());
        doNothing().when(budgetService).addCategoryToBudget(anyLong(), anyString());
        doNothing().when(budgetService).removeCategoryFromBudget(anyLong(), anyLong());
        doNothing().when(budgetService).inviteMember(anyLong(), anyString());
        doNothing().when(budgetService).acceptInvite(anyLong(), anyString());
        doNothing().when(budgetService).removeMember(anyLong(), anyLong());
    }

    @Test
    @WithMockUser
    void createBudget_ShouldReturnSuccessMessage() throws Exception {
        mockMvc.perform(post("/budget")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockBudgetDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Budget created successfully"));
    }

    @Test
    @WithMockUser
    void getBudget_ShouldReturnBudget() throws Exception {
        mockMvc.perform(get("/budget/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Budget"));
    }

    @Test
    @WithMockUser
    void getAllBudgets_ShouldReturnListOfBudgets() throws Exception {
        mockMvc.perform(get("/budget"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Test Budget"));
    }

    @Test
    @WithMockUser
    void deleteBudget_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/budget/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void updateBudget_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(put("/budget/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockBudgetDTO)))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void addCategoryToBudget_ShouldReturnOk() throws Exception {
        AddCategoryRequest request = new AddCategoryRequest();
        request.setCategoryName("Groceries");

        mockMvc.perform(post("/budget/budgets/1/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void removeCategoryFromBudget_ShouldReturnOk() throws Exception {
        mockMvc.perform(delete("/budget/budgets/1/categories/2"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void getTotalSpentAmount_ShouldReturnAmount() throws Exception {
        mockMvc.perform(get("/budget/1/total-spent"))
                .andExpect(status().isOk())
                .andExpect(content().string("400.00"));
    }

    @Test
    @WithMockUser
    void getSpentAmountByCategory_ShouldReturnList() throws Exception {
        mockMvc.perform(get("/budget/1/spent-by-category"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryName").value("Groceries"))
                .andExpect(jsonPath("$[0].amount").value(250.00))
                .andExpect(jsonPath("$[1].categoryName").value("Utilities"))
                .andExpect(jsonPath("$[1].amount").value(150.00));
    }

    @Test
    @WithMockUser
    void inviteMember_ShouldReturnOk() throws Exception {
        mockMvc.perform(post("/budget/1/invite")
                        .param("inviteeEmail", "test@example.com"))
                .andExpect(status().isOk());
    }


    @Test
    @WithMockUser
    void removeMember_ShouldReturnOk() throws Exception {
        mockMvc.perform(post("/budget/1/remove/2"))
                .andExpect(status().isOk());
    }
}