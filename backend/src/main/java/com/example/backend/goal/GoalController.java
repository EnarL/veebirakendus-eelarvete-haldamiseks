package com.example.backend.goal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goal")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<List<GoalDTO>> getAllUserGoals() {
        return ResponseEntity.ok(goalService.getAllUserGoals());
    }
    @GetMapping("/{id}")
    public GoalDTO getGoal(@PathVariable Long id) {
        return goalService.getGoal(id);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
    }

    @PostMapping
    public ResponseEntity<GoalDTO> createGoal(@RequestBody GoalDTO goalDTO) {
        GoalDTO createdGoal = goalService.addGoal(goalDTO);
        return ResponseEntity.ok(createdGoal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoal(@PathVariable Long id, @RequestBody GoalDTO goalDTO) {
        goalService.updateGoal(id, goalDTO);
        return ResponseEntity.noContent().build();
    }
}