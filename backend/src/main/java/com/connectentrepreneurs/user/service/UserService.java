package com.connectentrepreneurs.user.service;

import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
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
}