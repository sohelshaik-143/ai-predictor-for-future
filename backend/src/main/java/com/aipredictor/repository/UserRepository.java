package com.aipredictor.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.aipredictor.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    // Find a user by email (used in login & OAuth2)
    Optional<User> findByEmail(String email);

    // Check if a user with the given email exists
    boolean existsByEmail(String email);

    // Optional: OAuth lookups
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByGithubId(String githubId);
    Optional<User> findByLinkedinId(String linkedinId);
}