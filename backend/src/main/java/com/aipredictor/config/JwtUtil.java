package com.aipredictor.config;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration; // milliseconds

    // =============================
    // Generate Signing Key
    // =============================
    private Key getSigningKey() {

        if (jwtSecret == null || jwtSecret.length() < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must be at least 32 characters long (256 bits).");
        }

        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // =============================
    // Generate JWT Token
    // =============================
    public String generateToken(String username) {

        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // =============================
    // Extract Username
    // =============================
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // =============================
    // Validate Token
    // =============================
    public boolean validateToken(String token, UserDetails userDetails) {

        try {
            final String username = extractUsername(token);

            return username != null
                    && username.equals(userDetails.getUsername())
                    && !isTokenExpired(token);

        } catch (Exception e) {
            logger.warn("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    // =============================
    // Check Expiration
    // =============================
    public boolean isTokenExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    // =============================
    // Extract Claims
    // =============================
    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}