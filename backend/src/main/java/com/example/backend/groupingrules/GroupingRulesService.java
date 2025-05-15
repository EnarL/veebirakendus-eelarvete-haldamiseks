package com.example.backend.groupingrules;

import com.example.backend.auth.SecurityUtils;
import com.example.backend.category.Category;
import com.example.backend.category.CategoryRepository;
import com.example.backend.users.UserRepository;
import com.example.backend.users.Users;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupingRulesService {

    private final GroupingRulesRepository groupingRulesRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public GroupingRulesService(GroupingRulesRepository groupingRulesRepository,
                                UserRepository userRepository,
                                CategoryRepository categoryRepository) {
        this.groupingRulesRepository = groupingRulesRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public void addGroupingRule(GroupingRulesDTO groupingRulesDTO) {
        Long userId = SecurityUtils.getAuthenticatedUserId();

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findByName(groupingRulesDTO.categoryName())
                .orElseGet(() -> {
                    Category newCategory = new Category();
                    newCategory.setUserId(userId);
                    newCategory.setName(groupingRulesDTO.categoryName());
                    return categoryRepository.save(newCategory);
                });

        GroupingRules groupingRule = GroupingRules.builder()
                .criterion(groupingRulesDTO.criterion())
                .user(user)
                .category(category)
                .isActive(true)
                .build();

        groupingRulesRepository.save(groupingRule);
    }

    public void deleteGroupingRule(Long id) {
        groupingRulesRepository.deleteById(id);
    }

    public void updateGroupingRule(Long id, GroupingRulesDTO groupingRulesDTO) {
        GroupingRules groupingRule = groupingRulesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grouping rule not found"));

        groupingRule.setCriterion(groupingRulesDTO.criterion());
        groupingRule.setIsActive(groupingRulesDTO.isActive());

        groupingRulesRepository.save(groupingRule);
    }

    public List<GroupingRulesDTO> getAllGroupingRules() {
        List<GroupingRules> groupingRules = groupingRulesRepository.findAll();
        return groupingRules.stream()
                .map(rule -> new GroupingRulesDTO(
                        rule.getId(),
                        rule.getCriterion(),
                        rule.getCategory().getName(),
                        rule.getIsActive()
                ))
                .collect(Collectors.toList());
    }
}