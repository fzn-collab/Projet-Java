package com.connectentrepreneurs.matching.controller;

import com.connectentrepreneurs.matching.model.MatchResult;
import com.connectentrepreneurs.matching.model.ProjectMatchResult;
import com.connectentrepreneurs.matching.service.MatchingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(MatchingController.class)
class MatchingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MatchingService matchingService;

    @Test
    void testGetMatches() throws Exception {
        MatchResult match = new MatchResult("2", "Sara", 80, "Excellent", List.of("Même secteur"));

        when(matchingService.findMatches("uid1")).thenReturn(List.of(match));

        mockMvc.perform(get("/api/matching")
                .header("X-User-Id", "uid1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Sara"))
                .andExpect(jsonPath("$[0].score").value(80));
    }

    @Test
    void testGetMatches_EmptyResult() throws Exception {
        when(matchingService.findMatches("uid1")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/matching")
                .header("X-User-Id", "uid1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void testGetProjectMatches() throws Exception {
        ProjectMatchResult match = new ProjectMatchResult("p1", "SaaS RH", 60, List.of("Même secteur"));

        when(matchingService.findProjectMatches("uid1")).thenReturn(List.of(match));

        mockMvc.perform(get("/api/matching/projects")
                .header("X-User-Id", "uid1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("SaaS RH"));
    }

    @Test
    void testGetSuggestions() throws Exception {
        MatchResult match = new MatchResult("2", "Sara", 75, "Bon", List.of("Compétence commune"));

        when(matchingService.getSuggestions("uid1")).thenReturn(List.of(match));

        mockMvc.perform(get("/api/matching/suggestions")
                .header("X-User-Id", "uid1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].matchLevel").value("Bon"));
    }
}