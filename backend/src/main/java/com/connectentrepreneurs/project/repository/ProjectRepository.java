
package com.connectentrepreneurs.project.repository;

import com.connectentrepreneurs.project.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {

    List<Project> findByOwnerId(String ownerId);
    List<Project> findByStatut(String statut);
    List<Project> findBySecteur(String secteur);
    long countByStatut(String statut);
}

