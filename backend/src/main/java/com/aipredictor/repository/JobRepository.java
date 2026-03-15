package com.aipredictor.repository;

import com.aipredictor.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByActiveTrue();
    List<Job> findByCityIgnoreCaseAndActiveTrue(String city);
    List<Job> findByCategoryIgnoreCaseAndActiveTrue(String category);
    List<Job> findByActiveTrueOrderByFeaturedDescCreatedAtDesc();
    List<Job> findByPostedBy(String email);
}
