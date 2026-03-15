package com.aipredictor.controller;

import com.aipredictor.model.Job;
import com.aipredictor.repository.JobRepository;
import com.aipredictor.config.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final JwtUtil jwtUtil;

    public JobController(JobRepository jobRepository, JwtUtil jwtUtil) {
        this.jobRepository = jobRepository;
        this.jwtUtil = jwtUtil;
    }

    // ── GET all active jobs (public, no auth) ────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category) {

        List<Job> jobs;
        if (city != null && !city.isBlank())
            jobs = jobRepository.findByCityIgnoreCaseAndActiveTrue(city);
        else if (category != null && !category.isBlank())
            jobs = jobRepository.findByCategoryIgnoreCaseAndActiveTrue(category);
        else
            jobs = jobRepository.findByActiveTrueOrderByFeaturedDescCreatedAtDesc();

        return ResponseEntity.ok(jobs);
    }

    // ── GET single job (public) ───────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getJob(@PathVariable String id) {
        return jobRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── POST new job (any logged-in user) ─────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> postJob(
            @RequestBody Job job,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required to post a job"));
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            job.setPostedBy(email);
            job.setActive(true);
            job.setCreatedAt(Instant.now());
            job.setUpdatedAt(Instant.now());
            if (job.getExpiresAt() == null)
                job.setExpiresAt(Instant.now().plusSeconds(30L * 24 * 3600)); // 30 days

            Job saved = jobRepository.save(job);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "id", saved.getId(),
                    "message", "Job posted successfully",
                    "title", saved.getTitle()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── PATCH toggle active (admin only — poster or admin email) ─────────────
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> toggleJob(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Auth required"));
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);

            Optional<Job> opt = jobRepository.findById(id);
            if (opt.isEmpty()) return ResponseEntity.notFound().build();

            Job job = opt.get();
            // Allow toggle if poster or admin
            String adminEmail = System.getenv("ADMIN_EMAIL");
            if (!email.equals(job.getPostedBy()) && !email.equals(adminEmail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only the job poster or admin can toggle this"));
            }

            job.setActive(!job.isActive());
            job.setUpdatedAt(Instant.now());
            jobRepository.save(job);

            return ResponseEntity.ok(Map.of(
                    "id", job.getId(),
                    "active", job.isActive(),
                    "message", job.isActive() ? "Job is now live" : "Job has been deactivated"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── DELETE job (poster or admin only) ─────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Auth required"));
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            String adminEmail = System.getenv("ADMIN_EMAIL");

            Optional<Job> opt = jobRepository.findById(id);
            if (opt.isEmpty()) return ResponseEntity.notFound().build();

            Job job = opt.get();
            if (!email.equals(job.getPostedBy()) && !email.equals(adminEmail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not authorized"));
            }

            jobRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Job deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── GET my posted jobs ─────────────────────────────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<?> myJobs(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Auth required"));
        }
        String email = jwtUtil.extractUsername(authHeader.substring(7));
        return ResponseEntity.ok(jobRepository.findByPostedBy(email));
    }
}
