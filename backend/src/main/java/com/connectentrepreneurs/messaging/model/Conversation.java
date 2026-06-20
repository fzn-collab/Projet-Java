package com.connectentrepreneurs.messaging.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "conversations")
public class Conversation {
    @Id
    private String id;
    private List<String> participants;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private boolean active;

    public Conversation() {}

    public Conversation(List<String> participants) {
        this.participants = participants;
        this.lastMessageTime = LocalDateTime.now();
        this.active = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public List<String> getParticipants() { return participants; }
    public void setParticipants(List<String> participants) { this.participants = participants; }
    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }
    public LocalDateTime getLastMessageTime() { return lastMessageTime; }
    public void setLastMessageTime(LocalDateTime lastMessageTime) { this.lastMessageTime = lastMessageTime; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}