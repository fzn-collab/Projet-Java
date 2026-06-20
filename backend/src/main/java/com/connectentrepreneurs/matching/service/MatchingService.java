package com.connectentrepreneurs.matching.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.connectentrepreneurs.matching.model.MatchResult;
import com.connectentrepreneurs.matching.model.ProjectMatchResult;
import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.project.repository.ProjectRepository;
import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.repository.UserRepository;

@Service
public class MatchingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<MatchResult> findMatches(String firebaseUid) {

        List<User> users = userRepository.findAll();

        User currentUser = userRepository
                .findByFirebaseUid(firebaseUid)
                .orElse(null);

        if (currentUser == null) {
            return new ArrayList<>();
        }

        List<MatchResult> results = new ArrayList<>();

        for (User other : users) {

            if (other.getId() != null
                    && other.getId().equals(currentUser.getId())) {
                continue;
            }

            int score = calculateScore(currentUser, other);
            List<String> reasons = generateReasons(currentUser, other);

            results.add(
                    new MatchResult(
                            other.getId(),
                            other.getNom(),
                            score,
                            getMatchLevel(score),
                            reasons
                    )
            );
        }

        results.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));

        return results;
    }

    private int calculateScore(User current, User other) {

        int score = 0;

        if (sameSecteur(current, other)) {
            score += 25;
        }

        if (sameVille(current, other)) {
            score += 10;
        }

        if (samePays(current, other)) {
            score += 5;
        }

        score += calculateSkillScore(current, other);

        if (besoinSatisfied(current, other)) {
            score += 20;
        }

        if (isComplementary(current, other)) {
            score += 10;
        }

        return Math.min(score, 100);
    }

    private int calculateSkillScore(User current, User other) {

        if (current.getCompetences() == null
                || current.getCompetences().isEmpty()
                || other.getCompetences() == null
                || other.getCompetences().isEmpty()) {
            return 0;
        }

        int commonSkills = 0;

        for (String skill : current.getCompetences()) {

            if (skill == null) {
                continue;
            }

            if (other.getCompetences()
                    .stream()
                    .anyMatch(s ->
                            s != null &&
                            s.equalsIgnoreCase(skill))) {

                commonSkills++;
            }
        }

        double percentage =
                (double) commonSkills / current.getCompetences().size();

        return (int) (percentage * 30);
    }

    private boolean sameSecteur(User current, User other) {
        return current.getSecteur() != null
                && other.getSecteur() != null
                && current.getSecteur()
                        .equalsIgnoreCase(other.getSecteur());
    }

    private boolean sameVille(User current, User other) {
        return current.getLocalisation() != null
                && other.getLocalisation() != null
                && current.getLocalisation().getVille() != null
                && other.getLocalisation().getVille() != null
                && current.getLocalisation().getVille()
                        .equalsIgnoreCase(
                                other.getLocalisation().getVille()
                        );
    }

    private boolean samePays(User current, User other) {
        return current.getLocalisation() != null
                && other.getLocalisation() != null
                && current.getLocalisation().getPays() != null
                && other.getLocalisation().getPays() != null
                && current.getLocalisation().getPays()
                        .equalsIgnoreCase(
                                other.getLocalisation().getPays()
                        );
    }

    private boolean besoinSatisfied(User current, User other) {

        if (current.getBesoin() == null
                || other.getCompetences() == null) {
            return false;
        }

        return other.getCompetences()
                .stream()
                .anyMatch(skill ->
                        skill != null &&
                        skill.equalsIgnoreCase(current.getBesoin()));
    }

    private boolean isComplementary(User current, User other) {

        if (current.getTypeProfil() == null
                || other.getTypeProfil() == null) {
            return false;
        }

        String currentType = current.getTypeProfil();
        String otherType = other.getTypeProfil();

        String currentBesoin =
                current.getBesoin() == null
                        ? ""
                        : current.getBesoin().toLowerCase();

        String otherBesoin =
                other.getBesoin() == null
                        ? ""
                        : other.getBesoin().toLowerCase();

        if (currentType.equalsIgnoreCase("PORTEUR_PROJET")
                && otherBesoin.contains("projet")) {
            return true;
        }

        if (currentType.equalsIgnoreCase("DEVELOPPEUR")
                && otherBesoin.contains("développeur")) {
            return true;
        }

        if (currentType.equalsIgnoreCase("INVESTISSEUR")
                && otherBesoin.contains("investisseur")) {
            return true;
        }

        if (otherType.equalsIgnoreCase("PORTEUR_PROJET")
                && currentBesoin.contains("projet")) {
            return true;
        }

        return false;
    }

    private String getMatchLevel(int score) {

        if (score >= 80) {
            return "Excellent";
        }

        if (score >= 60) {
            return "Bon";
        }

        if (score >= 40) {
            return "Moyen";
        }

        return "Faible";
    }

    private List<String> generateReasons(User current, User other) {

        List<String> reasons = new ArrayList<>();

        if (sameSecteur(current, other)) {
            reasons.add("Même secteur : " + current.getSecteur());
        }

        if (sameVille(current, other)) {
            reasons.add("Même ville : "
                    + current.getLocalisation().getVille());
        }

        if (samePays(current, other)) {
            reasons.add("Même pays : "
                    + current.getLocalisation().getPays());
        }

        if (current.getCompetences() != null
                && other.getCompetences() != null) {

            for (String skill : current.getCompetences()) {

                if (skill == null) {
                    continue;
                }

                if (other.getCompetences()
                        .stream()
                        .anyMatch(s ->
                                s != null &&
                                s.equalsIgnoreCase(skill))) {

                    reasons.add("Compétence commune : " + skill);
                }
            }
        }

        if (besoinSatisfied(current, other)) {
            reasons.add("Possède la compétence recherchée : "
                    + current.getBesoin());
        }

        if (isComplementary(current, other)) {
            reasons.add("Profil complémentaire : "
                    + current.getTypeProfil()
                    + " ↔ "
                    + other.getTypeProfil());
        }

        return reasons;
    }

    private int calculateProjectScore(User user, Project project) {

        int score = 0;

        if (user.getSecteur() != null
                && project.getSecteur() != null
                && user.getSecteur()
                        .equalsIgnoreCase(project.getSecteur())) {
            score += 40;
        }

        if (user.getCompetences() != null
                && project.getBesoin() != null
                && user.getCompetences()
                        .stream()
                        .anyMatch(skill ->
                                skill != null &&
                                skill.equalsIgnoreCase(
                                        project.getBesoin()
                                ))) {
            score += 60;
        }

        return Math.min(score, 100);
    }

    private List<String> generateProjectReasons(
            User user,
            Project project) {

        List<String> reasons = new ArrayList<>();

        if (user.getSecteur() != null
                && project.getSecteur() != null
                && user.getSecteur()
                        .equalsIgnoreCase(project.getSecteur())) {

            reasons.add("Même secteur : " + project.getSecteur());
        }

        if (user.getCompetences() != null
                && project.getBesoin() != null
                && user.getCompetences()
                        .stream()
                        .anyMatch(skill ->
                                skill != null &&
                                skill.equalsIgnoreCase(
                                        project.getBesoin()
                                ))) {

            reasons.add("Le projet recherche : "
                    + project.getBesoin());
        }

        return reasons;
    }

    public List<ProjectMatchResult> findProjectMatches(
            String firebaseUid) {

        User currentUser = userRepository
                .findByFirebaseUid(firebaseUid)
                .orElse(null);

        if (currentUser == null) {
            return new ArrayList<>();
        }

        List<Project> projects = projectRepository.findAll();
        List<ProjectMatchResult> results = new ArrayList<>();

        for (Project project : projects) {

            int score = calculateProjectScore(currentUser, project);
            List<String> reasons =
                    generateProjectReasons(currentUser, project);

            results.add(
                    new ProjectMatchResult(
                            project.getId(),
                            project.getTitre(),
                            score,
                            reasons
                    )
            );
        }

        results.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));

        return results;
    }

    public List<MatchResult> getSuggestions(String firebaseUid) {

        return findMatches(firebaseUid)
                .stream()
                .filter(match -> match.getScore() >= 50)
                .limit(3)
                .toList();
    }

    public List<MatchResult> getAllMatches() {
        List<User> users = userRepository.findAll();
        List<MatchResult> results = new ArrayList<>();
        Set<String> seenPairs = new HashSet<>();

        for (int i = 0; i < users.size(); i++) {
            for (int j = i + 1; j < users.size(); j++) {
                User userA = users.get(i);
                User userB = users.get(j);

                if (userA.getId() == null || userB.getId() == null) continue;
                if (userA.getId().equals(userB.getId())) continue;

                int score = calculateScore(userA, userB);
                List<String> reasons = generateReasons(userA, userB);

                // Avoid duplicates by using sorted pair IDs
                String pairId = userA.getId().compareTo(userB.getId()) < 0
                    ? userA.getId() + "-" + userB.getId()
                    : userB.getId() + "-" + userA.getId();

                if (seenPairs.contains(pairId)) continue;
                seenPairs.add(pairId);

                results.add(new MatchResult(
                    userA.getNom() != null ? userA.getNom() : "Inconnu",
                    userB.getId(),
                    userB.getNom() != null ? userB.getNom() : "Inconnu",
                    score,
                    getMatchLevel(score),
                    reasons
                ));
            }
        }

        results.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));
        return results;
    }
}