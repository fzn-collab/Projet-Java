package com.connectentrepreneurs.user.repository;

import com.connectentrepreneurs.user.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByFirebaseUid(String firebaseUid);
    Optional<User> findByEmail(String email);
    List<User> findBySecteur(String secteur);
    List<User> findByCompetencesContaining(String competence);
}