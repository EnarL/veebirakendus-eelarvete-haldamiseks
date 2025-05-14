package com.example.backend.integrationTests.goal;

import com.example.backend.goal.GoalDTO;
import com.example.backend.goal.GoalService;
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
public class GoalControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private GoalService goalService;

    private GoalDTO mockGoalDTO;
    private List<GoalDTO> mockGoalList;

    @BeforeEach
    void setup() {

        mockGoalDTO = new GoalDTO(
                1L,
                "Vacation Fund",
                new BigDecimal("1500.00"),
                new BigDecimal("5000.00"),
                LocalDate.now().plusMonths(6)
        );

        // Create a list of mock goals
        mockGoalList = List.of(
                mockGoalDTO,
                new GoalDTO(
                        2L,
                        "Emergency Fund",
                        new BigDecimal("3000.00"),
                        new BigDecimal("10000.00"),
                        LocalDate.now().plusMonths(12)
                )
        );

        // Setup service mock responses
        when(goalService.getAllUserGoals()).thenReturn(mockGoalList);
        when(goalService.getGoal(1L)).thenReturn(mockGoalDTO);
        when(goalService.addGoal(any(GoalDTO.class))).thenReturn(mockGoalDTO);
        doNothing().when(goalService).updateGoal(eq(1L), any(GoalDTO.class));
        doNothing().when(goalService).deleteGoal(1L);
    }

    @Test
    @WithMockUser
    void getAllUserGoals_ShouldReturnGoalsList() throws Exception {
        mockMvc.perform(get("/goal"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Vacation Fund"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Emergency Fund"));
    }

    @Test
    @WithMockUser
    void getGoal_ShouldReturnGoal() throws Exception {
        mockMvc.perform(get("/goal/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Vacation Fund"))
                .andExpect(jsonPath("$.current").value(1500.00))
                .andExpect(jsonPath("$.target").value(5000.00));
    }

    @Test
    @WithMockUser
    void createGoal_ShouldReturnCreatedGoal() throws Exception {
        GoalDTO newGoal = new GoalDTO(
                null,
                "New Car",
                new BigDecimal("0.00"),
                new BigDecimal("20000.00"),
                LocalDate.now().plusYears(2)
        );

        mockMvc.perform(post("/goal")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newGoal)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Vacation Fund"));
    }

    @Test
    @WithMockUser
    void updateGoal_ShouldReturnNoContent() throws Exception {
        GoalDTO updatedGoal = new GoalDTO(
                1L,
                "Updated Vacation Fund",
                new BigDecimal("6000.00"),
                new BigDecimal("2000.00"),
                LocalDate.now().plusMonths(8)
        );

        mockMvc.perform(put("/goal/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedGoal)))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void deleteGoal_ShouldReturnOk() throws Exception {
        mockMvc.perform(delete("/goal/1"))
                .andExpect(status().isOk());
    }
}