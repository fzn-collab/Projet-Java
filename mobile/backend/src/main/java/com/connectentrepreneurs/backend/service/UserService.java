package com.connectentrepreneurs.backend.service;

import com.connectentrepreneurs.backend.model.User;
import com.connectentrepreneurs.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
    public User updatePhoto(String firebaseUid, String photoUrl) {
    User user = getByFirebaseUid(firebaseUid);
    user.setPhotoUrl(photoUrl);
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
}