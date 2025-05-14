package com.example.backend.category;

import com.example.backend.users.UsersDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategory(id));
    }
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories(){
      return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{categoryId}/users")
    public ResponseEntity<List<UsersDTO>> getUsersForGlobalCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(categoryService.getUsersForGlobalCategory(categoryId));
    }


    @PostMapping("/{budgetId}/category")
    public ResponseEntity<?> addGlobalCategoryToBudget(@PathVariable Long budgetId, @RequestBody Map<String, String> request) {
        String categoryName = request.get("categoryName");
        categoryService.addGlobalCategoryToBudget(budgetId, categoryName);
        return ResponseEntity.ok("Category added to budget successfully");
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryDTO categoryDTO) {
        categoryService.addCategory(categoryDTO);
        return ResponseEntity.ok("Category created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
        categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.noContent().build();
    }
}