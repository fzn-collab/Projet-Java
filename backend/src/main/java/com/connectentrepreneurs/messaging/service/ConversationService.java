package com.connectentrepreneurs.messaging.service;

import com.connectentrepreneurs.messaging.model.Conversation;
import com.connectentrepreneurs.messaging.model.Message;
import com.connectentrepreneurs.messaging.repository.ConversationRepository;
import com.connectentrepreneurs.messaging.repository.MessageRepository;
import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ConversationService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public List<Conversation> getConversationsByUser(String userId) {
        return conversationRepository.findByParticipantsContaining(userId);
    }

    public Conversation createOrGetConversation(String user1, String user2) {
        List<Conversation> convs = conversationRepository.findByParticipantsContaining(user1);
        for (Conversation c : convs) {
            if (c.getParticipants().contains(user2)) {
                return c;
            }
        }
        Conversation conv = new Conversation(Arrays.asList(user1, user2));
        return conversationRepository.save(conv);
    }

    public Message sendMessage(String conversationId, String senderId, String receiverId, String content) {
        Message message = new Message(conversationId, senderId, receiverId, content);
        Message saved = messageRepository.save(message);

        // update last message
        conversationRepository.findById(conversationId).ifPresent(conv -> {
            conv.setLastMessage(content);
            conv.setLastMessageTime(LocalDateTime.now());
            conversationRepository.save(conv);
        });

        // envoyer notification au receiver
        String senderName = userRepository.findById(senderId)
                .map(User::getNom)
                .orElse("Quelqu'un");

        notificationService.sendNewMessageNotification(receiverId, senderName, content);

        return saved;
    }

    public List<Message> getMessages(String conversationId) {
        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    public void markAsRead(String conversationId, String userId) {
        List<Message> unread = messageRepository.findByReceiverIdAndReadFalse(userId);
        unread.forEach(msg -> {
            if (msg.getConversationId().equals(conversationId)) {
                msg.setRead(true);
                messageRepository.save(msg);
            }
        });
    }
}