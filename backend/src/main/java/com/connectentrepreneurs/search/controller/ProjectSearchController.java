package com.connectentrepreneurs.search.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.search.service.ProjectSearchService;

@RestController
@RequestMapping("/api/search/projects")
public class ProjectSearchController {

    @Autowired
    private ProjectSearchService projectSearchService;

    @GetMapping
    public List<Project> searchProjects(

            @RequestParam(required = false)
            String secteur,

            @RequestParam(required = false)
            String besoin) {

        return projectSearchService
                .searchProjects(
                        secteur,
                        besoin
                );
    }
}