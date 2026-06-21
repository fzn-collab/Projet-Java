package com.connectentrepreneurs.messaging.service;

import com.connectentrepreneurs.messaging.model.Notification;
import com.connectentrepreneurs.messaging.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    public void sendNewMessageNotification(String receiverId, String senderName, String content) {

        Notification n = new Notification(
                receiverId,
                "message",
                "Nouveau message",
                senderName + " : " + content
        );

        repository.save(n);
    }

    public void sendMatchNotification(String userId, String matchedUserName) {

        Notification n = new Notification(
                userId,
                "match",
                "Nouveau match",
                matchedUserName
        );

        repository.save(n);
    }

    public void sendProjectInvitationNotification(String userId, String projectTitle) {

        Notification n = new Notification(
                userId,
                "project",
                "Invitation projet",
                projectTitle
        );

        repository.save(n);
    }

    // 🔥 GET NOTIFICATIONS
    public List<Notification> getUserNotifications(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // 🔥 MARK AS READ
    public void markAsRead(String id) {
        repository.findById(id).ifPresent(n -> {
            n.setRead(true);
            repository.save(n);
        });
    }
}