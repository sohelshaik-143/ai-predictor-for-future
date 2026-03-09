package com.aipredictor.config;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.aipredictor.model.User;
import com.aipredictor.repository.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomOAuth2UserService(UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest
                .getClientRegistration()
                .getRegistrationId()
                .toLowerCase();

        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Extract email & name
        String rawEmail = extractEmail(attributes);
        String name = extractName(attributes, registrationId);

        if (rawEmail == null || rawEmail.isBlank()) {
            throw new OAuth2AuthenticationException(
                    "Email not provided by OAuth provider");
        }

        String email = rawEmail.toLowerCase().trim();

        // Find existing user OR create new
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(email, name));

        // Update provider ID if needed
        updateProviderId(user, attributes, registrationId);

        userRepository.save(user);

        return new DefaultOAuth2User(
                mapRolesToAuthorities(user.getRoles()),
                attributes,
                "email"
        );
    }

    // ==============================
    // CREATE NEW USER
    // ==============================
    private User createNewUser(String email, String name) {

        User user = new User();
        user.setEmail(email);
        user.setName(name != null ? name : "OAuth User");
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setRoles(Set.of("ROLE_USER"));
        user.setEnabled(true);
        user.setAccountNonLocked(true);

        return user;
    }

    // ==============================
    // UPDATE PROVIDER ID
    // ==============================
    private void updateProviderId(User user,
                                  Map<String, Object> attributes,
                                  String registrationId) {

        switch (registrationId) {

            case "google" -> {
                if (user.getGoogleId() == null) {
                    user.setGoogleId((String) attributes.get("sub"));
                }
            }

            case "github" -> {
                if (user.getGithubId() == null && attributes.get("id") != null) {
                    user.setGithubId(String.valueOf(attributes.get("id")));
                }
            }

            case "linkedin" -> {
                if (user.getLinkedinId() == null && attributes.get("id") != null) {
                    user.setLinkedinId(String.valueOf(attributes.get("id")));
                }
            }
        }
    }

    // ==============================
    // EXTRACT EMAIL
    // ==============================
    private String extractEmail(Map<String, Object> attributes) {
        return (String) attributes.get("email");
    }

    // ==============================
    // EXTRACT NAME
    // ==============================
    private String extractName(Map<String, Object> attributes,
                               String registrationId) {

        if (attributes.containsKey("name")) {
            return (String) attributes.get("name");
        }

        if ("github".equals(registrationId) &&
                attributes.containsKey("login")) {
            return (String) attributes.get("login");
        }

        return "OAuth User";
    }

    // ==============================
    // MAP ROLES TO AUTHORITIES
    // ==============================
    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(
            Set<String> roles) {

        if (roles == null || roles.isEmpty()) {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }
}