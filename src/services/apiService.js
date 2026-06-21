import axios from "axios";
import { auth } from "./authService";

const API_URL = "http://10.130.182.153:8080";

// =====================
// SAFE UID HELPER
// =====================
function getUid() {
  return auth.currentUser?.uid || null;
}

// =====================
// MATCHING / SUGGESTIONS
// =====================
export async function getSuggestions() {
  const uid = getUid();

  console.log("AUTH UID =", uid);

  if (!uid) return [];

  try {
    const response = await fetch(
      `${API_URL}/api/matching/suggestions`,
      {
        headers: {
          "X-User-Id": uid,
        },
      }
    );

    const data = await response.json().catch(() => []);

    console.log("SUGGESTIONS RAW =", data);

    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.log("SUGGESTIONS ERROR =", e);
    return [];
  }
}

// =====================
export async function getMatches() {
  const uid = getUid();
  if (!uid) return [];

  const response = await fetch(`${API_URL}/api/matching`, {
    headers: {
      "X-User-Id": uid,
    },
  });

  const data = await response.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

// =====================
// USERS
// =====================
export async function getUser(id) {
  if (!id) return null;

  const response = await fetch(`${API_URL}/api/users/${id}`);
  return response.ok ? response.json() : null;
}

export async function getMyProfile() {
  const uid = getUid();
  if (!uid) return null;

  const response = await fetch(`${API_URL}/api/users/me`, {
    headers: {
      "X-User-Id": uid,
    },
  });

  return response.ok ? response.json() : null;
}

export async function getNotifications(userId) {
  const response = await fetch(
    `${API_URL}/api/notifications/${userId}`
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
}

export async function markNotificationAsRead(notificationId) {
  const response = await fetch(
    `${API_URL}/api/notifications/read/${notificationId}`,
    {
      method: "PUT",
    }
  );

  return response.ok;
}
// PROJECTS
export async function getProjectsByUser(userId) {
  try {
    const res = await fetch(`${API_URL}/api/projects/user/${userId}`);

    if (!res.ok) {
      console.log("PROJECTS ERROR STATUS =", res.status);
      return [];
    }

    return await res.json();
  } catch (e) {
    console.log("PROJECTS ERROR =", e);
    return [];
  }
}

// CONVERSATIONS


export async function getUserConversations(userId) {
  try {
    const res = await fetch(`${API_URL}/api/conversations/user/${userId}`); // ← ajoute /user/
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}
export async function getOrCreateConversation(user1, user2) {
  const res = await fetch(`${API_URL}/api/conversations/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user1, user2 }),
  });
  return res.ok ? res.json() : null;
}

export async function getMessages(conversationId) {
  const res = await fetch(`${API_URL}/api/conversations/${conversationId}/messages`);
  return res.ok ? res.json() : [];
}

export async function sendMessage(conversationId, senderId, receiverId, content) {
  const res = await fetch(`${API_URL}/api/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderId, receiverId, content }),
  });
  return res.ok ? res.json() : null;
}

export async function markAsRead(conversationId, userId) {
  await fetch(`${API_URL}/api/conversations/${conversationId}/read/${userId}`, {
    method: "PUT",
  });
}
export async function searchUsers({ skill }) {
  try {
    const params = new URLSearchParams();
    if (skill) params.append("skill", skill);

    const res = await fetch(`${API_URL}/api/search?${params.toString()}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.log("SEARCH ERROR =", e);
    return [];
  }
}