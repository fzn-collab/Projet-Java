const API_URL = "http://192.168.0.115:8083";

export async function getSuggestions(firebaseUid) {
  const response = await fetch(`${API_URL}/api/matching/suggestions`, {
    headers: {
      "X-User-Id": firebaseUid,
    },
  });

  return response.json();
}

export async function getMatches() {
  const response = await fetch(`${API_URL}/api/matching`);

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
  const response = await fetch(`${API_URL}/api/matching/projects`);

  return response.json();
}
export async function getUser(id) {
  const response = await fetch(`${API_URL}/api/users/${id}`);

  return response.json();
}
