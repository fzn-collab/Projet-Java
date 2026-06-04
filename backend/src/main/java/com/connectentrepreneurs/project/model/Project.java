package com.connectentrepreneurs.project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "projects")
public class Project {

    @Id
    private String id;
    private String titre;
    private String secteur;
    private String description;
    private String besoin;
    private String ownerId;
    private String statut;
    private LocalDateTime createdAt;
    private List<String> tags;

    public Project() {
        this.createdAt = LocalDateTime.now();
        this.statut = "actif";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    public String getSecteur() { return secteur; }
    public void setSecteur(String secteur) { this.secteur = secteur; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getBesoin() { return besoin; }
    public void setBesoin(String besoin) { this.besoin = besoin; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
