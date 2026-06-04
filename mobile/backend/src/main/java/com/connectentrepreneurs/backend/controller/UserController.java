package com.connectentrepreneurs.backend.controller;

import com.connectentrepreneurs.backend.model.User;
import com.connectentrepreneurs.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal String uid) {
        return ResponseEntity.ok(userService.getByFirebaseUid(uid));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal String uid,
                                               @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUser(uid, updatedUser));
    }
    @PutMapping("/me/photo")
public ResponseEntity<User> updatePhoto(@AuthenticationPrincipal String uid,
                                         @RequestBody java.util.Map<String, String> body) {
    return ResponseEntity.ok(userService.updatePhoto(uid, body.get("photoUrl")));
}
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/suspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> suspendUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.toggleSuspend(id));
    }
}