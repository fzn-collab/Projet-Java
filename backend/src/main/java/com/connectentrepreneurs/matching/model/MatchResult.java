package com.connectentrepreneurs.matching.model;

import java.util.List;

public class MatchResult {

    private String userId;
    private String name;
    private int score;
    private String matchLevel;
    private List<String> reasons;

    public MatchResult(String userId,
                       String name,
                       int score,
                       String matchLevel,
                       List<String> reasons) {

        this.userId = userId;
        this.name = name;
        this.score = score;
        this.matchLevel = matchLevel;
        this.reasons = reasons;
    }

    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public int getScore() {
        return score;
    }

    public String getMatchLevel() {
        return matchLevel;
    }

    public List<String> getReasons() {
        return reasons;
    }
}