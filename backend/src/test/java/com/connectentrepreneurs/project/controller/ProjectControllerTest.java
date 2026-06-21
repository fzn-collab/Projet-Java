package com.connectentrepreneurs.project.controller;

import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.project.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(ProjectController.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @Test
    void testGetAllProjects() throws Exception {
        Project p1 = new Project();
        p1.setId("1");
        Project p2 = new Project();
        p2.setId("2");

        when(projectService.getAllProjects()).thenReturn(Arrays.asList(p1, p2));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testGetProjectById_Found() throws Exception {
        Project project = new Project();
        project.setId("1");
        project.setTitre("SaaS RH");

        when(projectService.getProjectById("1")).thenReturn(Optional.of(project));

        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titre").value("SaaS RH"));
    }

    @Test
    void testGetProjectById_NotFound() throws Exception {
        when(projectService.getProjectById("inconnu")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/projects/inconnu"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetProjectsByUser() throws Exception {
        Project p1 = new Project();
        p1.setOwnerId("owner1");

        when(projectService.getProjectsByUser("owner1")).thenReturn(List.of(p1));

        mockMvc.perform(get("/api/projects/user/owner1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ownerId").value("owner1"));
    }

    @Test
    void testCreateProject() throws Exception {
        Project project = new Project();
        project.setTitre("Test Project");

        when(projectService.createProject(any(Project.class))).thenReturn(project);

        String json = """
            {
                "titre": "Test Project",
                "secteur": "FinTech"
            }
            """;

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titre").value("Test Project"));
    }

    @Test
    void testUpdateProject() throws Exception {
        Project updated = new Project();
        updated.setTitre("Titre modifié");

        when(projectService.updateProject(anyString(), any(Project.class))).thenReturn(updated);

        String json = """
            {
                "titre": "Titre modifié"
            }
            """;

        mockMvc.perform(put("/api/projects/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titre").value("Titre modifié"));
    }

    @Test
    void testDeleteProject() throws Exception {
        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isOk());
    }
}