package com.example.backend.goal;

import com.example.backend.auth.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final SecurityUtils securityUtils;

    public GoalService(GoalRepository goalRepository, SecurityUtils securityUtils) {
        this.goalRepository = goalRepository;
        this.securityUtils = securityUtils;
    }

    public GoalDTO addGoal(GoalDTO goalDTO) {
        long userId = securityUtils.getAuthenticatedUserId();

        Goal goal = Goal.builder()
                .name(goalDTO.name())
                .userId(userId)
                .current(goalDTO.current())
                .target(goalDTO.target())
                .deadline(goalDTO.deadline())
                .build();

        Goal savedGoal = goalRepository.save(goal);

        return new GoalDTO(
                savedGoal.getId(),
                savedGoal.getName(),
                savedGoal.getCurrent(),
                savedGoal.getTarget(),
                savedGoal.getDeadline()
        );
    }

    public GoalDTO getGoal(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        return new GoalDTO(
                goal.getId(),
                goal.getName(),
                goal.getCurrent(),
                goal.getTarget(),
                goal.getDeadline()
        );
    }

    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }

    public void updateGoal(Long id, GoalDTO goalDTO) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (goalDTO.name() != null && !goalDTO.name().isEmpty()) {
            goal.setName(goalDTO.name());
        }
        if (goalDTO.current() != null) {
            goal.setCurrent(goalDTO.current());
        }
        if (goalDTO.target() != null) {
            goal.setTarget(goalDTO.target());
        }
        if (goalDTO.deadline() != null) {
            goal.setDeadline(goalDTO.deadline());
        }

        goalRepository.save(goal);
    }

    public List<GoalDTO> getAllUserGoals() {
        long userId = securityUtils.getAuthenticatedUserId();
        return goalRepository.findAllByUserId(userId)
                .stream()
                .map(goal -> new GoalDTO(
                        goal.id(),
                        goal.name(),
                        goal.current(),
                        goal.target(),
                        goal.deadline()
                ))
                .toList();
    }
}