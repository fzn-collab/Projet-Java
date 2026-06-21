package com.connectentrepreneurs.search.service;

import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class SearchServiceTest {

    @Mock
    private UserRepository userRepository;

    private SearchService searchService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        searchService = new SearchService();
        try {
            var field = SearchService.class.getDeclaredField("userRepository");
            field.setAccessible(true);
            field.set(searchService, userRepository);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private User buildUser(String nom, List<String> competences, String secteur,
                             String ville, String besoin, String typeProfil) {
        User u = new User();
        u.setNom(nom);
        u.setCompetences(competences);
        u.setSecteur(secteur);
        u.setBesoin(besoin);
        u.setTypeProfil(typeProfil);

        if (ville != null) {
            User.Location loc = new User.Location();
            loc.setVille(ville);
            u.setLocalisation(loc);
        }
        return u;
    }

    @Test
    void testSearch_BySkill() {
        User u1 = buildUser("Ahmed", Arrays.asList("React", "Java"), "FinTech", "Marrakech", "Co-fondateur", "DEVELOPPEUR");
        User u2 = buildUser("Sara", Arrays.asList("Marketing"), "FinTech", "Casablanca", "Investisseur", "INVESTISSEUR");

        when(userRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        List<User> result = searchService.search("React", null, null, null, null);

        assertEquals(1, result.size());
        assertEquals("Ahmed", result.get(0).getNom());
    }

    @Test
    void testSearch_BySector() {
        User u1 = buildUser("Ahmed", null, "FinTech", null, null, null);
        User u2 = buildUser("Sara", null, "HealthTech", null, null, null);

        when(userRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        List<User> result = searchService.search(null, "FinTech", null, null, null);

        assertEquals(1, result.size());
        assertEquals("Ahmed", result.get(0).getNom());
    }

    @Test
    void testSearch_ByLocation() {
        User u1 = buildUser("Ahmed", null, null, "Marrakech", null, null);
        User u2 = buildUser("Sara", null, null, "Casablanca", null, null);

        when(userRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        List<User> result = searchService.search(null, null, "Marrakech", null, null);

        assertEquals(1, result.size());
        assertEquals("Ahmed", result.get(0).getNom());
    }

    @Test
    void testSearch_ByNeed() {
        User u1 = buildUser("Ahmed", null, null, null, "Co-fondateur", null);
        User u2 = buildUser("Sara", null, null, null, "Investisseur", null);

        when(userRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        List<User> result = searchService.search(null, null, null, "Co-fondateur", null);

        assertEquals(1, result.size());
        assertEquals("Ahmed", result.get(0).getNom());
    }

    @Test
    void testSearch_ByTypeProfil() {
        User u1 = buildUser("Ahmed", null, null, null, null, "DEVELOPPEUR");
        User u2 = buildUser("Sara", null, null, null, null, "INVESTISSEUR");

        when(userRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        List<User> result = searchService.search(null, null, null, null, "DEVELOPPEUR");

        assertEquals(1, result.size());
        assertEquals("Ahmed", result.get(0).getNom());
    }

    @Test
    void testSearch_AllFiltersCombined() {
        User u1 = buildUser("Ahmed", Arrays.asList("Java"), "FinTech", "Marrakech", "Co-fondateur", "DEVELOPPEUR");
        User u2 = buildUser("Sara", Arrays.asList("Java"), "FinTech", "Marrakech", "Investisseur", "INVESTISSEUR");

        when(userRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        List<User> result = searchService.search("Java", "FinTech", "Marrakech", "Co-fondateur", "DEVELOPPEUR");

        assertEquals(1, result.size());
        assertEquals("Ahmed", result.get(0).getNom());
    }

    @Test
    void testSearch_NoFilters_ReturnsAll() {
        User u1 = buildUser("Ahmed", null, null, null, null, null);
        User u2 = buildUser("Sara", null, null, null, null, null);

        when(userRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        List<User> result = searchService.search(null, null, null, null, null);

        assertEquals(2, result.size());
    }

    @Test
    void testSearch_UserWithNullCompetences_SkillFilterExcludes() {
        User u1 = buildUser("Ahmed", null, null, null, null, null); // pas de compétences

        when(userRepository.findAll()).thenReturn(List.of(u1));

        List<User> result = searchService.search("Java", null, null, null, null);

        assertTrue(result.isEmpty());
    }

    @Test
    void testSearch_UserWithNullLocalisation_LocationFilterExcludes() {
        User u1 = buildUser("Ahmed", null, null, null, null, null); // pas de localisation

        when(userRepository.findAll()).thenReturn(List.of(u1));

        List<User> result = searchService.search(null, null, "Marrakech", null, null);

        assertTrue(result.isEmpty());
    }

    @Test
    void testSearch_NoMatch() {
        User u1 = buildUser("Ahmed", null, "FinTech", null, null, null);

        when(userRepository.findAll()).thenReturn(List.of(u1));

        List<User> result = searchService.search(null, "EdTech", null, null, null);

        assertTrue(result.isEmpty());
    }

    @Test
    void testSearch_EmptyRepository() {
        when(userRepository.findAll()).thenReturn(Collections.emptyList());

        List<User> result = searchService.search("Java", null, null, null, null);

        assertTrue(result.isEmpty());
    }
}