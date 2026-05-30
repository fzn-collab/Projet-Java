package com.example.demo.controller;

import com.example.demo.model.Project;
import com.example.demo.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private ProjectService projectService;

    @GetMapping("/{userId}")
    public Map<String, Object> getDashboard(@PathVariable String userId) {
        List<Project> userProjects = projectService.getProjectsByUser(userId);
        long actifs = projectService.countActiveProjects(userId);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalProjets", userProjects.size());
        dashboard.put("projetsActifs", actifs);
        dashboard.put("projetsRecents", userProjects);
        return dashboard;
    }
}