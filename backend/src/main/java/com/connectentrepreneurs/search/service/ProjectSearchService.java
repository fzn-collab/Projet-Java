package com.connectentrepreneurs.search.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.connectentrepreneurs.project.repository.ProjectRepository;
import com.connectentrepreneurs.project.model.Project;
@Service
public class ProjectSearchService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> searchProjects(
            String secteur,
            String besoin) {

        List<Project> projects =
                projectRepository.findAll();

        return projects.stream()
                .filter(project ->
                        (secteur == null || secteur.isEmpty()
                            || project.getSecteur()
                                      .toLowerCase()
                                      .contains(secteur.toLowerCase()))
                )
                .filter(project ->
                        (besoin == null || besoin.isEmpty()
                            || project.getBesoin()
                                      .toLowerCase()
                                      .contains(besoin.toLowerCase()))
                )
                .toList();
    }
}