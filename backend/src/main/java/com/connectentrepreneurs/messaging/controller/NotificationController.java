package com.connectentrepreneurs.messaging.controller;

import com.connectentrepreneurs.messaging.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/message")
    public ResponseEntity<?> notifyNewMessage(@RequestBody Map<String, String> body) {
        notificationService.sendNewMessageNotification(
            body.get("receiverId"),
            body.get("senderName"),
            body.get("content")
        );
        return ResponseEntity.ok("Notification envoyée");
    }

    @PostMapping("/match")
    public ResponseEntity<?> notifyMatch(@RequestBody Map<String, String> body) {
        notificationService.sendMatchNotification(
            body.get("userId"),
            body.get("matchedUserName")
        );
        return ResponseEntity.ok("Notification match envoyée");
    }

    @PostMapping("/project")
    public ResponseEntity<?> notifyProjectInvitation(@RequestBody Map<String, String> body) {
        notificationService.sendProjectInvitationNotification(
            body.get("userId"),
            body.get("projectTitle")
        );
        return ResponseEntity.ok("Invitation envoyée");
    }
}