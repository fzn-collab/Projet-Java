package com.connectentrepreneurs.matching.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connectentrepreneurs.matching.model.MatchResult;
import com.connectentrepreneurs.matching.model.ProjectMatchResult;
import com.connectentrepreneurs.matching.service.MatchingService;

@RestController
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/api/matching")
    public List<MatchResult> getMatches() {

        return matchingService.findMatches();
    }
    
    @GetMapping("/api/matching/projects")
    public List<ProjectMatchResult>
    getProjectMatches() {

        return matchingService
                .findProjectMatches();
    }
    
    @GetMapping("/api/matching/suggestions")
    public List<MatchResult> getSuggestions() {

        return matchingService
                .getSuggestions();
    }
}