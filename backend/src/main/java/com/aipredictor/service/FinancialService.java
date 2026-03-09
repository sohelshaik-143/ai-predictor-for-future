package com.aipredictor.service;

import com.aipredictor.model.FinancialRecord;
import com.aipredictor.model.User;
import com.aipredictor.repository.FinancialRecordRepository;
import com.aipredictor.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinancialService {

    private final FinancialRecordRepository recordRepository;
    private final UserRepository userRepository;

    public FinancialService(FinancialRecordRepository recordRepository,
                            UserRepository userRepository) {
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
    }

    // ===============================
    // ADD FINANCIAL DATA
    // ===============================
    public FinancialRecord addRecord(String email,
                                     Double income,
                                     Double expenses) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FinancialRecord record = new FinancialRecord();

        record.setUserId(user.getId());   // ✅ Mongo way

        record.setIncome(income);
        record.setExpenses(expenses);

        Double savings = income - expenses;
        record.setSavings(savings);

        // AI Risk Logic
        record.setRiskLevel(calculateRisk(income, savings));

        return recordRepository.save(record);
    }

    // ===============================
    // GET USER RECORDS
    // ===============================
    public List<FinancialRecord> getUserRecords(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return recordRepository.findByUserId(user.getId());  // ✅ Mongo way
    }

    // ===============================
    // SIMPLE AI RISK CALCULATION
    // ===============================
    private String calculateRisk(Double income, Double savings) {

        if (income == 0) return "HIGH";

        double savingsRatio = (savings / income) * 100;

        if (savingsRatio < 20) return "HIGH";
        if (savingsRatio < 40) return "MEDIUM";

        return "LOW";
    }
}