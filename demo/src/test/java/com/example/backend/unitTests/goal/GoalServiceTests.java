package com.example.backend.unitTests.goal;

import com.example.backend.auth.SecurityUtils;
import com.example.backend.goal.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GoalServiceTests {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private GoalService goalService;

    private Goal testGoal;
    private GoalDTO testGoalDTO;

    @BeforeEach
    void setUp() {
        testGoal = Goal.builder()
                .id(1L)
                .name("Save for Vacation")
                .userId(1L)
                .current(new BigDecimal("500.00"))
                .target(new BigDecimal("2000.00"))
                .deadline(LocalDate.now().plusMonths(6))
                .build();

        testGoalDTO = new GoalDTO(
                1L,
                "Save for Vacation",
                new BigDecimal("500.00"),
                new BigDecimal("2000.00"),
                LocalDate.now().plusMonths(6)
        );
    }

    @Test
    void addGoal_ShouldSaveAndReturnGoalDTO() {
        // Arrange
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(goalRepository.save(any(Goal.class))).thenReturn(testGoal);

        // Act
        GoalDTO result = goalService.addGoal(testGoalDTO);

        // Assert
        assertEquals(testGoalDTO.name(), result.name());
        assertEquals(testGoalDTO.target(), result.target());
        verify(goalRepository).save(any(Goal.class));
    }

    @Test
    void getGoal_ShouldReturnGoalDTO() {
        // Arrange
        when(goalRepository.findById(1L)).thenReturn(Optional.of(testGoal));

        // Act
        GoalDTO result = goalService.getGoal(1L);

        // Assert
        assertEquals(testGoalDTO.name(), result.name());
        assertEquals(testGoalDTO.target(), result.target());
    }

    @Test
    void getGoal_ShouldThrowExceptionWhenNotFound() {
        // Arrange
        when(goalRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> goalService.getGoal(1L));
    }

    @Test
    void deleteGoal_ShouldCallRepositoryDelete() {
        // Act
        goalService.deleteGoal(1L);

        // Assert
        verify(goalRepository).deleteById(1L);
    }

    @Test
    void updateGoal_ShouldUpdateAndSaveGoal() {
        // Arrange
        when(goalRepository.findById(1L)).thenReturn(Optional.of(testGoal));

        GoalDTO updatedGoalDTO = new GoalDTO(
                1L,
                "Updated Goal",
                new BigDecimal("600.00"),
                new BigDecimal("2500.00"),
                LocalDate.now().plusMonths(8)
        );

        // Act
        goalService.updateGoal(1L, updatedGoalDTO);

        // Assert
        verify(goalRepository).save(testGoal);
        assertEquals("Updated Goal", testGoal.getName());
        assertEquals(new BigDecimal("600.00"), testGoal.getCurrent());
        assertEquals(new BigDecimal("2500.00"), testGoal.getTarget());
    }

}