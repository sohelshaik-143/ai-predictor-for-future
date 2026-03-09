package com.aipredictor.service;

import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aipredictor.config.JwtUtil;
import com.aipredictor.model.User;
import com.aipredictor.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // ============================================
    // REGISTER USER
    // ============================================
    public User register(String name, String email, String password) {

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email cannot be empty");
        }

        if (password == null || password.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        String normalizedEmail = email.toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(name != null ? name.trim() : "");
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(Set.of("ROLE_USER"));
        user.setEnabled(true);
        user.setAccountNonLocked(true);

        return userRepository.save(user);
    }

    // ============================================
    // AUTHENTICATE USER (LOGIN)
    // ============================================
    public String authenticate(String email, String password) {

        if (email == null || password == null) {
            throw new RuntimeException("Invalid email or password");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email.toLowerCase().trim(),
                        password
                )
        );

        return jwtUtil.generateToken(authentication.getName());
    }

    // ============================================
    // GET USER BY EMAIL
    // ============================================
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ============================================
    // CHECK EMAIL EXISTS
    // ============================================
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email.toLowerCase().trim());
    }
}