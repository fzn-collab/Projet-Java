package com.connectentrepreneurs.messaging.controller;

import com.connectentrepreneurs.messaging.model.Conversation;
import com.connectentrepreneurs.messaging.model.Message;
import com.connectentrepreneurs.messaging.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "*")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    // GET toutes les conversations d'un utilisateur
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Conversation>> getUserConversations(@PathVariable String userId) {
        return ResponseEntity.ok(conversationService.getConversationsByUser(userId));
    }

    // POST créer ou récupérer une conversation entre 2 users
    @PostMapping("/create")
    public ResponseEntity<Conversation> createConversation(@RequestBody Map<String, String> body) {
        String user1 = body.get("user1");
        String user2 = body.get("user2");
        return ResponseEntity.ok(conversationService.createOrGetConversation(user1, user2));
    }

    // POST envoyer un message
    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<Message> sendMessage(
            @PathVariable String conversationId,
            @RequestBody Map<String, String> body) {
        String senderId = body.get("senderId");
        String receiverId = body.get("receiverId");
        String content = body.get("content");
        Message message = conversationService.sendMessage(conversationId, senderId, receiverId, content);
        return ResponseEntity.ok(message);
    }

    // GET messages d'une conversation
    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String conversationId) {
        return ResponseEntity.ok(conversationService.getMessages(conversationId));
    }

    // PUT marquer messages comme lus
    @PutMapping("/{conversationId}/read/{userId}")
    public ResponseEntity<?> markAsRead(
            @PathVariable String conversationId,
            @PathVariable String userId) {
        conversationService.markAsRead(conversationId, userId);
        return ResponseEntity.ok("Messages marqués comme lus");
    }
}