package com.example.backend.unitTests.groupingrules;

import com.example.backend.auth.SecurityUtils;
import com.example.backend.category.Category;
import com.example.backend.category.CategoryRepository;
import com.example.backend.groupingrules.GroupingRules;
import com.example.backend.groupingrules.GroupingRulesDTO;
import com.example.backend.groupingrules.GroupingRulesRepository;
import com.example.backend.groupingrules.GroupingRulesService;
import com.example.backend.users.UserRepository;
import com.example.backend.users.Users;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GroupingRulesServiceTests {

    @Mock
    private GroupingRulesRepository groupingRulesRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private GroupingRulesService groupingRulesService;

    private GroupingRules testGroupingRule;
    private GroupingRulesDTO testGroupingRuleDTO;
    private Users testUser;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testUser = Users.builder()
                .id(1L)
                .email("test@example.com")
                .build();

        testCategory = Category.builder()
                .id(1L)
                .name("Test Category")
                .build();

        testGroupingRule = GroupingRules.builder()
                .id(1L)
                .criterion("Test Criterion")
                .user(testUser)
                .category(testCategory)
                .isActive(true)
                .build();

        testGroupingRuleDTO = new GroupingRulesDTO(
                1L,
                "Test Criterion",
                "Test Category",
                true
        );
    }

    @Test
    void addGroupingRule_ShouldSaveGroupingRule() {
        // Arrange
        when(securityUtils.getAuthenticatedUserId()).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(categoryRepository.findByName("Test Category")).thenReturn(Optional.of(testCategory));

        // Act
        groupingRulesService.addGroupingRule(testGroupingRuleDTO);

        // Assert
        verify(groupingRulesRepository).save(any(GroupingRules.class));
    }

    @Test
    void deleteGroupingRule_ShouldDeleteGroupingRule() {
        // Act
        groupingRulesService.deleteGroupingRule(1L);

        // Assert
        verify(groupingRulesRepository).deleteById(1L);
    }

    @Test
    void updateGroupingRule_ShouldUpdateAndSaveGroupingRule() {
        // Arrange
        when(groupingRulesRepository.findById(1L)).thenReturn(Optional.of(testGroupingRule));

        GroupingRulesDTO updatedDTO = new GroupingRulesDTO(
                1L,
                "Updated Criterion",
                "Test Category",
                false
        );

        // Act
        groupingRulesService.updateGroupingRule(1L, updatedDTO);

        // Assert
        verify(groupingRulesRepository).save(testGroupingRule);
        assertEquals("Updated Criterion", testGroupingRule.getCriterion());
        assertFalse(testGroupingRule.getIsActive());
    }

    @Test
    void getAllGroupingRules_ShouldReturnListOfGroupingRulesDTO() {
        // Arrange
        when(groupingRulesRepository.findAll()).thenReturn(List.of(testGroupingRule));

        // Act
        List<GroupingRulesDTO> result = groupingRulesService.getAllGroupingRules();

        // Assert
        assertEquals(1, result.size());
        assertEquals(testGroupingRuleDTO.criterion(), result.get(0).criterion());
        assertEquals(testGroupingRuleDTO.categoryName(), result.get(0).categoryName());
    }
}