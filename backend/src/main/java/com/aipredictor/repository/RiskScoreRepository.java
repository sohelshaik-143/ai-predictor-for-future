package com.aipredictor.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

import com.aipredictor.model.RiskScore;

public interface RiskScoreRepository extends MongoRepository<RiskScore, String> {

    List<RiskScore> findByUserId(String userId);

    List<RiskScore> findByUserIdOrderByDateDesc(String userId);
}