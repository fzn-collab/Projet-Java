package com.connectentrepreneurs.matching.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.connectentrepreneurs.matching.model.MatchResult;
import com.connectentrepreneurs.matching.model.ProjectMatchResult;
import com.connectentrepreneurs.matching.service.MatchingService;

@RestController
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/api/matching")
    public List<MatchResult> getMatches(
            @RequestHeader("X-User-Id") String uid) {

        return matchingService.findMatches(uid);
    }
    
    @GetMapping("/api/matching/projects")
    public List<ProjectMatchResult> getProjectMatches(
            @RequestHeader("X-User-Id") String uid) {

        return matchingService.findProjectMatches(uid);
    }
    
    @GetMapping("/api/matching/suggestions")
    public List<MatchResult> getSuggestions(
            @RequestHeader("X-User-Id") String uid) {

        return matchingService.getSuggestions(uid);
    }
}