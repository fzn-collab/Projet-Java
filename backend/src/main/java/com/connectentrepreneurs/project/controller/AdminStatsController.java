package com.connectentrepreneurs.project.controller;

import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.project.service.ProjectService;
import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin(origins = "*")
public class AdminStatsController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public Map<String, Object> getAdminStats() {
        List<User> allUsers = userService.getAllUsers();
        List<Project> allProjects = projectService.getAllProjects();

        long totalUsers = allUsers.stream()
                .filter(u -> "USER".equals(u.getRole()))
                .count();

        long activeProjects = allProjects.stream()
                .filter(p -> "ACTIVE".equals(p.getStatut()))
                .count();

        long pendingProjects = allProjects.stream()
                .filter(p -> "PENDING".equals(p.getStatut()) || "actif".equals(p.getStatut()))
                .count();

        long activeUsers = allUsers.stream()
                .filter(u -> "USER".equals(u.getRole()) && u.isActif())
                .count();

        long totalMatches = allUsers.size() * 2; // Simplified calculation

        long newUsersThisWeek = allUsers.stream()
                .filter(u -> u.getCreatedAt() != null)
                .filter(u -> u.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusWeeks(1)))
                .count();

        int matchRate = totalUsers > 0 ? (int) ((totalMatches * 100) / totalUsers) : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeProjects", activeProjects);
        stats.put("totalMatches", totalMatches);
        stats.put("activeUsers", activeUsers);
        stats.put("newUsersThisWeek", newUsersThisWeek);
        stats.put("pendingProjects", pendingProjects);
        stats.put("unreadNotifications", 0); // To be implemented by Personne 3
        stats.put("matchRate", matchRate);

        return stats;
    }
}
