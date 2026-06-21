package com.connectentrepreneurs.messaging.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String userId;
    private String type;
    private String title;
    private String content;
    private boolean read;
    private LocalDateTime createdAt;

    public Notification() {
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    public Notification(String userId,
                        String type,
                        String title,
                        String content) {

        this.userId = userId;
        this.type = type;
        this.title = title;
        this.content = content;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    // ---------- GETTERS ----------

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public boolean isRead() {
        return read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ---------- SETTERS ----------

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}