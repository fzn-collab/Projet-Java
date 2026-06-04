package com.connectentrepreneurs.user.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUser(
            @PathVariable String id) {

        return userService.getUserById(id);
    }

    @PostMapping
    public User createUser(
            @RequestBody User user) {

        return userService.saveUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(
            @PathVariable String id) {

        userService.deleteUser(id);
    }
    

}