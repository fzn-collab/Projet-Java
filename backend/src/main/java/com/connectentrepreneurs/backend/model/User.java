package com.connectentrepreneurs.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;
    @NotBlank(message = "Le secteur est obligatoire")
    private String secteur;
    private List<String> competences;
    @NotBlank(message = "Le besoin est obligatoire")
    private String besoin;
    private String photoUrl;
    private String role = "USER";
    private String firebaseUid;
    private boolean actif = true;
    private LocalDateTime createdAt = LocalDateTime.now();

    // ✅ NOUVEAU
    @Valid
    private Location localisation;

    @Data
    public static class Location {
        private double latitude;
        private double longitude;
        @NotBlank(message = "La ville est obligatoire")
        private String ville;    // ex: "Casablanca"
        private String pays;     // ex: "Maroc"
    }
}