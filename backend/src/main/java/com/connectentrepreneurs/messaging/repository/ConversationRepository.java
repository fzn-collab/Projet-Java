package com.connectentrepreneurs.messaging.repository;

import com.connectentrepreneurs.messaging.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findByParticipantsContaining(String userId);
    Optional<Conversation> findByParticipantsContainingAndParticipantsContaining(String user1, String user2);
}