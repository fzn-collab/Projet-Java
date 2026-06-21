package com.connectentrepreneurs.project.controller;

import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.project.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        return projectService.getProjectById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{ownerId}")
    public List<Project> getProjectsByUser(@PathVariable String ownerId) {
        return projectService.getProjectsByUser(ownerId);
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id,
                                                  @RequestBody Project project) {
        return ResponseEntity.ok(projectService.updateProject(id, project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Project> approveProject(@PathVariable String id) {
        return ResponseEntity.ok(projectService.approveProject(id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Project> rejectProject(@PathVariable String id) {
        return ResponseEntity.ok(projectService.rejectProject(id));
    }
}
