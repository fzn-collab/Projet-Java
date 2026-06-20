package com.connectentrepreneurs.matching.model;

import java.util.List;

public class ProjectMatchResult {

    private String projectId;
    private String title;
    private int score;
    private List<String> reasons;

    public ProjectMatchResult(
            String projectId,
            String title,
            int score,
            List<String> reasons) {

        this.projectId = projectId;
        this.title = title;
        this.score = score;
        this.reasons = reasons;
    }

    public String getProjectId() {
        return projectId;
    }

    public String getTitle() {
        return title;
    }

    public int getScore() {
        return score;
    }

    public List<String> getReasons() {
        return reasons;
    }
}