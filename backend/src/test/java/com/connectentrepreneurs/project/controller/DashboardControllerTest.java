package com.connectentrepreneurs.project.controller;

import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.project.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(DashboardController.class)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @Test
    void testGetDashboard() throws Exception {
        Project p1 = new Project();
        p1.setStatut("actif");
        Project p2 = new Project();
        p2.setStatut("inactif");

        List<Project> projects = Arrays.asList(p1, p2);

        when(projectService.getProjectsByUser("user1")).thenReturn(projects);
        when(projectService.countActiveProjects("user1")).thenReturn(1L);

        mockMvc.perform(get("/api/dashboard/user1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProjets").value(2))
                .andExpect(jsonPath("$.projetsActifs").value(1));
    }

    @Test
    void testGetDashboard_EmptyProjects() throws Exception {
        when(projectService.getProjectsByUser("user2")).thenReturn(List.of());
        when(projectService.countActiveProjects("user2")).thenReturn(0L);

        mockMvc.perform(get("/api/dashboard/user2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProjets").value(0))
                .andExpect(jsonPath("$.projetsActifs").value(0));
    }
}