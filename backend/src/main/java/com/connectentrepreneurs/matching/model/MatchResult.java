package com.connectentrepreneurs.matching.model;

import java.util.List;

public class MatchResult {

    private String userId;
    private String name;
    private String userAName;
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

    public MatchResult(String userAName,
                       String userId,
                       String name,
                       int score,
                       String matchLevel,
                       List<String> reasons) {

        this.userAName = userAName;
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

    public String getUserAName() {
        return userAName;
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