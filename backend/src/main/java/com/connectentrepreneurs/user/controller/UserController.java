package com.connectentrepreneurs.user.controller;


import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getProfile(
            @RequestHeader("X-User-Id") String uid) {
        return ResponseEntity.ok(userService.getByFirebaseUid(uid));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @RequestHeader("X-User-Id") String uid,
            @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUser(uid, updatedUser));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(
            @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<User> suspendUser(
            @RequestHeader("X-User-Role") String role,
            @PathVariable String id) {
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(userService.toggleSuspend(id));
    }

    @PutMapping("/me/localisation")
    public ResponseEntity<User> updateLocalisation(
            @RequestHeader("X-User-Id") String uid,
            @RequestBody User.Location localisation) {
        return ResponseEntity.ok(userService.updateLocalisation(uid, localisation));
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {

        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/me/completion")
    public ResponseEntity<Boolean> isProfileComplete(
            @RequestHeader("X-User-Id") String uid) {

        User user = userService.getByFirebaseUid(uid);
        return ResponseEntity.ok(userService.isProfileComplete(user));
    }

    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestHeader("X-User-Role") String role,
            @RequestBody User user) {
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<User> updateUserById(
            @RequestHeader("X-User-Role") String role,
            @PathVariable String id,
            @RequestBody User updatedUser) {
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(userService.updateUserById(id, updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @RequestHeader("X-User-Role") String role,
            @PathVariable String id) {
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).build();
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/validate")
    public ResponseEntity<User> validateProfile(
            @RequestHeader("X-User-Role") String role,
            @PathVariable String id) {
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(userService.validateProfile(id));
    }

}