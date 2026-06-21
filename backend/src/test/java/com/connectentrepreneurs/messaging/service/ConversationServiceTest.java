package com.connectentrepreneurs.messaging.service;

import com.connectentrepreneurs.messaging.model.Conversation;
import com.connectentrepreneurs.messaging.model.Message;
import com.connectentrepreneurs.messaging.repository.ConversationRepository;
import com.connectentrepreneurs.messaging.repository.MessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ConversationServiceTest {

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private MessageRepository messageRepository;

    @InjectMocks
    private ConversationService conversationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateOrGetConversation_NewConversation() {
        // Given
        String user1 = "entrepreneur1";
        String user2 = "entrepreneur2";
        when(conversationRepository.findByParticipantsContaining(user1))
                .thenReturn(List.of());
        when(conversationRepository.save(any(Conversation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Conversation result = conversationService.createOrGetConversation(user1, user2);

        // Then
        assertNotNull(result);
        assertTrue(result.getParticipants().contains(user1));
        assertTrue(result.getParticipants().contains(user2));
        verify(conversationRepository, times(1)).save(any(Conversation.class));
    }

    @Test
    void testCreateOrGetConversation_ExistingConversation() {
        // Given
        String user1 = "entrepreneur1";
        String user2 = "entrepreneur2";
        Conversation existing = new Conversation(Arrays.asList(user1, user2));
        existing.setId("123");

        when(conversationRepository.findByParticipantsContaining(user1))
                .thenReturn(List.of(existing));

        // When
        Conversation result = conversationService.createOrGetConversation(user1, user2);

        // Then
        assertEquals("123", result.getId());
        verify(conversationRepository, never()).save(any(Conversation.class));
    }

    @Test
    void testSendMessage() {
        // Given
        String conversationId = "123";
        String senderId = "entrepreneur1";
        String receiverId = "entrepreneur2";
        String content = "Bonjour !";

        Conversation conversation = new Conversation(Arrays.asList(senderId, receiverId));
        conversation.setId(conversationId);

        when(messageRepository.save(any(Message.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(conversationRepository.findById(conversationId))
                .thenReturn(Optional.of(conversation));

        // When
        Message result = conversationService.sendMessage(conversationId, senderId, receiverId, content);

        // Then
        assertNotNull(result);
        assertEquals(content, result.getContent());
        assertEquals(senderId, result.getSenderId());
        assertFalse(result.isRead());
        verify(messageRepository, times(1)).save(any(Message.class));
        verify(conversationRepository, times(1)).save(any(Conversation.class));
    }

    @Test
    void testGetMessages() {
        // Given
        String conversationId = "123";
        Message msg1 = new Message(conversationId, "user1", "user2", "Hello");
        Message msg2 = new Message(conversationId, "user2", "user1", "Salut");

        when(messageRepository.findByConversationIdOrderByTimestampAsc(conversationId))
                .thenReturn(Arrays.asList(msg1, msg2));

        // When
        List<Message> result = conversationService.getMessages(conversationId);

        // Then
        assertEquals(2, result.size());
        verify(messageRepository, times(1))
                .findByConversationIdOrderByTimestampAsc(conversationId);
    }
    @Test
    void testMarkAsRead() {
        // Given
        String conversationId = "123";
        String userId = "entrepreneur2"; // celui qui reçoit et qui consulte

        Message unreadMsg1 = new Message(conversationId, "entrepreneur1", userId, "Hello");
        unreadMsg1.setRead(false);
        Message unreadMsg2 = new Message("999", "entrepreneur5", userId, "Autre conv");
        unreadMsg2.setRead(false);

        when(messageRepository.findByReceiverIdAndReadFalse(userId))
                .thenReturn(Arrays.asList(unreadMsg1, unreadMsg2));

        // When
        conversationService.markAsRead(conversationId, userId);

        // Then
        // Seul le message de la bonne conversation doit être marqué lu et sauvegardé
        verify(messageRepository, times(1)).save(argThat(msg ->
                msg.getConversationId().equals(conversationId) && msg.isRead()
        ));
    }

    @Test
    void testGetConversationsByUser() {
        // Given
        String userId = "entrepreneur1";
        Conversation conv1 = new Conversation(Arrays.asList(userId, "entrepreneur2"));
        Conversation conv2 = new Conversation(Arrays.asList(userId, "entrepreneur3"));

        when(conversationRepository.findByParticipantsContaining(userId))
                .thenReturn(Arrays.asList(conv1, conv2));

        // When
        List<Conversation> result = conversationService.getConversationsByUser(userId);

        // Then
        assertEquals(2, result.size());
        verify(conversationRepository, times(1)).findByParticipantsContaining(userId);
    }

    @Test
    void testSendMessage_ConversationNotFound() {
        // Given - la conversation n'existe pas mais le message doit quand même être sauvegardé
        String conversationId = "inexistant";
        String senderId = "entrepreneur1";
        String receiverId = "entrepreneur2";
        String content = "Test";

        when(messageRepository.save(any(Message.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(conversationRepository.findById(conversationId))
                .thenReturn(Optional.empty());

        // When
        Message result = conversationService.sendMessage(conversationId, senderId, receiverId, content);

        // Then
        assertNotNull(result);
        verify(conversationRepository, never()).save(any(Conversation.class));
    }

    @Test
    void testGetMessages_EmptyConversation() {
        // Given
        String conversationId = "nouvelle-conv";
        when(messageRepository.findByConversationIdOrderByTimestampAsc(conversationId))
                .thenReturn(List.of());

        // When
        List<Message> result = conversationService.getMessages(conversationId);

        // Then
        assertTrue(result.isEmpty());
    }
}