import axios from "axios";
import { auth } from "./authService";

const API_URL = "http://192.168.0.105:8083";

export async function getSuggestions() {
  const uid = auth.currentUser?.uid;

  const response = await fetch(`${API_URL}/api/matching/suggestions`, {
    headers: {
      "X-User-Id": uid,
    },
  });

  return response.json();
}

export async function getMatches() {
  const uid = auth.currentUser?.uid;

  const response = await fetch(`${API_URL}/api/matching`, {
    headers: {
      "X-User-Id": uid,
    },
  });

  return response.json();
}

export async function searchUsers(filters) {
  const params = new URLSearchParams();

  if (filters.skill) params.append("skill", filters.skill);

  if (filters.sector) params.append("sector", filters.sector);

  if (filters.location) params.append("location", filters.location);

  if (filters.need) params.append("need", filters.need);

  const response = await fetch(`${API_URL}/api/search?${params}`);

  return response.json();
}

export async function searchProjects(filters) {
  const params = new URLSearchParams();

  if (filters.secteur) params.append("secteur", filters.secteur);

  if (filters.besoin) params.append("besoin", filters.besoin);

  const response = await fetch(`${API_URL}/api/search/projects?${params}`);

  return response.json();
}

export async function getProjectMatches() {
  const uid = auth.currentUser?.uid;

  const response = await fetch(`${API_URL}/api/matching/projects`, {
    headers: {
      "X-User-Id": uid,
    },
  });

  return response.json();
}
export async function getUser(id) {
  const response = await fetch(`${API_URL}/api/users/${id}`);

  return response.json();
}

export async function getProfileCompletion() {
  const uid = auth.currentUser?.uid;

  const response = await fetch(`${API_URL}/api/users/me/completion`, {
    headers: {
      "X-User-Id": uid,
    },
  });

  return response.json();
}

export async function updateMyProfile(profile) {
  const uid = auth.currentUser?.uid;

  console.log("UID:", uid);
  console.log("URL UPDATE:", `${API_URL}/api/users/me`);
  console.log("PROFILE:", profile);

  const response = await axios.put(`${API_URL}/api/users/me`, profile, {
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": uid,
    },
  });

  console.log("UPDATE RESPONSE:", response.data);

  return response.data;
}

export async function getMyProfile() {
  const uid = auth.currentUser?.uid;

  const response = await fetch(`${API_URL}/api/users/me`, {
    headers: {
      "X-User-Id": uid,
    },
  });

  return response.json();
}
