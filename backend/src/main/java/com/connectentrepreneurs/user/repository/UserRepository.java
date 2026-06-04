package com.connectentrepreneurs.user.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.connectentrepreneurs.user.model.User;

public interface UserRepository
        extends MongoRepository<User, String> {

}