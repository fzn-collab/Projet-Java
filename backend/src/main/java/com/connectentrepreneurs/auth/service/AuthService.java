package com.connectentrepreneurs.auth.service;

import com.connectentrepreneurs.auth.model.AuthRequest;
import com.connectentrepreneurs.auth.model.AuthResponse;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final String ADMIN_EMAIL = "admin@connect.com";
    private static final String ADMIN_PASSWORD = "admin123";

    public AuthResponse login(AuthRequest request) {
        if (ADMIN_EMAIL.equals(request.getEmail()) && ADMIN_PASSWORD.equals(request.getPassword())) {
            return new AuthResponse(
                "mock-jwt-token-" + System.currentTimeMillis(),
                "ADMIN",
                request.getEmail()
            );
        }
        throw new RuntimeException("Email ou mot de passe incorrect");
    }
}
