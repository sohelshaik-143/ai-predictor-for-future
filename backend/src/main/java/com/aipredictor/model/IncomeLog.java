package com.aipredictor.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "income_logs")
public class IncomeLog {

    @Id
    private String id;   // Mongo uses String (ObjectId)

    private String userId;   // Change Long → String
    private LocalDate date;
    private Double amount;
    private String source;
    private String notes;

    // Constructor
    public IncomeLog() {
    }

    // ======================
    // GETTERS
    // ======================

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public Double getAmount() {
        return amount;
    }

    public String getSource() {
        return source;
    }

    public String getNotes() {
        return notes;
    }

    // ======================
    // SETTERS
    // ======================

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}