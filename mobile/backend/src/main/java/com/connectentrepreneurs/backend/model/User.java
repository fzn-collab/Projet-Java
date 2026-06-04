package com.connectentrepreneurs.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String nom;
    private String email;
    private String secteur;
    private List<String> competences;
    private String besoin;
    private String photoUrl;
    private String role = "USER";
    private String firebaseUid;
    private boolean actif = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}