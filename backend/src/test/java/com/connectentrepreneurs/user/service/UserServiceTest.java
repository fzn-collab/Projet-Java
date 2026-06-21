package com.connectentrepreneurs.user.service;

import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository);
    }

    // ---------- createUser ----------

    @Test
    void testCreateUser_NewUser() {
        User user = new User();
        user.setFirebaseUid("uid123");
        user.setEmail("test@test.com");

        when(userRepository.findByFirebaseUid("uid123")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = userService.createUser(user);

        assertNotNull(result);
        assertEquals("uid123", result.getFirebaseUid());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testCreateUser_AlreadyExistsByFirebaseUid() {
        User existing = new User();
        existing.setId("1");
        existing.setFirebaseUid("uid123");

        User newUser = new User();
        newUser.setFirebaseUid("uid123");

        when(userRepository.findByFirebaseUid("uid123")).thenReturn(Optional.of(existing));

        User result = userService.createUser(newUser);

        assertEquals("1", result.getId());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testCreateUser_AlreadyExistsByEmail() {
        User existing = new User();
        existing.setId("2");
        existing.setEmail("test@test.com");

        User newUser = new User();
        newUser.setEmail("test@test.com");
        // pas de firebaseUid -> skip premier check

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(existing));

        User result = userService.createUser(newUser);

        assertEquals("2", result.getId());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testCreateUser_NoUidNoEmail() {
        User newUser = new User(); // pas de uid, pas d'email

        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = userService.createUser(newUser);

        assertNotNull(result);
        verify(userRepository, times(1)).save(newUser);
    }

    // ---------- getByFirebaseUid ----------

    @Test
    void testGetByFirebaseUid_Found() {
        User user = new User();
        user.setFirebaseUid("uid123");

        when(userRepository.findByFirebaseUid("uid123")).thenReturn(Optional.of(user));

        User result = userService.getByFirebaseUid("uid123");

        assertEquals("uid123", result.getFirebaseUid());
    }

    @Test
    void testGetByFirebaseUid_NotFound_ThrowsException() {
        when(userRepository.findByFirebaseUid("inconnu")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getByFirebaseUid("inconnu"));
    }

    // ---------- updateUser ----------

    @Test
    void testUpdateUser() {
        User existing = new User();
        existing.setFirebaseUid("uid123");
        existing.setNom("Ancien Nom");

        User updates = new User();
        updates.setNom("Nouveau Nom");
        updates.setSecteur("FinTech");
        updates.setCompetences(Arrays.asList("Java", "React"));
        updates.setBesoin("Co-fondateur");
        updates.setTypeProfil("Entrepreneur");

        when(userRepository.findByFirebaseUid("uid123")).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = userService.updateUser("uid123", updates);

        assertEquals("Nouveau Nom", result.getNom());
        assertEquals("FinTech", result.getSecteur());
        assertEquals("Co-fondateur", result.getBesoin());
        verify(userRepository, times(1)).save(existing);
    }

    // ---------- getAllUsers ----------

    @Test
    void testGetAllUsers() {
        User u1 = new User();
        User u2 = new User();
        when(userRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
    }

    // ---------- toggleSuspend ----------

    @Test
    void testToggleSuspend_FromActiveToSuspended() {
        User user = new User();
        user.setId("1");
        user.setActif(true);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = userService.toggleSuspend("1");

        assertFalse(result.isActif());
    }

    @Test
    void testToggleSuspend_FromSuspendedToActive() {
        User user = new User();
        user.setId("1");
        user.setActif(false);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = userService.toggleSuspend("1");

        assertTrue(result.isActif());
    }

    @Test
    void testToggleSuspend_UserNotFound() {
        when(userRepository.findById("inconnu")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.toggleSuspend("inconnu"));
    }

    // ---------- updateLocalisation ----------

    @Test
    void testUpdateLocalisation() {
        User user = new User();
        user.setFirebaseUid("uid123");

        User.Location location = new User.Location();
        location.setVille("Marrakech");
        location.setPays("Maroc");

        when(userRepository.findByFirebaseUid("uid123")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = userService.updateLocalisation("uid123", location);

        assertEquals("Marrakech", result.getLocalisation().getVille());
        assertEquals("Maroc", result.getLocalisation().getPays());
    }

    // ---------- getUserById ----------

    @Test
    void testGetUserById_Found() {
        User user = new User();
        user.setId("1");

        when(userRepository.findById("1")).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserById("1");

        assertTrue(result.isPresent());
        assertEquals("1", result.get().getId());
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById("inconnu")).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserById("inconnu");

        assertTrue(result.isEmpty());
    }

    // ---------- isProfileComplete ----------

    @Test
    void testIsProfileComplete_True() {
        User user = buildCompleteUser();

        assertTrue(userService.isProfileComplete(user));
    }

    @Test
    void testIsProfileComplete_MissingNom() {
        User user = buildCompleteUser();
        user.setNom(null);

        assertFalse(userService.isProfileComplete(user));
    }

    @Test
    void testIsProfileComplete_MissingCompetences() {
        User user = buildCompleteUser();
        user.setCompetences(List.of());

        assertFalse(userService.isProfileComplete(user));
    }

    @Test
    void testIsProfileComplete_MissingLocalisation() {
        User user = buildCompleteUser();
        user.setLocalisation(null);

        assertFalse(userService.isProfileComplete(user));
    }

    @Test
    void testIsProfileComplete_MissingVille() {
        User user = buildCompleteUser();
        user.getLocalisation().setVille("");

        assertFalse(userService.isProfileComplete(user));
    }

    @Test
    void testIsProfileComplete_MissingBesoin() {
        User user = buildCompleteUser();
        user.setBesoin(null);

        assertFalse(userService.isProfileComplete(user));
    }

    // ---------- helper ----------

    private User buildCompleteUser() {
        User user = new User();
        user.setNom("Ahmed");
        user.setTypeProfil("Entrepreneur");
        user.setSecteur("FinTech");
        user.setCompetences(Arrays.asList("Java", "React"));
        user.setBesoin("Co-fondateur");

        User.Location loc = new User.Location();
        loc.setVille("Marrakech");
        loc.setPays("Maroc");
        user.setLocalisation(loc);

        return user;
    }
}