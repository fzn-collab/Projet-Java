package com.connectentrepreneurs.project.service;

import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.project.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        projectService = new ProjectService();
        // injection manuelle car @Autowired field-based
        try {
            var field = ProjectService.class.getDeclaredField("projectRepository");
            field.setAccessible(true);
            field.set(projectService, projectRepository);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetAllProjects() {
        Project p1 = new Project();
        Project p2 = new Project();
        when(projectRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Project> result = projectService.getAllProjects();

        assertEquals(2, result.size());
        verify(projectRepository, times(1)).findAll();
    }

    @Test
    void testGetProjectById_Found() {
        Project project = new Project();
        project.setId("1");

        when(projectRepository.findById("1")).thenReturn(Optional.of(project));

        Optional<Project> result = projectService.getProjectById("1");

        assertTrue(result.isPresent());
        assertEquals("1", result.get().getId());
    }

    @Test
    void testGetProjectById_NotFound() {
        when(projectRepository.findById("inconnu")).thenReturn(Optional.empty());

        Optional<Project> result = projectService.getProjectById("inconnu");

        assertTrue(result.isEmpty());
    }

    @Test
    void testGetProjectsByUser() {
        Project p1 = new Project();
        p1.setOwnerId("owner1");

        when(projectRepository.findByOwnerId("owner1")).thenReturn(List.of(p1));

        List<Project> result = projectService.getProjectsByUser("owner1");

        assertEquals(1, result.size());
        assertEquals("owner1", result.get(0).getOwnerId());
    }

    @Test
    void testCreateProject() {
        Project project = new Project();
        project.setTitre("SaaS RH");

        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));

        Project result = projectService.createProject(project);

        assertEquals("SaaS RH", result.getTitre());
        assertEquals("actif", result.getStatut()); // valeur par défaut du constructeur
        verify(projectRepository, times(1)).save(project);
    }

    @Test
    void testUpdateProject_Found() {
        Project existing = new Project();
        existing.setId("1");
        existing.setTitre("Ancien titre");

        Project updates = new Project();
        updates.setTitre("Nouveau titre");
        updates.setSecteur("FinTech");
        updates.setDescription("Description test");
        updates.setBesoin("Marketing");
        updates.setStatut("inactif");
        updates.setTags(Arrays.asList("startup", "tech"));

        when(projectRepository.findById("1")).thenReturn(Optional.of(existing));
        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));

        Project result = projectService.updateProject("1", updates);

        assertEquals("Nouveau titre", result.getTitre());
        assertEquals("FinTech", result.getSecteur());
        assertEquals("inactif", result.getStatut());
        verify(projectRepository, times(1)).save(existing);
    }

    @Test
    void testUpdateProject_NotFound_ThrowsException() {
        Project updates = new Project();

        when(projectRepository.findById("inconnu")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> projectService.updateProject("inconnu", updates));
    }

    @Test
    void testDeleteProject() {
        projectService.deleteProject("1");

        verify(projectRepository, times(1)).deleteById("1");
    }

    @Test
    void testCountActiveProjects() {
        Project p1 = new Project();
        p1.setStatut("actif");
        Project p2 = new Project();
        p2.setStatut("inactif");
        Project p3 = new Project();
        p3.setStatut("actif");

        when(projectRepository.findByOwnerId("owner1"))
                .thenReturn(Arrays.asList(p1, p2, p3));

        long result = projectService.countActiveProjects("owner1");

        assertEquals(2, result);
    }

    @Test
    void testCountActiveProjects_NoActiveProjects() {
        Project p1 = new Project();
        p1.setStatut("inactif");

        when(projectRepository.findByOwnerId("owner1")).thenReturn(List.of(p1));

        long result = projectService.countActiveProjects("owner1");

        assertEquals(0, result);
    }
}