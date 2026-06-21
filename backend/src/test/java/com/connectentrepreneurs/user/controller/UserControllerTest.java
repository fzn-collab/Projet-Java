package com.connectentrepreneurs.user.controller;

import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.service.UserService;
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
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void testRegister() throws Exception {
        User user = new User();
        user.setId("1");
        user.setNom("Ahmed");

        when(userService.createUser(any(User.class))).thenReturn(user);

        String json = """
            {
                "nom": "Ahmed",
                "email": "ahmed@test.com"
            }
            """;

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Ahmed"));
    }

    @Test
    void testGetProfile() throws Exception {
        User user = new User();
        user.setFirebaseUid("uid123");
        user.setNom("Ahmed");

        when(userService.getByFirebaseUid("uid123")).thenReturn(user);

        mockMvc.perform(get("/api/users/me")
                .header("X-User-Id", "uid123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Ahmed"));
    }

    @Test
    void testUpdateProfile() throws Exception {
        User updated = new User();
        updated.setNom("Nouveau Nom");

        when(userService.updateUser(anyString(), any(User.class))).thenReturn(updated);

        String json = """
            {
                "nom": "Nouveau Nom"
            }
            """;

        mockMvc.perform(put("/api/users/me")
                .header("X-User-Id", "uid123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Nouveau Nom"));
    }

    @Test
    void testGetAllUsers_AsAdmin() throws Exception {
        User u1 = new User();
        User u2 = new User();

        when(userService.getAllUsers()).thenReturn(Arrays.asList(u1, u2));

        mockMvc.perform(get("/api/users")
                .header("X-User-Role", "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testGetAllUsers_AsNonAdmin_Forbidden() throws Exception {
        mockMvc.perform(get("/api/users")
                .header("X-User-Role", "USER"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testSuspendUser_AsAdmin() throws Exception {
        User user = new User();
        user.setId("1");
        user.setActif(false);

        when(userService.toggleSuspend("1")).thenReturn(user);

        mockMvc.perform(put("/api/users/1/suspend")
                .header("X-User-Role", "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.actif").value(false));
    }

    @Test
    void testSuspendUser_AsNonAdmin_Forbidden() throws Exception {
        mockMvc.perform(put("/api/users/1/suspend")
                .header("X-User-Role", "USER"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUpdateLocalisation() throws Exception {
        User user = new User();
        User.Location loc = new User.Location();
        loc.setVille("Marrakech");
        loc.setPays("Maroc");
        user.setLocalisation(loc);

        when(userService.updateLocalisation(anyString(), any(User.Location.class)))
                .thenReturn(user);

        String json = """
            {
                "ville": "Marrakech",
                "pays": "Maroc",
                "latitude": 31.6,
                "longitude": -8.0
            }
            """;

        mockMvc.perform(put("/api/users/me/localisation")
                .header("X-User-Id", "uid123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.localisation.ville").value("Marrakech"));
    }

    @Test
    void testGetUserById_Found() throws Exception {
        User user = new User();
        user.setId("1");
        user.setNom("Ahmed");

        when(userService.getUserById("1")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Ahmed"));
    }

    @Test
    void testGetUserById_NotFound() throws Exception {
        when(userService.getUserById("inconnu")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/inconnu"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testIsProfileComplete_True() throws Exception {
        User user = new User();
        user.setFirebaseUid("uid123");

        when(userService.getByFirebaseUid("uid123")).thenReturn(user);
        when(userService.isProfileComplete(user)).thenReturn(true);

        mockMvc.perform(get("/api/users/me/completion")
                .header("X-User-Id", "uid123"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void testIsProfileComplete_False() throws Exception {
        User user = new User();
        user.setFirebaseUid("uid123");

        when(userService.getByFirebaseUid("uid123")).thenReturn(user);
        when(userService.isProfileComplete(user)).thenReturn(false);

        mockMvc.perform(get("/api/users/me/completion")
                .header("X-User-Id", "uid123"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }
}