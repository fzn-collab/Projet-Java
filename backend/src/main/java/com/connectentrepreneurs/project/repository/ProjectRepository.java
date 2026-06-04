package com.connectentrepreneurs.project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.connectentrepreneurs.project.model.Project;

public interface ProjectRepository
        extends MongoRepository<Project,String> {

}