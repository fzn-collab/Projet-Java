package com.connectentrepreneurs.project.service;

import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.project.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(String id) {
        return projectRepository.findById(id);
    }

    public List<Project> getProjectsByUser(String ownerId) {
        return projectRepository.findByOwnerId(ownerId);
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(String id, Project projectDetails) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
        project.setTitre(projectDetails.getTitre());
        project.setSecteur(projectDetails.getSecteur());
        project.setDescription(projectDetails.getDescription());
        project.setBesoin(projectDetails.getBesoin());
        project.setStatut(projectDetails.getStatut());
        project.setTags(projectDetails.getTags());
        return projectRepository.save(project);
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }

    public long countActiveProjects(String ownerId) {
        return projectRepository.findByOwnerId(ownerId)
            .stream()
            .filter(p -> "actif".equals(p.getStatut()))
            .count();
    }

    public Project approveProject(String id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
        project.setStatut("ACTIVE");
        return projectRepository.save(project);
    }

    public Project rejectProject(String id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
        project.setStatut("REJECTED");
        return projectRepository.save(project);
    }
}