package com.aipredictor.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "risk_scores")
public class RiskScore {

    @Id
    private String id;   // Mongo ObjectId

    private String userId;   // Changed Long -> String
    private LocalDate date;
    private Integer score;
    private String category;

    // MongoDB handles large text automatically
    private String details;

    // Constructor
    public RiskScore() {
    }

    // ======================
    // Getters & Setters
    // ======================

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}