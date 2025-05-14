package com.example.backend.integrationTests.groupingrules;

import com.example.backend.groupingrules.GroupingRulesDTO;
import com.example.backend.groupingrules.GroupingRulesService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=none",
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
public class GroupingRulesControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private GroupingRulesService groupingRulesService;

    private GroupingRulesDTO mockRule;
    private List<GroupingRulesDTO> mockRulesList;

    @BeforeEach
    void setup() {
        // Create a mock grouping rule
        mockRule = new GroupingRulesDTO(
                1L,
                "supermarket",
                "Groceries",
                true
        );

        // Create a list of mock rules
        mockRulesList = List.of(
                mockRule,
                new GroupingRulesDTO(
                        2L,
                        "electricity",
                        "Utilities",
                        true
                )
        );

        // Setup service mock responses
        when(groupingRulesService.getAllGroupingRules()).thenReturn(mockRulesList);
        doNothing().when(groupingRulesService).addGroupingRule(any(GroupingRulesDTO.class));
        doNothing().when(groupingRulesService).updateGroupingRule(eq(1L), any(GroupingRulesDTO.class));
        doNothing().when(groupingRulesService).deleteGroupingRule(1L);
    }

    @Test
    @WithMockUser
    void getAllGroupingRules_ShouldReturnRulesList() throws Exception {
        mockMvc.perform(get("/grouping-rules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].criterion").value("supermarket"))
                .andExpect(jsonPath("$[0].categoryName").value("Groceries"))
                .andExpect(jsonPath("$[0].isActive").value(true))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].criterion").value("electricity"))
                .andExpect(jsonPath("$[1].categoryName").value("Utilities"));
    }

    @Test
    @WithMockUser
    void createGroupingRule_ShouldReturnSuccessMessage() throws Exception {
        GroupingRulesDTO newRule = new GroupingRulesDTO(
                null,
                "cinema",
                "Entertainment",
                true
        );

        mockMvc.perform(post("/grouping-rules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newRule)))
                .andExpect(status().isOk())
                .andExpect(content().string("Grouping rule created successfully"));
    }

    @Test
    @WithMockUser
    void updateGroupingRule_ShouldReturnNoContent() throws Exception {
        GroupingRulesDTO updatedRule = new GroupingRulesDTO(
                1L,
                "grocery",
                "Groceries",
                true
        );

        mockMvc.perform(put("/grouping-rules/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedRule)))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void deleteGroupingRule_ShouldReturnOk() throws Exception {
        mockMvc.perform(delete("/grouping-rules/1"))
                .andExpect(status().isOk());
    }
}