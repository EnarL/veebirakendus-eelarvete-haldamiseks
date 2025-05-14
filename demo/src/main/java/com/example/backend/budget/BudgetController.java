package com.example.backend.budget;

import com.example.backend.category.AddCategoryRequest;
import com.example.backend.category.CategorySpentDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/budget")
public class BudgetController {

    private final BudgetService budgetService;
    private final String frontendUrl;

    public BudgetController(BudgetService budgetService,
                            @Value("${app.url}") String frontendUrl) {
        this.budgetService = budgetService;
        this.frontendUrl = frontendUrl;
    }

    @GetMapping("/{id}")
    public Budget getBudget(@PathVariable Long id) {
        return budgetService.getBudget(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody BudgetDTO budgetDTO) {
        budgetService.addBudget(budgetDTO);
        return ResponseEntity.ok("Budget created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(@PathVariable Long id, @RequestBody BudgetDTO budgetDTO) {
        budgetService.updateBudget(id, budgetDTO);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/budgets/{budgetId}/categories")
    public ResponseEntity<Void> addCategoryToBudget(
            @PathVariable Long budgetId,
            @RequestBody AddCategoryRequest request) {
        budgetService.addCategoryToBudget(budgetId, request.getCategoryName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/budgets/{budgetId}/categories/{categoryId}")
    public ResponseEntity<Void> removeCategoryFromBudget(
            @PathVariable Long budgetId,
            @PathVariable Long categoryId) {
        budgetService.removeCategoryFromBudget(budgetId, categoryId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{budgetId}/total-spent")
    public ResponseEntity<BigDecimal> getTotalSpentAmount(@PathVariable Long budgetId) {
        BigDecimal totalSpent = budgetService.calculateTotalSpentAmountInBudget(budgetId);
        return ResponseEntity.ok(totalSpent);
    }

    @PostMapping("/{budgetId}/invite")
    public ResponseEntity<Void> inviteMember(
            @PathVariable Long budgetId,
            @RequestParam String inviteeEmail) {
        budgetService.inviteMember(budgetId, inviteeEmail);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{budgetId}/spent-by-category")
    public ResponseEntity<List<CategorySpentDTO>> getSpentAmountByCategoryForBudget(@PathVariable Long budgetId) {
        List<CategorySpentDTO> spentByCategory = budgetService.getSpentAmountByCategoryForBudget(budgetId);
        return ResponseEntity.ok(spentByCategory);
    }

    @GetMapping("/{budgetId}/accept-invite")
    public ResponseEntity<Void> acceptInvite(
            @PathVariable Long budgetId,
            @RequestParam String email) {
        budgetService.acceptInvite(budgetId, email);

        return ResponseEntity
                .status(302)
                .header("Location", frontendUrl + "/login")
                .build();
    }

    @GetMapping
    public List<BudgetDTO> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    @PostMapping("{budgetId}/remove/{userId}")
    public void removeMember(@PathVariable Long budgetId, @PathVariable Long userId) {
        budgetService.removeMember(budgetId, userId);
    }
}
