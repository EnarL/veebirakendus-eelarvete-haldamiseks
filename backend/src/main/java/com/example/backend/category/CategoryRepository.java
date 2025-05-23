package com.example.backend.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

    Optional<Category> findByNameAndUserId(String normalizedCategoryName, Long userId);

    List<Category> findByUserId(Long userId);
}
