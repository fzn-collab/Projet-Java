# Connecto — Inventaire des appels API (dossier `/mobile`)

> Base URL Spring Boot utilisée dans le code :
> - `http://10.130.182.153:8080` — `src/services/apiService.js`
> - `http://10.0.2.2:8080` — `src/screens/RegisterScreen.js` (émulateur Android)
>
> **Note :** ces deux URLs pointent probablement vers le même backend avec des hôtes différents selon l'environnement. À unifier avant la mise en production.

---

## Auth

### POST `/api/users/register`

| Champ | Valeur |
|---|---|
| **Fichier** | `src/screens/RegisterScreen.js` |
| **Méthode** | `POST` |
| **Headers** | `Authorization: Bearer {firebaseIdToken}` |
| **Payload** | Voir ci-dessous |
| **Réponse** | Non exploitée dans le code (pas de parsing) |

```json
{
  "nom": "string",
  "email": "string",
  "secteur": "string",
  "competences": ["string"],
  "besoin": "string",
  "firebaseUid": "string"
}
```

**Flux :** Firebase `createUserWithEmailAndPassword` → récupération du token Firebase → enregistrement du profil métier côté Spring Boot.

---

### Authentification Firebase (hors Spring Boot)

Ces appels ne passent **pas** par le backend Spring Boot, mais font partie du flux Auth :

| Action | SDK | Fichier |
|---|---|---|
| Inscription email/mot de passe | `createUserWithEmailAndPassword` | `src/services/authService.js` |
| Connexion email/mot de passe | `signInWithEmailAndPassword` | `src/services/authService.js` |
| Connexion Google | `signInWithPopup` + `GoogleAuthProvider` | `src/services/authService.js` |
| Réinitialisation mot de passe | `sendPasswordResetEmail` | `src/services/authService.js` |

---

## Profil

### GET `/api/users/{id}`

| Champ | Valeur |
|---|---|
| **Fichier** | `src/services/apiService.js` → `getUser(id)` |
| **Méthode** | `GET` |
| **Headers** | Aucun |
| **Payload** | Aucun |
| **Utilisation actuelle** | **Définie mais non appelée** — `ProfileScreen` utilise les données passées en navigation |

**Structure de réponse inférée** (depuis `ProfileScreen`, `UserCard`, `MatchCard`) :

```json
{
  "id": "string",
  "userId": "string",
  "nom": "string",
  "secteur": "string",
  "besoin": "string",
  "competences": ["string"],
  "localisation": {
    "ville": "string",
    "pays": "string"
  }
}
```

---

## Matching

### GET `/api/matching/suggestions`

| Champ | Valeur |
|---|---|
| **Fichier** | `src/services/apiService.js` → `getSuggestions(firebaseUid)` |
| **Méthode** | `GET` |
| **Headers** | `X-User-Id: {firebaseUid}` |
| **Payload** | Aucun |
| **Utilisation** | `SuggestionsScreen` (⚠️ appelé sans passer `firebaseUid` actuellement) |

**Structure de réponse inférée** (depuis `MatchCard`, `SuggestionsScreen`) :

```json
[
  {
    "userId": "string",
    "nom": "string",
    "score": "number",
    "reasons": ["string"]
  }
]
```

---

### GET `/api/matching`

| Champ | Valeur |
|---|---|
| **Fichier** | `src/services/apiService.js` → `getMatches()` |
| **Méthode** | `GET` |
| **Headers** | Aucun |
| **Payload** | Aucun |
| **Utilisation actuelle** | **Définie mais non appelée** dans aucun écran |

**Structure de réponse :** inconnue (aucune consommation dans le code).

---

### GET `/api/matching/projects`

| Champ | Valeur |
|---|---|
| **Fichier** | `src/services/apiService.js` → `getProjectMatches()` |
| **Méthode** | `GET` |
| **Headers** | Aucun |
| **Payload** | Aucun |
| **Utilisation actuelle** | **Définie mais non appelée** dans aucun écran |

**Structure de réponse :** inconnue (aucune consommation dans le code).

---

## Recherche

### GET `/api/search`

| Champ | Valeur |
|---|---|
| **Fichier** | `src/services/apiService.js` → `searchUsers(filters)` |
| **Méthode** | `GET` |
| **Query params** | `skill`, `sector`, `location`, `need` (tous optionnels) |
| **Payload** | Aucun |
| **Utilisation** | `SearchScreen` (seul `skill` est utilisé à l'écran) |

**Structure de réponse inférée** (depuis `UserCard`, `SearchScreen`) :

```json
[
  {
    "id": "string",
    "nom": "string",
    "secteur": "string",
    "besoin": "string",
    "localisation": {
      "ville": "string",
      "pays": "string"
    }
  }
]
```

---

## Projets

### GET `/api/projects`

| Champ | Valeur |
|---|---|
| **Méthode** | `GET` |
| **Utilisation** | `ProjectScreen` — liste tous les projets |

**Réponse :** `Project[]`

---

### GET `/api/projects/{id}`

| Champ | Valeur |
|---|---|
| **Méthode** | `GET` |
| **Utilisation** | `ProjectDetailsScreen` |

**Réponse :** `Project`

---

### GET `/api/projects/user/{ownerId}`

| Champ | Valeur |
|---|---|
| **Méthode** | `GET` |
| **Utilisation** | `apiService.getProjectsByUser` |

**Réponse :** `Project[]`

---

### POST `/api/projects`

| Champ | Valeur |
|---|---|
| **Méthode** | `POST` |
| **Headers** | `Content-Type: application/json` |
| **Utilisation** | `ProjectFormScreen` (création) |

**Payload :**

```json
{
  "titre": "string",
  "secteur": "string",
  "description": "string",
  "besoin": "string",
  "ownerId": "firebaseUid",
  "statut": "actif",
  "tags": ["React", "Node.js"]
}
```

**Réponse :** `Project` créé

---

### PUT `/api/projects/{id}`

| Champ | Valeur |
|---|---|
| **Méthode** | `PUT` |
| **Utilisation** | `ProjectFormScreen` (modification, créateur uniquement côté UI) |

**Payload :** même structure que POST (sans changer `ownerId`)

**Réponse :** `Project` mis à jour

---

### DELETE `/api/projects/{id}`

| Champ | Valeur |
|---|---|
| **Méthode** | `DELETE` |
| **Utilisation** | `ProjectDetailsScreen` (suppression, créateur uniquement côté UI) |

**Réponse :** `204` / corps vide

---

### GET `/api/search/projects`

| Champ | Valeur |
|---|---|
| **Fichier** | `src/services/apiService.js` → `searchProjects(filters)` |
| **Méthode** | `GET` |
| **Query params** | `secteur`, `besoin` (optionnels) |
| **Utilisation** | `ProjectScreen` (recherche) |

**Structure de réponse :** `Project[]`

```json
{
  "id": "string",
  "titre": "string",
  "secteur": "string",
  "besoin": "string",
  "description": "string",
  "ownerId": "string",
  "statut": "actif",
  "tags": ["string"],
  "createdAt": "2026-06-20T12:00:00"
}
```

---

## Dashboard

### GET `/api/dashboard/{userId}`

| Champ | Valeur |
|---|---|
| **Méthode** | `GET` |
| **Utilisation** | `DashboardScreen` |

**Réponse :**

```json
{
  "totalProjets": 3,
  "projetsActifs": 2,
  "projetsRecents": [ /* Project[] */ ]
}
```

### GET `/api/matching` (complément dashboard — compteur Matches)

| Champ | Valeur |
|---|---|
| **Méthode** | `GET` |
| **Headers** | `X-User-Id: {firebaseUid}` |
| **Utilisation** | `DashboardScreen` — `matches.length` |

**Réponse :** `MatchResult[]`

---

## Équipe

> **Aucun endpoint Spring Boot identifié** dans le dossier `/mobile`.
>
> Fichiers placeholder vides :
> - `src/services/firestoreService.js`
> - `src/services/fcmService.js`
> - `src/screens/ChatListScreen.js`
> - `src/screens/ChatScreen.js`
> - `src/components/ConversationItem.js`
> - `src/components/MessageBubble.js`

---

## Récapitulatif

| Endpoint | Méthode | Fonctionnalité | Utilisé ? |
|---|---|---|---|
| `/api/users/register` | POST | Auth | ✅ RegisterScreen |
| `/api/users/{id}` | GET | Profil | ✅ ProfileScreen |
| `/api/matching/suggestions` | GET | Matching | ✅ SuggestionsScreen |
| `/api/matching` | GET | Matching / Dashboard | ✅ DashboardScreen |
| `/api/matching/projects` | GET | Matching / Projets | ❌ |
| `/api/search` | GET | Recherche | ✅ SearchScreen |
| `/api/search/projects` | GET | Projets (recherche) | ✅ ProjectScreen |
| `/api/projects` | GET/POST | Projets | ✅ ProjectScreen / ProjectFormScreen |
| `/api/projects/{id}` | GET/PUT/DELETE | Projets | ✅ ProjectDetails / ProjectForm |
| `/api/projects/user/{ownerId}` | GET | Projets utilisateur | ✅ apiService |
| `/api/dashboard/{userId}` | GET | Dashboard | ✅ DashboardScreen |
