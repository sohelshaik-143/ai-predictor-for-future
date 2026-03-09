package com.aipredictor.repository;

import com.aipredictor.model.FinancialRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FinancialRecordRepository
        extends MongoRepository<FinancialRecord, String> {

    List<FinancialRecord> findByUserId(String userId);
}