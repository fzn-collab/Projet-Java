package com.connectentrepreneurs.search.controller;

import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.search.service.ProjectSearchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(ProjectSearchController.class)
class ProjectSearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectSearchService projectSearchService;

    @Test
    void testSearchProjects_WithFilters() throws Exception {
        Project p1 = new Project();
        p1.setTitre("SaaS RH");

        when(projectSearchService.searchProjects("FinTech", "Marketing"))
                .thenReturn(List.of(p1));

        mockMvc.perform(get("/api/search/projects")
                .param("secteur", "FinTech")
                .param("besoin", "Marketing"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titre").value("SaaS RH"));
    }

    @Test
    void testSearchProjects_NoFilters() throws Exception {
        when(projectSearchService.searchProjects(any(), any()))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/search/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}