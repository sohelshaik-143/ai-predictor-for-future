package com.aipredictor.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "financial_records")
public class FinancialRecord {

    @Id
    private String id;

    private Double income;
    private Double expenses;
    private Double savings;

    private String riskLevel;

    private LocalDateTime createdAt;

    // Instead of @ManyToOne relationship
    // We store userId manually
    private String userId;

    // Constructor
    public FinancialRecord() {
        this.createdAt = LocalDateTime.now();
    }

    // ======================
    // Getters and Setters
    // ======================

    public String getId() {
        return id;
    }

    public Double getIncome() {
        return income;
    }

    public void setIncome(Double income) {
        this.income = income;
    }

    public Double getExpenses() {
        return expenses;
    }

    public void setExpenses(Double expenses) {
        this.expenses = expenses;
    }

    public Double getSavings() {
        return savings;
    }

    public void setSavings(Double savings) {
        this.savings = savings;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}