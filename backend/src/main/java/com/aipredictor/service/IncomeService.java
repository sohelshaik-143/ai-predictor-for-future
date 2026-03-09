package com.aipredictor.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aipredictor.model.IncomeLog;
import com.aipredictor.repository.IncomeLogRepository;

@Service
public class IncomeService {

    private final IncomeLogRepository incomeLogRepository;

    public IncomeService(IncomeLogRepository incomeLogRepository) {
        this.incomeLogRepository = incomeLogRepository;
    }

    // ===============================
    // ADD INCOME
    // ===============================
    public IncomeLog addIncome(String userId,
                               LocalDate date,
                               Double amount,
                               String source,
                               String notes) {

        IncomeLog log = new IncomeLog();
        log.setUserId(userId);   // String now
        log.setDate(date);
        log.setAmount(amount);
        log.setSource(source);
        log.setNotes(notes);

        return incomeLogRepository.save(log);
    }

    // ===============================
    // TOTAL INCOME FOR USER
    // ===============================
    public Double totalForUser(String userId) {

        List<IncomeLogRepository.TotalAmountResult> result =
                incomeLogRepository.sumByUserId(userId);

        if (result.isEmpty() || result.get(0).getTotal() == null) {
            return 0.0;
        }

        return result.get(0).getTotal();
    }

    // ===============================
    // RECENT INCOME
    // ===============================
    public List<IncomeLog> recentForUser(String userId) {
        return incomeLogRepository.findByUserIdOrderByDateDesc(userId);
    }
}