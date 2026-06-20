package com.connectentrepreneurs.backend.service;

import com.connectentrepreneurs.backend.model.User;
import com.connectentrepreneurs.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(User user) {
        sanitizeAndValidateUser(user);
        return userRepository.save(user);
    }

    public User getByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User syncFirebaseUser(String firebaseUid, String email, String nom, String photoUrl) {
        Optional<User> existing = userRepository.findByFirebaseUid(firebaseUid);
        if (existing.isPresent()) {
            User user = existing.get();
            if (photoUrl != null && !photoUrl.isBlank()) {
                user.setPhotoUrl(photoUrl);
                return userRepository.save(user);
            }
            return user;
        }

        User user = new User();
        user.setFirebaseUid(firebaseUid);
        user.setEmail(email);
        user.setNom((nom == null || nom.isBlank()) ? "Utilisateur" : nom);
        user.setRole("USER");
        user.setActif(true);
        user.setPhotoUrl(photoUrl);
        return userRepository.save(user);
    }

    public User updateUser(String firebaseUid, User updatedUser) {
        User user = getByFirebaseUid(firebaseUid);
        sanitizeAndValidateUser(updatedUser);
        user.setNom(updatedUser.getNom());
        user.setRole(updatedUser.getRole());
        user.setSecteur(updatedUser.getSecteur());
        user.setCompetences(updatedUser.getCompetences());
        user.setBesoin(updatedUser.getBesoin());
        user.setLocalisation(updatedUser.getLocalisation());
        return userRepository.save(user);
    }

    public User updatePhoto(String firebaseUid, String photoUrl) {
        if (photoUrl == null || photoUrl.isBlank()) {
            throw new IllegalArgumentException("photoUrl est obligatoire");
        }
        User user = getByFirebaseUid(firebaseUid);
        user.setPhotoUrl(photoUrl);
        return userRepository.save(user);
    }

    public boolean isProfileComplete(User user) {
        return user.getNom() != null && !user.getNom().isBlank()
                && user.getSecteur() != null && !user.getSecteur().isBlank()
                && user.getCompetences() != null && !user.getCompetences().isEmpty()
                && user.getBesoin() != null && !user.getBesoin().isBlank()
                && user.getLocalisation() != null
                && user.getLocalisation().getVille() != null
                && !user.getLocalisation().getVille().isBlank();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User toggleSuspend(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActif(!user.isActif());
        return userRepository.save(user);
    }

    // ✅ NOUVEAU
    public User updateLocalisation(String firebaseUid, User.Location localisation) {
        User user = getByFirebaseUid(firebaseUid);
        user.setLocalisation(localisation);
        return userRepository.save(user);
    }

    private void sanitizeAndValidateUser(User user) {
        if (user.getCompetences() == null || user.getCompetences().isEmpty()) {
            throw new IllegalArgumentException("Les competences sont obligatoires");
        }

        List<String> cleaned = user.getCompetences().stream()
                .map(s -> s == null ? "" : s.trim())
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());

        if (cleaned.isEmpty()) {
            throw new IllegalArgumentException("Les competences sont obligatoires");
        }

        user.setCompetences(cleaned);
    }
}