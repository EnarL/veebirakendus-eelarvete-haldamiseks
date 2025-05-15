package com.example.backend.groupingrules;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface GroupingRulesRepository extends JpaRepository<GroupingRules, Long> {
    List<GroupingRules> findByUserIdAndIsActive(Long userId, boolean b);
}
