package com.connectentrepreneurs.search.controller;

import com.connectentrepreneurs.search.service.SearchService;
import com.connectentrepreneurs.user.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(SearchController.class)
class SearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SearchService searchService;

    @Test
    void testSearch_WithFilters() throws Exception {
        User u1 = new User();
        u1.setNom("Ahmed");

        when(searchService.search("Java", "FinTech", "Marrakech", "Co-fondateur", "DEVELOPPEUR"))
                .thenReturn(List.of(u1));

        mockMvc.perform(get("/api/search")
                .param("skill", "Java")
                .param("sector", "FinTech")
                .param("location", "Marrakech")
                .param("need", "Co-fondateur")
                .param("typeProfil", "DEVELOPPEUR"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nom").value("Ahmed"));
    }

    @Test
    void testSearch_NoFilters() throws Exception {
        when(searchService.search(any(), any(), any(), any(), any()))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}