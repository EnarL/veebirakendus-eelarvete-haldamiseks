package com.example.backend.budget;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByMembersId(Long userId);

    List<Budget> findByCategoriesId(Long categoryId);
}
