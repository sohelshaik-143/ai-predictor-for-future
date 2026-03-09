package com.aipredictor.dto;

import java.time.Instant;

public class AuthResponse {

    private Instant timestamp;
    private String accessToken;
    private String tokenType;
    private String userId;     // MongoDB String ID
    private String email;

    // Default constructor (required for JSON serialization)
    public AuthResponse() {
    }

    // Constructor with token only
    public AuthResponse(String accessToken) {
        this.timestamp = Instant.now();
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
    }

    // Full constructor (Recommended)
    public AuthResponse(String accessToken, String userId, String email) {
        this.timestamp = Instant.now();
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.email = email;
    }

    // Getters
    public Instant getTimestamp() {
        return timestamp;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    // Setters (optional but recommended)
    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}