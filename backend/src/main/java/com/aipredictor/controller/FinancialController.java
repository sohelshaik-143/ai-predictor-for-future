package com.aipredictor.controller;

import com.aipredictor.model.FinancialRecord;
import com.aipredictor.service.FinancialService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/financial")
public class FinancialController {

    private final FinancialService financialService;

    public FinancialController(FinancialService financialService) {
        this.financialService = financialService;
    }

    // ======================================================
    // ADD FINANCIAL RECORD
    // ======================================================
    @PostMapping("/add")
    public ResponseEntity<?> addFinancialData(
            @RequestBody Map<String, Double> body,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized"));
        }

        try {
            String email = authentication.getName();

            Double income = body.get("income");
            Double expenses = body.get("expenses");

            if (income == null || expenses == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "timestamp", Instant.now(),
                        "status", 400,
                        "error", "Income and expenses are required"
                ));
            }

            FinancialRecord record =
                    financialService.addRecord(email, income, expenses);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "timestamp", Instant.now(),
                    "status", 201,
                    "message", "Financial record added successfully",
                    "data", record
            ));

        } catch (RuntimeException ex) {

            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", Instant.now(),
                    "status", 400,
                    "error", ex.getMessage()
            ));
        }
    }

    // ======================================================
    // GET LOGGED-IN USER RECORDS
    // ======================================================
    @GetMapping("/my-records")
    public ResponseEntity<?> getMyRecords(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized"));
        }

        try {
            String email = authentication.getName();

            List<FinancialRecord> records =
                    financialService.getUserRecords(email);

            return ResponseEntity.ok(Map.of(
                    "timestamp", Instant.now(),
                    "count", records.size(),
                    "data", records
            ));

        } catch (RuntimeException ex) {

            return ResponseEntity.badRequest().body(Map.of(
                    "timestamp", Instant.now(),
                    "status", 400,
                    "error", ex.getMessage()
            ));
        }
    }
}