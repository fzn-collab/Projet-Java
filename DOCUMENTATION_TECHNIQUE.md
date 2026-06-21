# Documentation Technique — ConnectEntrepreneurs

Projet de plateforme de mise en relation entre entrepreneurs

---

## 1. Architecture Générale

### 1.1 Stack Technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Frontend Mobile | React Native / Expo | ~54.0.34 |
| Backend API | Spring Boot | 3.2.0 |
| Base de données | MongoDB | 7 |
| Authentification | Firebase Authentication | Latest |
| Notifications | Firebase Cloud Messaging | Latest |
| Backoffice | Angular | 19.2.0 |
| UI Framework | Angular Material | 19.2.19 |
| Conteneurisation | Docker | Latest |
| Orchestration | Kubernetes (Minikube) | Latest |
| Java | JDK | 17 |
| Node.js | Node | 20-alpine |

### 1.2 Architecture

```
┌─────────────────┐
│  Mobile App     │
│  (React Native) │
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────┐
│  Firebase Auth  │
│  + FCM          │
└─────────────────┘
         │
         ↓
┌─────────────────┐
│  Spring Boot    │
│  Backend API    │
│  (Port 8080)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  MongoDB        │
│  (Port 27017)   │
└─────────────────┘

┌─────────────────┐
│  Backoffice     │
│  Angular PWA    │
│  (Port 4200)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Backend API    │
└─────────────────┘
```

---

## 2. Backend Spring Boot

### 2.1 Structure du Projet

```
backend/
├── src/main/java/com/connectentrepreneurs/
│   ├── ConnectEntrepreneursApplication.java
│   ├── user/
│   │   ├── controller/UserController.java
│   │   ├── service/UserService.java
│   │   ├── model/User.java
│   │   └── repository/UserRepository.java
│   ├── project/
│   │   ├── controller/
│   │   │   ├── ProjectController.java
│   │   │   ├── DashboardController.java
│   │   │   └── AdminStatsController.java
│   │   ├── service/ProjectService.java
│   │   ├── model/Project.java
│   │   └── repository/ProjectRepository.java
│   ├── matching/
│   │   ├── controller/MatchingController.java
│   │   ├── service/MatchingService.java
│   │   └── model/
│   ├── messaging/
│   │   └── ...
│   └── search/
│       └── ...
└── pom.xml
```

### 2.2 API Endpoints

#### Authentification & Utilisateurs (marya)

| Méthode | Endpoint | Description | Role |
|---------|----------|-------------|------|
| POST | `/api/users/register` | Inscription utilisateur | Public |
| GET | `/api/users/me` | Profil utilisateur | User |
| PUT | `/api/users/me` | Mise à jour profil | User |
| GET | `/api/users` | Liste tous utilisateurs | Admin |
| GET | `/api/users/{id}` | Détail utilisateur | Admin |
| POST | `/api/users` | Créer utilisateur | Admin |
| PATCH | `/api/users/{id}` | Modifier utilisateur | Admin |
| DELETE | `/api/users/{id}` | Supprimer utilisateur | Admin |
| PUT | `/api/users/{id}/suspend` | Suspendre utilisateur | Admin |
| PATCH | `/api/users/{id}/validate` | Valider profil | Admin |

#### Projets (meryem)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/projects` | Liste tous projets |
| GET | `/api/projects/{id}` | Détail projet |
| GET | `/api/projects/user/{ownerId}` | Projets d'un utilisateur |
| POST | `/api/projects` | Créer projet |
| PUT | `/api/projects/{id}` | Modifier projet |
| DELETE | `/api/projects/{id}` | Supprimer projet |
| PATCH | `/api/projects/{id}/approve` | Approuver projet |
| PATCH | `/api/projects/{id}/reject` | Rejeter projet |

#### Matching (aya)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/matching` | Trouver des matchs |
| GET | `/api/matching/projects` | Matchs projets |
| GET | `/api/matching/suggestions` | Suggestions |

#### Dashboard Utilisateur (meryem)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/dashboard/{userId}` | Dashboard utilisateur |

#### Admin Stats (zineb)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/stats` | Statistiques admin |

### 2.3 Configuration

**application.properties**
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/connectentrepreneurs
spring.application.name=connectentrepreneurs
server.port=8080
```

---

## 3. Backoffice Angular PWA

### 3.1 Structure du Projet

```
backoffice/
├── src/app/
│   ├── core/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── project.service.ts
│   │   │   ├── stats.service.ts
│   │   │   ├── matching.service.ts
│   │   │   └── notification.service.ts
│   │   └── mappers/
│   ├── shared/
│   │   ├── components/
│   │   ├── models/
│   │   ├── data/
│   │   └── services/
│   ├── layout/
│   │   └── admin-layout/
│   └── features/
│       ├── auth/
│       ├── dashboard/
│       ├── users/
│       ├── projects/
│       ├── matching/
│       └── notifications/
├── angular.json
├── package.json
└── ngsw-config.json
```

### 3.2 Fonctionnalités

- **Authentification Admin**: Login sécurisé avec guards
- **Dashboard**: KPIs en temps réel, activité récente
- **Gestion Utilisateurs**: CRUD, suspension, validation
- **Gestion Projets**: Approbation, rejet, suppression
- **Matching**: Visualisation des matchs
- **Notifications**: Centre de notifications
- **PWA**: Installation locale, mode hors ligne

### 3.3 Configuration

**environment.ts**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  useMockData: false,
  useBackendAuth: false,
  adminFirebaseUid: 'firebase-uid-admin',
  mockAdmin: {
    email: 'admin@connect.com',
    password: 'admin123',
  },
  statsPollingIntervalMs: 10000,
};
```

---

## 4. Application Mobile React Native / Expo

### 4.1 Structure du Projet

```
mobile/
├── App.js
├── app.json
├── package.json
├── tsconfig.json
├── components/
│   ├── Button.js
│   ├── Card.js
│   ├── Input.js
│   └── ...
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── ProjectDetailScreen.js
│   │   └── ...
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── config/
│   │   └── api.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useApi.js
│   └── constants/
│       └── colors.js
└── assets/
```

### 4.2 Fonctionnalités

- **Authentification Firebase**: Email/password, Google OAuth
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **API Integration**: Axios pour appels REST
- **UI Components**: Composants réutilisables personnalisés
- **State Management**: React Hooks + Context
- **Web Build**: Export statique via Expo pour déploiement web

### 4.3 Configuration

**app.json**
```json
{
  "expo": {
    "name": "ConnectEntrepreneurs",
    "slug": "connectentrepreneurs",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "web": {
      "bundler": "metro"
    }
  }
}
```

**src/config/api.js**
```javascript
const API_URL = process.env.API_URL || 'http://localhost:8080/api';
export { API_URL };
```

### 4.4 Build Web

```powershell
cd mobile
npx expo export
```

Les fichiers statiques sont générés dans `dist/` et servis par nginx dans le conteneur Docker.

---

## 5. Base de Données MongoDB

### 5.1 Collections

#### Users
```json
{
  "_id": "string",
  "nom": "string",
  "email": "string",
  "secteur": "string",
  "competences": ["string"],
  "besoin": "string",
  "photoUrl": "string",
  "role": "USER|ADMIN",
  "firebaseUid": "string",
  "actif": boolean,
  "createdAt": "ISODate",
  "localisation": {
    "latitude": number,
    "longitude": number,
    "ville": "string",
    "pays": "string"
  },
  "typeProfil": "string"
}
```

#### Projects
```json
{
  "_id": "string",
  "titre": "string",
  "secteur": "string",
  "description": "string",
  "besoin": "string",
  "ownerId": "string",
  "statut": "ACTIVE|PENDING|REJECTED",
  "createdAt": "ISODate",
  "tags": ["string"]
}
```

---

## 6. Déploiement Docker

### 6.1 Docker Compose

**docker-compose.yml**
```yaml
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build:
      context: ..
      dockerfile: deployment/backend/Dockerfile
    ports:
      - "8080:8080"
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongodb:27017/connectentrepreneurs
    depends_on:
      - mongodb

  backoffice:
    build:
      context: ..
      dockerfile: deployment/backoffice/Dockerfile
    ports:
      - "4200:80"
    depends_on:
      - backend

  mobile:
    build:
      context: ..
      dockerfile: deployment/mobile/Dockerfile
    ports:
      - "19000:80"
    depends_on:
      - backend
```

### 6.2 Commandes

```powershell
# Build et démarrage complet
cd deployment
docker compose --profile full up --build

# Arrêt
docker compose down

# Logs
docker compose logs -f backend
docker compose logs -f backoffice
docker compose logs -f mobile

# Build uniquement mobile
docker build -t ce-mobile -f deployment/mobile/Dockerfile .
docker compose up -d mobile
```

---

## 7. Déploiement Kubernetes

### 7.1 Manifests

| Fichier | Description |
|---------|-------------|
| `namespace.yaml` | Namespace connectentrepreneurs |
| `mongodb-deployment.yaml` | Déploiement MongoDB |
| `mongodb-service.yaml` | Service MongoDB |
| `mongodb-pvc.yaml` | Persistent Volume Claim |
| `backend-deployment.yaml` | Déploiement Backend (2 replicas) |
| `backend-service.yaml` | Service Backend |
| `backoffice-deployment.yaml` | Déploiement Backoffice (2 replicas) |
| `backoffice-service.yaml` | Service Backoffice (LoadBalancer) |
| `ingress.yaml` | Ingress pour accès externe |
| `mobile-deployment.yaml` | Déploiement Mobile (React Native/Expo Web) |
| `mobile-service.yaml` | Service Mobile (LoadBalancer) |

### 7.2 Commandes

```powershell
# Démarrage Minikube
minikube start
minikube addons enable ingress

# Construction images
docker build -f deployment/backend/Dockerfile -t connectentrepreneurs/backend:latest .
docker build -f deployment/backoffice/Dockerfile -t connectentrepreneurs/backoffice:latest .
docker build -f deployment/mobile/Dockerfile -t connectentrepreneurs/mobile:latest .

# Chargement images
minikube image load connectentrepreneurs/backend:latest
minikube image load connectentrepreneurs/backoffice:latest
minikube image load connectentrepreneurs/mobile:latest

# Déploiement
kubectl apply -f deployment/kubernetes/

# Vérification
kubectl get pods -n connectentrepreneurs
kubectl get services -n connectentrepreneurs
```

---

## 8. Firebase Integration

### 8.1 Configuration

**firebase-adminsdk.json** (à ajouter dans backend/src/main/resources/)
```json
{
  "type": "service_account",
  "project_id": "connectentrepreneurs-project",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### 8.2 Fonctionnalités

- **Authentification**: Email/password, Google OAuth
- **Notifications**: Firebase Cloud Messaging
- **Temps réel**: Firestore pour synchronisation

---

## 9. Sécurité

### 9.1 Backend

- CORS configuré pour `http://localhost:4200`
- Role-based access control (RBAC)
- Headers `X-User-Id` et `X-User-Role` pour identification

### 9.2 Backoffice

- Auth guards pour routes protégées
- Admin guard pour accès admin uniquement
- JWT interceptor pour authentification
- Error interceptor pour gestion erreurs

---

## 10. Monitoring & Logging

### 10.1 Health Checks

**Backend**: `/actuator/health`
**Backoffice**: `/` (root)

### 10.2 Logs

```powershell
# Docker
docker compose logs -f backend

# Kubernetes
kubectl logs -f deployment/backend -n connectentrepreneurs
```

### 10.3 Métriques

```powershell
# Kubernetes
kubectl top pods -n connectentrepreneurs
kubectl top nodes
```

---

## 11. Tests

### 11.1 Backend Tests

```powershell
cd backend
mvn test
```

### 11.2 Backoffice Tests

```powershell
cd backoffice
ng test
```

---

## 12. Guide d'Installation

### 12.1 Prérequis

- Java 17
- Node.js 20
- MongoDB 7
- Docker
- Minikube (optionnel)
- Maven
- Angular CLI

### 12.2 Installation Backend

```powershell
cd backend
mvn clean install
mvn spring-boot:run
```

Backend accessible sur `http://localhost:8080`

### 12.3 Installation Backoffice

```powershell
cd backoffice
npm install
npm start
```

Backoffice accessible sur `http://localhost:4200`

### 12.4 Installation Mobile

```powershell
cd mobile
npm install
npx expo start
```

Pour le web build:
```powershell
cd mobile
npx expo export
```

Mobile accessible sur `http://localhost:19000` (via Docker)

### 12.5 Installation Complète (Docker)

```powershell
cd deployment
docker compose --profile full up --build
```

- Backoffice: `http://localhost:4200`
- Backend API: `http://localhost:8080/api`
- Mobile Web: `http://localhost:19000`
- MongoDB: `localhost:27017`

---

## 13. Choix Techniques

### 13.1 Pour Spring Boot

- Framework mature et robuste
- Excellent support MongoDB
- Facilité de déploiement
- Communauté active

### 13.2 Pour Angular

- Framework moderne et performant
- Material Design pour UI cohérente
- Support PWA natif
- TypeScript pour type safety

### 13.3 Pour MongoDB

- NoSQL flexible pour données entrepreneurs
- JSON-like structure
- Scalabilité horizontale
- Adapté pour prototypes et production

### 13.4 Pour Docker/Kubernetes

- Conteneurisation standard
- Déploiement reproductible
- Scaling facile
- Isolation environnementale

### 13.5 Pour React Native / Expo

- Cross-platform (iOS, Android, Web)
- Hot reloading pour développement rapide
- Large écosystème de composants
- Firebase integration native
- Build statique web pour déploiement simple

---

## 14. Problèmes Connus & Solutions

### 14.1 CORS

**Problème**: Erreur CORS lors des appels API

**Solution**: Vérifier configuration CORS dans backend et autoriser `http://localhost:4200`

### 14.2 Connexion MongoDB

**Problème**: Backend ne se connecte pas à MongoDB

**Solution**: Vérifier que MongoDB est démarré et que l'URI est correcte

### 14.3 Images Docker

**Problème**: Images non disponibles dans Minikube

**Solution**: Utiliser `minikube image load` pour charger les images localement

---

## 15. Améliorations Futures

- [ ] Ajouter Swagger/OpenAPI documentation
- [ ] Implémenter cache Redis
- [ ] Ajouter tests E2E avec Cypress
- [ ] CI/CD pipeline avec GitHub Actions
- [ ] Monitoring avec Prometheus + Grafana
- [ ] Log centralisé avec ELK Stack
- [ ] Backup automatique MongoDB
- [ ] HTTPS avec Let's Encrypt


