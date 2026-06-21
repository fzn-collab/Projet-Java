package com.connectentrepreneurs.search.service;

import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.project.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class ProjectSearchServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    private ProjectSearchService projectSearchService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        projectSearchService = new ProjectSearchService();
        try {
            var field = ProjectSearchService.class.getDeclaredField("projectRepository");
            field.setAccessible(true);
            field.set(projectSearchService, projectRepository);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private Project buildProject(String titre, String secteur, String besoin) {
        Project p = new Project();
        p.setTitre(titre);
        p.setSecteur(secteur);
        p.setBesoin(besoin);
        return p;
    }

    @Test
    void testSearchProjects_BySecteur() {
        Project p1 = buildProject("SaaS RH", "FinTech", "Marketing");
        Project p2 = buildProject("App Mobile", "HealthTech", "Développeur");

        when(projectRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Project> result = projectSearchService.searchProjects("FinTech", null);

        assertEquals(1, result.size());
        assertEquals("SaaS RH", result.get(0).getTitre());
    }

    @Test
    void testSearchProjects_ByBesoin() {
        Project p1 = buildProject("SaaS RH", "FinTech", "Marketing");
        Project p2 = buildProject("App Mobile", "HealthTech", "Développeur");

        when(projectRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Project> result = projectSearchService.searchProjects(null, "Développeur");

        assertEquals(1, result.size());
        assertEquals("App Mobile", result.get(0).getTitre());
    }

    @Test
    void testSearchProjects_BothFilters() {
        Project p1 = buildProject("SaaS RH", "FinTech", "Marketing");
        Project p2 = buildProject("App Mobile", "FinTech", "Marketing");
        Project p3 = buildProject("E-commerce", "FinTech", "Développeur");

        when(projectRepository.findAll()).thenReturn(Arrays.asList(p1, p2, p3));

        List<Project> result = projectSearchService.searchProjects("FinTech", "Marketing");

        assertEquals(2, result.size());
    }

    @Test
    void testSearchProjects_NoFilters_ReturnsAll() {
        Project p1 = buildProject("SaaS RH", "FinTech", "Marketing");
        Project p2 = buildProject("App Mobile", "HealthTech", "Développeur");

        when(projectRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Project> result = projectSearchService.searchProjects(null, null);

        assertEquals(2, result.size());
    }

    @Test
    void testSearchProjects_EmptyStrings_ReturnsAll() {
        Project p1 = buildProject("SaaS RH", "FinTech", "Marketing");

        when(projectRepository.findAll()).thenReturn(List.of(p1));

        List<Project> result = projectSearchService.searchProjects("", "");

        assertEquals(1, result.size());
    }

    @Test
    void testSearchProjects_CaseInsensitive() {
        Project p1 = buildProject("SaaS RH", "FinTech", "Marketing");

        when(projectRepository.findAll()).thenReturn(List.of(p1));

        List<Project> result = projectSearchService.searchProjects("fintech", null);

        assertEquals(1, result.size());
    }

    @Test
    void testSearchProjects_NoMatch() {
        Project p1 = buildProject("SaaS RH", "FinTech", "Marketing");

        when(projectRepository.findAll()).thenReturn(List.of(p1));

        List<Project> result = projectSearchService.searchProjects("EdTech", null);

        assertTrue(result.isEmpty());
    }

    @Test
    void testSearchProjects_EmptyRepository() {
        when(projectRepository.findAll()).thenReturn(List.of());

        List<Project> result = projectSearchService.searchProjects("FinTech", null);

        assertTrue(result.isEmpty());
    }
}