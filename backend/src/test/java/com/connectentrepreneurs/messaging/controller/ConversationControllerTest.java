package com.connectentrepreneurs.messaging.controller;

import com.connectentrepreneurs.messaging.model.Conversation;
import com.connectentrepreneurs.messaging.model.Message;
import com.connectentrepreneurs.messaging.service.ConversationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(ConversationController.class)
class ConversationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ConversationService conversationService;

    @Test
    void testGetUserConversations() throws Exception {
        Conversation conv = new Conversation(Arrays.asList("user1", "user2"));
        conv.setId("123");

        when(conversationService.getConversationsByUser("user1"))
                .thenReturn(List.of(conv));

        mockMvc.perform(get("/api/conversations/user/user1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("123"));
    }

    @Test
    void testSendMessage() throws Exception {
        Message message = new Message("123", "user1", "user2", "Test message");

        when(conversationService.sendMessage(anyString(), anyString(), anyString(), anyString()))
                .thenReturn(message);

        String json = """
            {
                "senderId": "user1",
                "receiverId": "user2",
                "content": "Test message"
            }
            """;

        mockMvc.perform(post("/api/conversations/123/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Test message"));
    }

    @Test
    void testGetMessages() throws Exception {
        Message msg = new Message("123", "user1", "user2", "Hello");

        when(conversationService.getMessages("123"))
                .thenReturn(List.of(msg));

        mockMvc.perform(get("/api/conversations/123/messages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value("Hello"));
    }
    @Test
    void testCreateConversation() throws Exception {
        Conversation conv = new Conversation(Arrays.asList("user1", "user2"));
        conv.setId("123");

        when(conversationService.createOrGetConversation("user1", "user2"))
                .thenReturn(conv);

        String json = """
            {
                "user1": "user1",
                "user2": "user2"
            }
            """;

        mockMvc.perform(post("/api/conversations/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("123"));
    }

    @Test
    void testMarkAsRead() throws Exception {
        mockMvc.perform(put("/api/conversations/123/read/user1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetUserConversations_EmptyList() throws Exception {
        when(conversationService.getConversationsByUser("inconnu"))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/conversations/user/inconnu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }
}