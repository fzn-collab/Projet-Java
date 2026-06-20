package com.connectentrepreneurs.user.service;


import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {


    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {

        if (user.getFirebaseUid() != null) {
            Optional<User> existingByUid =
                    userRepository.findByFirebaseUid(user.getFirebaseUid());

            if (existingByUid.isPresent()) {
                return existingByUid.get();
            }
        }

        if (user.getEmail() != null) {
            Optional<User> existingByEmail =
                    userRepository.findByEmail(user.getEmail());

            if (existingByEmail.isPresent()) {
                return existingByEmail.get();
            }
        }

        return userRepository.save(user);
    }
    public User getByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(String firebaseUid, User updatedUser) {
        User user = getByFirebaseUid(firebaseUid);
        user.setNom(updatedUser.getNom());
        user.setSecteur(updatedUser.getSecteur());
        user.setCompetences(updatedUser.getCompetences());
        user.setBesoin(updatedUser.getBesoin());
        user.setTypeProfil(updatedUser.getTypeProfil());
        user.setLocalisation(updatedUser.getLocalisation());
        return userRepository.save(user);
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

    public User updateLocalisation(String firebaseUid, User.Location localisation) {
        User user = getByFirebaseUid(firebaseUid);
        user.setLocalisation(localisation);
        return userRepository.save(user);
    }
    
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    public boolean isProfileComplete(User user) {
        return user.getNom() != null && !user.getNom().isBlank()
            && user.getTypeProfil() != null && !user.getTypeProfil().isBlank()
            && user.getSecteur() != null && !user.getSecteur().isBlank()
            && user.getCompetences() != null && !user.getCompetences().isEmpty()
            && user.getBesoin() != null && !user.getBesoin().isBlank()
            && user.getLocalisation() != null
            && user.getLocalisation().getVille() != null
            && !user.getLocalisation().getVille().isBlank()
            && user.getLocalisation().getPays() != null
            && !user.getLocalisation().getPays().isBlank();
    }

}