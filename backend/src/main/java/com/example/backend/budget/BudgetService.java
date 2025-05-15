package com.example.backend.budget;

import com.example.backend.auth.SecurityUtils;
import com.example.backend.category.BudgetCategoryDTO;
import com.example.backend.category.Category;
import com.example.backend.category.CategoryRepository;
import com.example.backend.category.CategorySpentDTO;
import com.example.backend.email.EmailSender;
import com.example.backend.email.EmailTemplate;
import com.example.backend.transaction.Transaction;
import com.example.backend.users.UserRepository;
import com.example.backend.users.Users;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final EmailTemplate emailTemplate;
    private final EmailSender emailSender;
    private final CategoryRepository categoryRepository;
    private final String backendUrl;

    public BudgetService(BudgetRepository budgetRepository, UserRepository userRepository, EmailTemplate emailTemplate,
                         EmailSender emailSender, CategoryRepository categoryRepository,
                         @Value("${APP_BACKEND_URL}") String backendUrl) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.emailTemplate = emailTemplate;
        this.emailSender = emailSender;
        this.categoryRepository = categoryRepository;
        this.backendUrl = backendUrl;  // Store the injected backend URL
    }

    public void addBudget(BudgetDTO budgetDTO) {
        Long userId = SecurityUtils.getAuthenticatedUserId();
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (budgetDTO.categories() == null || budgetDTO.categories().isEmpty()) {
            throw new IllegalArgumentException("At least one category must be provided for the budget");
        }
        List<Category> categories = budgetDTO.categories().stream()
                .map(categoryDTO -> Category.builder()
                        .name(categoryDTO.categoryName())
                        .userId(userId)
                        .isGlobal(false)
                        .transactions(List.of())
                        .build())
                .toList();

        categoryRepository.saveAll(categories);

        Budget budget = Budget.builder()
                .name(budgetDTO.name())
                .totalAmount(budgetDTO.totalAmount())
                .shared(true)
                .startDate(budgetDTO.startDate())
                .endDate(budgetDTO.endDate())
                .members(List.of(user))
                .categories(categories)
                .build();

        budgetRepository.save(budget);
    }

    public BigDecimal calculateTotalSpentAmountInBudget(Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        return budget.getCategories().stream()
                .flatMap(category -> category.getTransactions().stream()) // Flatten all transactions
                .map(Transaction::getAmount) // Extract the amount
                .reduce(BigDecimal.ZERO, BigDecimal::add); // Sum up the amounts
    }
    public Budget getBudget(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
    }

    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }

    public void updateBudget(Long id, BudgetDTO budgetDTO) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        budget.setName(budgetDTO.name());
        budget.setTotalAmount(budgetDTO.totalAmount());
        budget.setShared(budgetDTO.shared());
        budget.setStartDate(budgetDTO.startDate());
        budget.setEndDate(budgetDTO.endDate());

        budgetRepository.save(budget);
    }
    public List<BudgetDTO> getAllBudgets() {
        Long userId = SecurityUtils.getAuthenticatedUserId();
        return budgetRepository.findByMembersId(userId)
                .stream()
                .map(budget -> new BudgetDTO(
                        budget.getId(),
                        budget.getName(),
                        budget.getTotalAmount(),
                        budget.getCategories().stream()
                                .map(category -> new BudgetCategoryDTO(
                                        category.getId(),
                                        category.getName(),
                                        category.getTransactions() != null
                                                ? category.getTransactions().stream()
                                                .map(Transaction::getId)
                                                .collect(Collectors.toList())
                                                : List.of()
                                ))
                                .toList(),
                        budget.isShared(),
                        budget.getMembers().stream()
                                .map(member -> new MemberDTO(
                                        member.getEmail(),
                                        member.getId(),
                                        member.getKasutajanimi()
                                ))
                                .toList(),
                        budget.getStartDate(),
                        budget.getEndDate()
                ))
                .toList();
    }
    @Transactional
    public void addCategoryToBudget(Long budgetId, String categoryName) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        Long userId = SecurityUtils.getAuthenticatedUserId();

        Category category = Category.builder()
                .name(categoryName)
                .userId(userId)
                .isGlobal(true)
                .build();

        categoryRepository.save(category);
        budget.addCategory(category);
        budgetRepository.save(budget);
    }

    @Transactional
    public void inviteMember(Long budgetId, String inviteeEmail) {
        String inviterEmail = SecurityUtils.getAuthenticatedEmail();
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        Users inviter = userRepository.findByEmail(inviterEmail);

        String joinLink = backendUrl +"/budget/" + budgetId + "/accept-invite?email=" + inviteeEmail;

        String emailContent = emailTemplate.buildInviteEmail(inviter.getKasutajanimi(), budget.getName(), joinLink);

        emailSender.send(inviteeEmail, emailContent, "Kutse liituda eelarvega: " + budget.getName());
    }

    @Transactional
    public void acceptInvite(Long budgetId, String email) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        Users user = userRepository.findByEmail(email);
        budget.addMember(user);
        budgetRepository.save(budget);

        new BudgetDTO(
                budget.getId(),
                budget.getName(),
                budget.getTotalAmount(),
                budget.getCategories().stream()
                        .map(category -> new BudgetCategoryDTO(
                                category.getId(),
                                category.getName(), // Only include categoryName
                                category.getTransactions() != null
                                        ? category.getTransactions().stream()
                                        .map(Transaction::getId)
                                        .collect(Collectors.toList()) // Collect as List<Long>
                                        : List.of() // Only include transactionIds
                        ))
                        .toList(),
                budget.isShared(),
                budget.getMembers().stream()
                        .map(member -> new MemberDTO(member.getEmail(), member.getId(), member.getKasutajanimi()))
                        .toList(),
                budget.getStartDate(),
                budget.getEndDate()
        );
    }
    public void removeMember(Long budgetId, Long userId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
        Users userToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        budget.removeMember(userToRemove);
        budgetRepository.save(budget);
    }

    @Transactional
    public List<CategorySpentDTO> getSpentAmountByCategoryForBudget(Long budgetId) {
        Budget budget = getBudget(budgetId); // Fetch the budget
        return budget.getCategories().stream()
                .map(category -> {
                    BigDecimal totalSpent = category.getTransactions().stream()
                            .map(Transaction::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new CategorySpentDTO(category.getName(), totalSpent);
                })
                .collect(Collectors.toList());
    }

    public void removeCategoryFromBudget(Long budgetId, Long categoryId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
        Category categoryToRemove = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        budget.removeCategory(categoryToRemove);
        budgetRepository.save(budget);
    }
}