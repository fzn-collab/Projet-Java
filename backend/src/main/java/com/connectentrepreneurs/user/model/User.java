package com.connectentrepreneurs.user.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
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
    private Location localisation;

    public static class Location {
        private double latitude;
        private double longitude;
        private String ville;
        private String pays;

        public double getLatitude() { return latitude; }
        public void setLatitude(double latitude) { this.latitude = latitude; }
        public double getLongitude() { return longitude; }
        public void setLongitude(double longitude) { this.longitude = longitude; }
        public String getVille() { return ville; }
        public void setVille(String ville) { this.ville = ville; }
        public String getPays() { return pays; }
        public void setPays(String pays) { this.pays = pays; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSecteur() { return secteur; }
    public void setSecteur(String secteur) { this.secteur = secteur; }
    public List<String> getCompetences() { return competences; }
    public void setCompetences(List<String> competences) { this.competences = competences; }
    public String getBesoin() { return besoin; }
    public void setBesoin(String besoin) { this.besoin = besoin; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getFirebaseUid() { return firebaseUid; }
    public void setFirebaseUid(String firebaseUid) { this.firebaseUid = firebaseUid; }
    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Location getLocalisation() { return localisation; }
    public void setLocalisation(Location localisation) { this.localisation = localisation; }
}