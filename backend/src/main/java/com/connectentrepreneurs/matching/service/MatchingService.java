package com.connectentrepreneurs.matching.service;

import java.util.ArrayList;
import java.util.List;

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

	    List<User> users =
	            userRepository.findAll();

	    User currentUser =
	            userRepository.findByFirebaseUid(firebaseUid)
	                          .orElse(null);

	    if(currentUser == null) {
	        return new ArrayList<>();
	    }

	    List<MatchResult> results =
	            new ArrayList<>();

	    for(User other : users) {

	        if(other.getId()
	                .equals(currentUser.getId())) {

	            continue;
	        }

	        int score =
	                calculateScore(
	                        currentUser,
	                        other
	                );

	        List<String> reasons =
	                generateReasons(
	                        currentUser,
	                        other
	                );

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

	    results.sort(
	            (a,b) ->
	                    Integer.compare(
	                            b.getScore(),
	                            a.getScore()
	                    )
	    );

	    return results;
	}

    private int calculateSkillScore(User current,
                                    User other) {

        int commonSkills = 0;

        for(String skill : current.getCompetences()) {

            if(other.getCompetences().stream()
                    .anyMatch(
                            s -> s.equalsIgnoreCase(skill)
                    )) {

                commonSkills++;
            }
        }

        if(current.getCompetences().isEmpty()) {
            return 0;
        }

        double percentage =
                (double) commonSkills
                        / current.getCompetences().size();

        return (int)(percentage * 40);
    }

    private int calculateScore(User current,
                               User other) {

        int score = 0;

        // secteur
        if(current.getSecteur()
                .equalsIgnoreCase(other.getSecteur())) {

            score += 30;
        }

        // localisation
        if(current.getLocalisation().getVille()
                .equalsIgnoreCase(other.getLocalisation().getVille())) {

            score += 10;
        }

        // compétences
        score += calculateSkillScore(
                current,
                other
        );

        // besoin satisfait
        if(other.getCompetences().stream()
                .anyMatch(
                        skill ->
                                skill.equalsIgnoreCase(
                                        current.getBesoin()
                                )
                )) {

            score += 20;
        }

        return Math.min(score,100);
    }

    private String getMatchLevel(int score) {

        if(score >= 80)
            return "Excellent";

        if(score >= 60)
            return "Bon";

        if(score >= 40)
            return "Moyen";

        return "Faible";
    }

    private List<String> generateReasons(User current,
                                         User other) {

        List<String> reasons =
                new ArrayList<>();

        if(current.getSecteur()
                .equalsIgnoreCase(other.getSecteur())) {

            reasons.add(
                    "Même secteur : "
                            + current.getSecteur()
            );
        }

        if(current.getLocalisation().getVille()
                .equalsIgnoreCase(other.getLocalisation().getVille())) {

            reasons.add(
                    "Même localisation"
            );
        }

        for(String skill :
                current.getCompetences()) {

            if(other.getCompetences()
                    .stream()
                    .anyMatch(
                            s ->
                                    s.equalsIgnoreCase(skill)
                    )) {

                reasons.add(
                        "Compétence commune : "
                                + skill
                );
            }
        }

        if(other.getCompetences()
                .stream()
                .anyMatch(
                        skill ->
                                skill.equalsIgnoreCase(
                                        current.getBesoin()
                                )
                )) {

            reasons.add(
                    "Possède la compétence recherchée : "
                            + current.getBesoin()
            );
        }

        return reasons;
    }
    
    private int calculateProjectScore(
            User user,
            Project project) {

        int score = 0;

        if(user.getSecteur()
                .equalsIgnoreCase(
                        project.getSecteur())) {

            score += 40;
        }

        if(user.getCompetences()
                .stream()
                .anyMatch(skill ->
                    skill.equalsIgnoreCase(
                        project.getBesoin()))) {

            score += 60;
        }

        return Math.min(score,100);
    }
    
    private List<String> generateProjectReasons(
            User user,
            Project project) {

        List<String> reasons =
                new ArrayList<>();

        if(user.getSecteur()
                .equalsIgnoreCase(
                        project.getSecteur())) {

            reasons.add(
                "Même secteur : "
                + project.getSecteur());
        }

        if(user.getCompetences()
                .stream()
                .anyMatch(skill ->
                    skill.equalsIgnoreCase(
                        project.getBesoin()))) {

            reasons.add(
                "Le projet recherche : "
                + project.getBesoin());
        }

        return reasons;
    }
    
    public List<ProjectMatchResult> findProjectMatches(
            String firebaseUid) {

    	User currentUser =
    	        userRepository.findByFirebaseUid(firebaseUid)
    	                      .orElse(null);

        if(currentUser == null) {
            return new ArrayList<>();
        }

        List<Project> projects =
                projectRepository.findAll();

        List<ProjectMatchResult> results =
                new ArrayList<>();

        for(Project project : projects) {

            int score =
                    calculateProjectScore(
                            currentUser,
                            project
                    );

            List<String> reasons =
                    generateProjectReasons(
                            currentUser,
                            project
                    );

            results.add(
                    new ProjectMatchResult(
                            project.getId(),
                            project.getTitre(),
                            score,
                            reasons
                    )
            );
        }

        results.sort(
                (a,b) ->
                        Integer.compare(
                                b.getScore(),
                                a.getScore()
                        )
        );

        return results;
    }
    
    
    public List<MatchResult> getSuggestions(
            String firebaseUid) {

    	return findMatches(firebaseUid)
                .stream()
                .filter(match ->
                        match.getScore() >= 50)
                .limit(3)
                .toList();
    }
}