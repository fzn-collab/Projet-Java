package com.connectentrepreneurs.messaging.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendNewMessageNotification(String receiverId, String senderName, String content) {
        System.out.println("📩 Notification envoyée à " + receiverId 
            + " : nouveau message de " + senderName 
            + " : " + content);
        // Firebase Cloud Messaging sera intégré ici
    }

    public void sendMatchNotification(String userId, String matchedUserName) {
        System.out.println("🤝 Nouveau match pour " + userId 
            + " avec " + matchedUserName);
    }

    public void sendProjectInvitationNotification(String userId, String projectTitle) {
        System.out.println("📋 Invitation projet pour " + userId 
            + " : " + projectTitle);
    }
}