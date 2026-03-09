package com.aipredictor.controller;

import com.aipredictor.dto.AuthResponse;
import com.aipredictor.dto.LoginRequest;
import com.aipredictor.dto.RegisterRequest;
import com.aipredictor.model.User;
import com.aipredictor.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // ======================================================
    // REGISTER
    // ======================================================
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        try {
            User user = userService.register(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "timestamp", Instant.now(),
                    "status", 201,
                    "message", "User registered successfully",
                    "id", user.getId(),   // ✅ String (Mongo ID)
                    "email", user.getEmail()
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
    // LOGIN
    // ======================================================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        try {
            String token = userService.authenticate(
                    request.getEmail(),
                    request.getPassword()
            );

            return ResponseEntity.ok(
                    new AuthResponse(token)
            );

        } catch (RuntimeException ex) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "timestamp", Instant.now(),
                    "status", 401,
                    "error", "Invalid email or password"
            ));
        }
    }
}