package com.connectentrepreneurs.backend.controller;

import com.connectentrepreneurs.backend.model.User;
import com.connectentrepreneurs.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getProfile(
            Authentication authentication,
            @RequestHeader(value = "X-User-Id", required = false) String uid) {
        uid = resolveUid(authentication, uid);
        return ResponseEntity.ok(userService.getByFirebaseUid(uid));
    }

    @PostMapping("/me/sync")
    public ResponseEntity<User> syncFirebaseUser(
            Authentication authentication,
            @RequestBody(required = false) Map<String, String> payload) {
        String uid = resolveUid(authentication, null);
        String email = payload == null ? null : payload.get("email");
        String nom = payload == null ? null : payload.get("nom");
        String photoUrl = payload == null ? null : payload.get("photoUrl");
        return ResponseEntity.ok(userService.syncFirebaseUser(uid, email, nom, photoUrl));
    }

    @GetMapping("/me/completion")
    public ResponseEntity<Boolean> isProfileComplete(
            Authentication authentication,
            @RequestHeader(value = "X-User-Id", required = false) String uid) {
        uid = resolveUid(authentication, uid);
        User user = userService.getByFirebaseUid(uid);
        return ResponseEntity.ok(userService.isProfileComplete(user));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            Authentication authentication,
            @RequestHeader(value = "X-User-Id", required = false) String uid,
            @Valid @RequestBody User updatedUser) {
        uid = resolveUid(authentication, uid);
        return ResponseEntity.ok(userService.updateUser(uid, updatedUser));
    }

    @PutMapping("/me/photo")
    public ResponseEntity<User> updatePhoto(
            Authentication authentication,
            @RequestHeader(value = "X-User-Id", required = false) String uid,
            @RequestBody Map<String, String> payload) {
        uid = resolveUid(authentication, uid);
        String photoUrl = payload.get("photoUrl");
        return ResponseEntity.ok(userService.updatePhoto(uid, photoUrl));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(
            Authentication authentication,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!isAdmin(authentication, role)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<User> suspendUser(
            Authentication authentication,
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @PathVariable String id) {
        if (!isAdmin(authentication, role)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(userService.toggleSuspend(id));
    }

    // ✅ NOUVEAU
    @PutMapping("/me/localisation")
    public ResponseEntity<User> updateLocalisation(
            Authentication authentication,
            @RequestHeader(value = "X-User-Id", required = false) String uid,
            @Valid @RequestBody User.Location localisation) {
        uid = resolveUid(authentication, uid);
        return ResponseEntity.ok(userService.updateLocalisation(uid, localisation));
    }

    private String resolveUid(Authentication authentication, String fallbackUid) {
        if (authentication != null && authentication.getName() != null
                && !authentication.getName().isBlank()) {
            return authentication.getName();
        }
        if (fallbackUid != null && !fallbackUid.isBlank()) {
            return fallbackUid;
        }
        throw new RuntimeException("Unauthorized");
    }

    private boolean isAdmin(Authentication authentication, String fallbackRole) {
        if (authentication != null && authentication.getAuthorities() != null) {
            for (GrantedAuthority authority : authentication.getAuthorities()) {
                if ("ROLE_ADMIN".equals(authority.getAuthority())) {
                    return true;
                }
            }
        }
        return "ADMIN".equals(fallbackRole);
    }
}