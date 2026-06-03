package com.connectentrepreneurs.messaging.repository;

import com.connectentrepreneurs.messaging.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByConversationIdOrderByTimestampAsc(String conversationId);
    List<Message> findByReceiverIdAndReadFalse(String receiverId);
    long countByConversationIdAndReadFalseAndReceiverIdNot(String conversationId, String senderId);
}