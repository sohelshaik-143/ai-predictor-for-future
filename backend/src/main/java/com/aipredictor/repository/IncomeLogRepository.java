package com.aipredictor.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Aggregation;

import com.aipredictor.model.IncomeLog;

public interface IncomeLogRepository extends MongoRepository<IncomeLog, String> {

    // Find by userId sorted by date descending
    List<IncomeLog> findByUserIdOrderByDateDesc(String userId);

    // Mongo Aggregation to calculate total income
    @Aggregation(pipeline = {
        "{ '$match': { 'userId': ?0 } }",
        "{ '$group': { '_id': null, 'total': { '$sum': '$amount' } } }"
    })
    List<TotalAmountResult> sumByUserId(String userId);

    interface TotalAmountResult {
        Double getTotal();
    }
}