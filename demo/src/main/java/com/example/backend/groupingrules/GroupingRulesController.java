package com.example.backend.groupingrules;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grouping-rules")
public class GroupingRulesController {

    private final GroupingRulesService groupingRulesService;

    public GroupingRulesController(GroupingRulesService groupingRulesService) {
        this.groupingRulesService = groupingRulesService;
    }
    @GetMapping
    public ResponseEntity<List<GroupingRulesDTO>> getAllGroupingRules() {
        return ResponseEntity.ok(groupingRulesService.getAllGroupingRules());
    }

    @DeleteMapping("/{id}")
    public void deleteGroupingRule(@PathVariable Long id) {
        groupingRulesService.deleteGroupingRule(id);
    }

    @PostMapping
    public ResponseEntity<?> createGroupingRule(@RequestBody GroupingRulesDTO groupingRulesDTO) {
         groupingRulesService.addGroupingRule(groupingRulesDTO);
         return ResponseEntity.ok("Grouping rule created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroupingRule(@PathVariable Long id, @RequestBody GroupingRulesDTO groupingRulesDTO) {
         groupingRulesService.updateGroupingRule(id, groupingRulesDTO);
         return ResponseEntity.noContent().build();
    }
}