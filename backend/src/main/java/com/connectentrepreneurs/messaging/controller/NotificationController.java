package com.connectentrepreneurs.messaging.controller;

import com.connectentrepreneurs.messaging.model.Notification;
import com.connectentrepreneurs.messaging.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{userId}")
    public List<Notification> getUserNotifications(@PathVariable String userId) {
        return notificationService.getUserNotifications(userId);
    }

    @PostMapping("/message")
    public ResponseEntity<?> notifyMessage(@RequestBody Map<String, String> body) {
        notificationService.sendNewMessageNotification(
                body.get("receiverId"),
                body.get("senderName"),
                body.get("content")
        );
        return ResponseEntity.ok("ok");
    }

    @PutMapping("/read/{id}")
    public ResponseEntity<?> markRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("read");
    }
}