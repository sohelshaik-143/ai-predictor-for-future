package com.aipredictor.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "users")
public class User {

    @Id
    private String id;   // Mongo ObjectId

    private String name;
    private String email;

    // 🔒 Encrypted password
    private String password;

    // OAuth IDs
    private String googleId;
    private String githubId;
    private String linkedinId;

    // 🔐 Roles (Mongo supports arrays directly)
    private Set<String> roles = new HashSet<>();

    // Account status
    private boolean enabled = true;
    private boolean accountNonLocked = true;

    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ===============================
    // Auto timestamp
    // ===============================
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // ===============================
    // Getters and Setters
    // ===============================

    public String getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }

    public String getGithubId() { return githubId; }
    public void setGithubId(String githubId) { this.githubId = githubId; }

    public String getLinkedinId() { return linkedinId; }
    public void setLinkedinId(String linkedinId) { this.linkedinId = linkedinId; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public boolean isAccountNonLocked() { return accountNonLocked; }
    public void setAccountNonLocked(boolean accountNonLocked) { this.accountNonLocked = accountNonLocked; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}