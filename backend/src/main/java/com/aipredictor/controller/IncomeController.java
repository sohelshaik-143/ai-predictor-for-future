package com.aipredictor.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.aipredictor.model.IncomeLog;
import com.aipredictor.model.User;
import com.aipredictor.service.IncomeService;
import com.aipredictor.service.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    private final IncomeService incomeService;
    private final UserService userService;

    public IncomeController(IncomeService incomeService,
                            UserService userService) {
        this.incomeService = incomeService;
        this.userService = userService;
    }

    // ===============================
    // DTO
    // ===============================
    public static class AddIncomeRequest {

        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        public Double amount;

        public String date;
        public String source;
        public String notes;
    }

    // ===============================
    // ADD INCOME
    // ===============================
    @PostMapping
    public ResponseEntity<?> addIncome(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddIncomeRequest req) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthenticated"));
        }

        try {
            User user = userService.getUserByEmail(
                    userDetails.getUsername());

            LocalDate date;
            try {
                date = req.date != null
                        ? LocalDate.parse(req.date)
                        : LocalDate.now();
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest().body(Map.of(
                        "timestamp", Instant.now(),
                        "status", 400,
                        "error", "Invalid date format. Use yyyy-MM-dd"
                ));
            }

            String source = req.source != null ? req.source : "manual";
            String notes = req.notes != null ? req.notes : "";

            IncomeLog log = incomeService.addIncome(
                    user.getId(),  // ✅ Mongo String ID
                    date,
                    req.amount,
                    source,
                    notes
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "timestamp", Instant.now(),
                    "status", 201,
                    "message", "Income added successfully",
                    "id", log.getId()
            ));

        } catch (RuntimeException ex) {

            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", Instant.now(),
                    "status", 400,
                    "error", ex.getMessage()
            ));
        }
    }

    // ===============================
    // SUMMARY
    // ===============================
    @GetMapping("/summary")
    public ResponseEntity<?> summary(
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthenticated"));
        }

        try {
            User user = userService.getUserByEmail(
                    userDetails.getUsername());

            Double total = incomeService.totalForUser(user.getId());
            List<IncomeLog> recent =
                    incomeService.recentForUser(user.getId());

            return ResponseEntity.ok(Map.of(
                    "timestamp", Instant.now(),
                    "total", total,
                    "count", recent.size(),
                    "recent", recent
            ));

        } catch (RuntimeException ex) {

            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", Instant.now(),
                    "status", 400,
                    "error", ex.getMessage()
            ));
        }
    }

    // ===============================
    // PREDICT (Stub for AI)
    // ===============================
    @PostMapping("/predict")
    public ResponseEntity<?> predict(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthenticated"));
        }

        return ResponseEntity.ok(Map.of(
                "timestamp", Instant.now(),
                "predicted_next_7d",
                new double[]{100, 110, 90, 95, 120, 80, 105}
        ));
    }
}