package com.connectentrepreneurs.matching.service;

import com.connectentrepreneurs.matching.model.MatchResult;
import com.connectentrepreneurs.matching.model.ProjectMatchResult;
import com.connectentrepreneurs.project.model.Project;
import com.connectentrepreneurs.project.repository.ProjectRepository;
import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class MatchingServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    private MatchingService matchingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        matchingService = new MatchingService();
        inject("userRepository", userRepository);
        inject("projectRepository", projectRepository);
    }

    private void inject(String fieldName, Object value) {
        try {
            var field = MatchingService.class.getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(matchingService, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private User buildUser(String id, String nom, String secteur, List<String> competences,
                            String besoin, String typeProfil, String ville, String pays) {
        User u = new User();
        u.setId(id);
        u.setNom(nom);
        u.setSecteur(secteur);
        u.setCompetences(competences);
        u.setBesoin(besoin);
        u.setTypeProfil(typeProfil);

        if (ville != null || pays != null) {
            User.Location loc = new User.Location();
            loc.setVille(ville);
            loc.setPays(pays);
            u.setLocalisation(loc);
        }
        return u;
    }

    // ---------- findMatches ----------

    @Test
    void testFindMatches_UserNotFound_ReturnsEmpty() {
        when(userRepository.findByFirebaseUid("inconnu")).thenReturn(Optional.empty());

        List<MatchResult> result = matchingService.findMatches("inconnu");

        assertTrue(result.isEmpty());
    }

    @Test
    void testFindMatches_ExcludesSelf() {
        User current = buildUser("1", "Ahmed", "FinTech", null, null, null, null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(List.of(current));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertTrue(result.isEmpty());
    }

    @Test
    void testFindMatches_SameSecteur_AddsScore() {
        User current = buildUser("1", "Ahmed", "FinTech", null, null, null, null, null);
        User other = buildUser("2", "Sara", "FinTech", null, null, null, null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(1, result.size());
        assertEquals(25, result.get(0).getScore());
        assertTrue(result.get(0).getReasons().stream().anyMatch(r -> r.contains("Même secteur")));
    }

    @Test
    void testFindMatches_SameVilleAndPays_AddsScore() {
        User current = buildUser("1", "Ahmed", null, null, null, null, "Marrakech", "Maroc");
        User other = buildUser("2", "Sara", null, null, null, null, "Marrakech", "Maroc");

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(15, result.get(0).getScore()); // 10 ville + 5 pays
    }

    @Test
    void testFindMatches_CommonSkills_AddsScore() {
        User current = buildUser("1", "Ahmed", null, Arrays.asList("Java", "React"), null, null, null, null);
        User other = buildUser("2", "Sara", null, Arrays.asList("Java", "Python"), null, null, null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        // 1 compétence commune sur 2 = 50% * 30 = 15
        assertEquals(15, result.get(0).getScore());
        assertTrue(result.get(0).getReasons().stream().anyMatch(r -> r.contains("Compétence commune")));
    }

    @Test
    void testFindMatches_BesoinSatisfied_AddsScore() {
        User current = buildUser("1", "Ahmed", null, null, "Marketing", null, null, null);
        User other = buildUser("2", "Sara", null, Arrays.asList("Marketing", "SEO"), null, null, null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(20, result.get(0).getScore());
        assertTrue(result.get(0).getReasons().stream().anyMatch(r -> r.contains("compétence recherchée")));
    }

    @Test
    void testFindMatches_ComplementaryProfiles_PorteurProjet() {
        // Les deux typeProfil non-null requis par isComplementary()
        User current = buildUser("1", "Ahmed", null, null, null, "PORTEUR_PROJET", null, null);
        User other = buildUser("2", "Sara", null, null, "Recherche projet", "INVESTISSEUR", null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(10, result.get(0).getScore());
        assertTrue(result.get(0).getReasons().stream().anyMatch(r -> r.contains("complémentaire")));
    }

    @Test
    void testFindMatches_ComplementaryProfiles_Developpeur() {
        // Les deux typeProfil non-null requis par isComplementary()
        User current = buildUser("1", "Ahmed", null, null, null, "DEVELOPPEUR", null, null);
        User other = buildUser("2", "Sara", null, null, "recherche un développeur urgent", "INVESTISSEUR", null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(10, result.get(0).getScore());
        assertTrue(result.get(0).getReasons().stream().anyMatch(r -> r.contains("complémentaire")));
    }

    @Test
    void testFindMatches_ComplementaryProfiles_Investisseur() {
        // Les deux typeProfil non-null requis par isComplementary()
        User current = buildUser("1", "Ahmed", null, null, null, "INVESTISSEUR", null, null);
        User other = buildUser("2", "Sara", null, null, "cherche investisseur", "DEVELOPPEUR", null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(10, result.get(0).getScore());
        assertTrue(result.get(0).getReasons().stream().anyMatch(r -> r.contains("complémentaire")));
    }

    @Test
    void testFindMatches_ComplementaryProfiles_OtherIsPorteurProjet() {
        // Les deux typeProfil non-null requis par isComplementary()
        User current = buildUser("1", "Ahmed", null, null, "Recherche un projet", "DEVELOPPEUR", null, null);
        User other = buildUser("2", "Sara", null, null, null, "PORTEUR_PROJET", null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(10, result.get(0).getScore());
        assertTrue(result.get(0).getReasons().stream().anyMatch(r -> r.contains("complémentaire")));
    }

    @Test
    void testFindMatches_MaxScoreCappedAt100() {
        User current = buildUser("1", "Ahmed", "FinTech", Arrays.asList("Java", "React"),
                "Marketing", "PORTEUR_PROJET", "Marrakech", "Maroc");
        User other = buildUser("2", "Sara", "FinTech", Arrays.asList("Java", "React", "Marketing"),
                "Recherche projet", null, "Marrakech", "Maroc");

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertTrue(result.get(0).getScore() <= 100);
    }

    @Test
    void testFindMatches_SortedByScoreDescending() {
        User current = buildUser("1", "Ahmed", "FinTech", null, null, null, null, null);
        User lowMatch = buildUser("2", "Sara", "HealthTech", null, null, null, null, null);
        User highMatch = buildUser("3", "Karim", "FinTech", null, null, null, null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, lowMatch, highMatch));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(2, result.size());
        assertEquals("Karim", result.get(0).getName());
    }

    @Test
    void testFindMatches_MatchLevel_Excellent() {
        User current = buildUser("1", "Ahmed", "FinTech", Arrays.asList("Java"),
                "Java", "PORTEUR_PROJET", "Marrakech", "Maroc");
        User other = buildUser("2", "Sara", "FinTech", Arrays.asList("Java"),
                "recherche projet", null, "Marrakech", "Maroc");

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertTrue(result.get(0).getScore() >= 80);
        assertEquals("Excellent", result.get(0).getMatchLevel());
    }

    @Test
    void testFindMatches_MatchLevel_Faible() {
        User current = buildUser("1", "Ahmed", "FinTech", null, null, null, null, null);
        User other = buildUser("2", "Sara", "HealthTech", null, null, null, null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(0, result.get(0).getScore());
        assertEquals("Faible", result.get(0).getMatchLevel());
    }

    @Test
    void testFindMatches_NullCompetences_NoSkillScore() {
        User current = buildUser("1", "Ahmed", null, null, null, null, null, null);
        User other = buildUser("2", "Sara", null, Arrays.asList("Java"), null, null, null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(0, result.get(0).getScore());
    }

    @Test
    void testFindMatches_EmptyCompetences_NoSkillScore() {
        User current = buildUser("1", "Ahmed", null, Collections.emptyList(), null, null, null, null);
        User other = buildUser("2", "Sara", null, Arrays.asList("Java"), null, null, null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.findMatches("uid1");

        assertEquals(0, result.get(0).getScore());
    }

    // ---------- findProjectMatches ----------

    @Test
    void testFindProjectMatches_UserNotFound_ReturnsEmpty() {
        when(userRepository.findByFirebaseUid("inconnu")).thenReturn(Optional.empty());

        List<ProjectMatchResult> result = matchingService.findProjectMatches("inconnu");

        assertTrue(result.isEmpty());
    }

    @Test
    void testFindProjectMatches_SameSecteur() {
        User current = buildUser("1", "Ahmed", "FinTech", null, null, null, null, null);

        Project project = new Project();
        project.setId("p1");
        project.setTitre("SaaS RH");
        project.setSecteur("FinTech");

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(projectRepository.findAll()).thenReturn(List.of(project));

        List<ProjectMatchResult> result = matchingService.findProjectMatches("uid1");

        assertEquals(1, result.size());
        assertEquals(40, result.get(0).getScore());
        assertTrue(result.get(0).getReasons().stream().anyMatch(r -> r.contains("Même secteur")));
    }

    @Test
    void testFindProjectMatches_SkillMatchesBesoin() {
        User current = buildUser("1", "Ahmed", null, Arrays.asList("Marketing"), null, null, null, null);

        Project project = new Project();
        project.setId("p1");
        project.setTitre("SaaS RH");
        project.setBesoin("Marketing");

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(projectRepository.findAll()).thenReturn(List.of(project));

        List<ProjectMatchResult> result = matchingService.findProjectMatches("uid1");

        assertEquals(60, result.get(0).getScore());
        assertTrue(result.get(0).getReasons().stream().anyMatch(r -> r.contains("recherche")));
    }

    @Test
    void testFindProjectMatches_BothCriteria_MaxScore() {
        User current = buildUser("1", "Ahmed", "FinTech", Arrays.asList("Marketing"), null, null, null, null);

        Project project = new Project();
        project.setId("p1");
        project.setSecteur("FinTech");
        project.setBesoin("Marketing");

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(projectRepository.findAll()).thenReturn(List.of(project));

        List<ProjectMatchResult> result = matchingService.findProjectMatches("uid1");

        assertEquals(100, result.get(0).getScore());
    }

    @Test
    void testFindProjectMatches_NoMatch() {
        User current = buildUser("1", "Ahmed", "FinTech", Arrays.asList("Java"), null, null, null, null);

        Project project = new Project();
        project.setSecteur("HealthTech");
        project.setBesoin("Marketing");

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(projectRepository.findAll()).thenReturn(List.of(project));

        List<ProjectMatchResult> result = matchingService.findProjectMatches("uid1");

        assertEquals(0, result.get(0).getScore());
    }

    @Test
    void testFindProjectMatches_SortedByScoreDescending() {
        User current = buildUser("1", "Ahmed", "FinTech", Arrays.asList("Marketing"), null, null, null, null);

        Project lowScore = new Project();
        lowScore.setId("p1");
        lowScore.setTitre("Low");
        lowScore.setSecteur("HealthTech");

        Project highScore = new Project();
        highScore.setId("p2");
        highScore.setTitre("High");
        highScore.setSecteur("FinTech");
        highScore.setBesoin("Marketing");

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(projectRepository.findAll()).thenReturn(Arrays.asList(lowScore, highScore));

        List<ProjectMatchResult> result = matchingService.findProjectMatches("uid1");

        assertEquals("High", result.get(0).getTitle());
    }

    // ---------- getSuggestions ----------

    @Test
    void testGetSuggestions_FiltersScoreAbove50() {
        User current = buildUser("1", "Ahmed", "FinTech", Arrays.asList("Java"), null, null, null, null);
        User highMatch = buildUser("2", "Sara", "FinTech", Arrays.asList("Java"),
                "Java", "PORTEUR_PROJET", "Marrakech", "Maroc");
        User lowMatch = buildUser("3", "Karim", "HealthTech", null, null, null, null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, highMatch, lowMatch));

        List<MatchResult> result = matchingService.getSuggestions("uid1");

        assertTrue(result.stream().allMatch(m -> m.getScore() >= 50));
        assertFalse(result.isEmpty());
    }

    @Test
    void testGetSuggestions_LimitedToThree() {
        User current = buildUser("1", "Ahmed", "FinTech", null, null, null, null, null);

        List<User> allUsers = Arrays.asList(
                current,
                buildUser("2", "U2", "FinTech", null, null, null, null, null),
                buildUser("3", "U3", "FinTech", null, null, null, null, null),
                buildUser("4", "U4", "FinTech", null, null, null, null, null),
                buildUser("5", "U5", "FinTech", null, null, null, null, null)
        );

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(allUsers);

        List<MatchResult> result = matchingService.getSuggestions("uid1");

        assertTrue(result.size() <= 3);
    }

    @Test
    void testGetSuggestions_NoMatchesAbove50_ReturnsEmpty() {
        User current = buildUser("1", "Ahmed", "FinTech", null, null, null, null, null);
        User other = buildUser("2", "Sara", "HealthTech", null, null, null, null, null);

        when(userRepository.findByFirebaseUid("uid1")).thenReturn(Optional.of(current));
        when(userRepository.findAll()).thenReturn(Arrays.asList(current, other));

        List<MatchResult> result = matchingService.getSuggestions("uid1");

        assertTrue(result.isEmpty());
    }
}