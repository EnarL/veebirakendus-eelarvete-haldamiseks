package com.example.backend.category;

import com.example.backend.auth.SecurityUtils;
import com.example.backend.budget.Budget;
import com.example.backend.budget.BudgetRepository;
import com.example.backend.transaction.Transaction;
import com.example.backend.transaction.TransactionRepository;
import com.example.backend.users.Users;
import com.example.backend.users.UserRepository;
import com.example.backend.users.UsersDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository,
            BudgetRepository budgetRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
    }

    public void addCategory(CategoryDTO categoryDTO) {
        Long userId = SecurityUtils.getAuthenticatedUserId();
        String normalizedCategoryName = categoryDTO.name().trim().toLowerCase();
        Category existingCategory = categoryRepository.findByNameAndUserId(normalizedCategoryName, userId)
                .orElse(null);

        if (existingCategory != null) {
            throw new RuntimeException("Category with the name '" + normalizedCategoryName + "' already exists.");
        }

        List<Long> transactionIds = categoryDTO.transactionIds() != null ? categoryDTO.transactionIds() : List.of();
        List<Transaction> transactions = fetchTransactions(transactionIds);

        Category category = Category.builder()
                .name(normalizedCategoryName)
                .userId(userId)
                .isGlobal(categoryDTO.isGlobal())
                .transactions(transactions)
                .build();

        categoryRepository.save(category);
    }

    public CategoryDTO getCategory(Long id) {
        Category category = findCategoryById(id);
        return mapToCategoryDTO(category);
    }
    public List<UsersDTO> getUsersForGlobalCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.isGlobal()) {
            throw new IllegalArgumentException("Category is not global");
        }

        // Fetch all budgets associated with this category
        List<Budget> budgets = budgetRepository.findByCategoriesId(categoryId);

        // Collect all unique members from these budgets and map them to UsersDTO
        return budgets.stream()
                .flatMap(budget -> budget.getMembers().stream())
                .distinct()
                .map(user -> new UsersDTO(user.getKasutajanimi(), user.getEesnimi(), user.getPerekonnanimi(), user.getEmail())) // Map to UsersDTO
                .toList();
    }
    @Transactional
    public void addGlobalCategoryToBudget(Long budgetId, String categoryName) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        Category category = categoryRepository.findByName(categoryName)
                .orElseGet(() -> {
                    // Create a new global category if it doesn't exist
                    Category newCategory = Category.builder()
                            .name(categoryName)
                            .isGlobal(true)
                            .transactions(List.of())
                            .build();
                    return categoryRepository.save(newCategory);
                });

        budget.addCategory(category);
        budgetRepository.save(budget);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public void updateCategory(Long id, CategoryDTO categoryDTO) {
        Category category = findCategoryById(id);
        Long userId = SecurityUtils.getAuthenticatedUserId();
        List<Transaction> transactions = fetchTransactions(categoryDTO.transactionIds());

        category.setName(categoryDTO.name());
        category.setUserId(userId);
        category.setGlobal(categoryDTO.isGlobal());
        category.setTransactions(transactions);

        categoryRepository.save(category);
    }



    private Users findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    private Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    private List<Transaction> fetchTransactions(List<Long> transactionIds) {
        return transactionIds.stream()
                .map(id -> transactionRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id)))
                .collect(Collectors.toList());
    }

    private CategoryDTO mapToCategoryDTO(Category category) {
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getUserId(),
                category.isGlobal(),
                category.getTransactions().stream().map(Transaction::getId).collect(Collectors.toList())
        );
    }


    public List<CategoryDTO> getAllCategories() {
        Long userId = SecurityUtils.getAuthenticatedUserId();

        List<Category> userCategories = categoryRepository.findByUserId(userId);

        List<Category> sharedCategories = budgetRepository.findByMembersId(userId).stream()
                .flatMap(budget -> budget.getCategories().stream())
                .filter(Category::isGlobal)
                .distinct()
                .toList();

        return Stream.concat(userCategories.stream(), sharedCategories.stream())
                .distinct()
                .map(category -> new CategoryDTO(
                        category.getId(),
                        category.getName(),
                        category.getUserId(),
                        category.isGlobal(),
                        category.getTransactions().stream().map(Transaction::getId).toList()
                ))
                .toList();
    }
}