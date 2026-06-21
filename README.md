# ConnectEntrepreneurs

**Plateforme de mise en relation entre entrepreneurs**

---

## 📋 Description

ConnectEntrepreneurs est une plateforme innovante qui facilite la mise en relation entre entrepreneurs, porteurs de projets et investisseurs. Notre mission est de créer un écosystème dynamique où les idées rencontrent les opportunités.

## Membres
Marya Ziane: Gestion utilisateurs & Authentification
Aya Hanine : Matching intelligent & Recherche
Nokraoui Fatima Zohra: Messagerie temps réel & Notifications
Chamlali Meryem: Gestion projets & Tableau de bord
Mardey Zineb: Backoffice, Analytics & Deploiment avec Docker et kubernetes (non complet)

### Fonctionnalités Principales

- **🤝 Matching Intelligent**: Algorithme de matching basé sur les compétences, secteurs et besoins
- **📱 Application Mobile**: Application cross-platform (iOS, Android, Web) avec React Native/Expo
- **🎯 Gestion de Projets**: Création, validation et suivi de projets entrepreneuriaux
- **💬 Messagerie Intégrée**: Communication fluide entre les membres
- **📊 Dashboard Analytics**: Tableaux de bord en temps réel pour les administrateurs
- **🔐 Authentification Sécurisée**: Firebase Authentication avec support OAuth
- **🔔 Notifications Push**: Alertes en temps réel via Firebase Cloud Messaging
- **🌐 Backoffice Admin**: Interface d'administration complète avec Angular PWA

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Mobile App     │
│  React Native   │
│      Expo       │
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
│   Port 8080     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    MongoDB      │
│   Port 27017    │
└─────────────────┘

┌─────────────────┐
│   Backoffice    │
│  Angular PWA    │
│   Port 4200     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Backend API    │
└─────────────────┘
```

---

## 🛠️ Stack Technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Frontend Mobile** | React Native / Expo | ~54.0.34 |
| **Backend API** | Spring Boot | 3.2.0 |
| **Base de données** | MongoDB | 7 |
| **Authentification** | Firebase Authentication | Latest |
| **Notifications** | Firebase Cloud Messaging | Latest |
| **Backoffice** | Angular | 19.2.0 |
| **UI Framework** | Angular Material | 19.2.19 |
| **Conteneurisation** | Docker | Latest |
| **Orchestration** | Kubernetes (Minikube) | Latest |
| **Java** | JDK | 17 |
| **Node.js** | Node | 20-alpine |

---

## 📁 Structure du Projet

```
ConnectEntrepreneurs/
├── backend/                 # API Spring Boot
│   ├── src/main/java/com/connectentrepreneurs/
│   │   ├── user/           # Gestion utilisateurs
│   │   ├── project/        # Gestion projets
│   │   ├── matching/       # Algorithme de matching
│   │   ├── messaging/      # Messagerie
│   │   └── search/         # Recherche avancée
│   └── pom.xml
├── backoffice/              # Interface admin Angular PWA
│   ├── src/app/
│   │   ├── core/           # Guards, Interceptors, Services
│   │   ├── shared/         # Composants partagés
│   │   ├── layout/         # Layouts
│   │   └── features/       # Fonctionnalités métier
│   └── angular.json
├── mobile/                  # Application React Native/Expo
│   ├── src/
│   │   ├── screens/        # Écrans de l'application
│   │   ├── navigation/     # Navigation
│   │   ├── config/         # Configuration API
│   │   ├── hooks/          # Hooks personnalisés
│   │   └── constants/      # Constantes
│   └── app.json
├── deployment/              # Configuration déploiement
│   ├── backend/            # Dockerfile backend
│   ├── backoffice/         # Dockerfile backoffice
│   ├── mobile/             # Dockerfile mobile
│   ├── kubernetes/         # Manifests Kubernetes
│   └── docker-compose.yml  # Docker Compose
├── DOCUMENTATION_TECHNIQUE.md  # Documentation technique détaillée
└── README.md                # Ce fichier
```

---

## 🚀 Démarrage Rapide

### Prérequis

- Java 17
- Node.js 20
- MongoDB 7
- Docker
- Maven
- Angular CLI

### Installation Docker (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/fzn-collab/Projet-Java.git
cd Projet-Java

# Lancer tous les services
cd deployment
docker compose --profile full up --build
```

**Accès aux services:**
- Backoffice: http://localhost:4200
- Backend API: http://localhost:8080/api
- Mobile Web: http://localhost:19000
- MongoDB: localhost:27017

### Installation Manuelle

#### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### Backoffice

```bash
cd backoffice
npm install
npm start
```

#### Mobile

```bash
cd mobile
npm install
npx expo start
```

Pour le build web:
```bash
cd mobile
npx expo export
```

---

## 📚 Documentation

Pour une documentation technique détaillée, consultez le fichier [DOCUMENTATION_TECHNIQUE.md](./DOCUMENTATION_TECHNIQUE.md).

Ce document contient:
- Architecture détaillée
- API Endpoints
- Configuration des services
- Guide de déploiement Docker/Kubernetes
- Sécurité et monitoring
- Tests et debugging

---

## 🔐 Sécurité

- **Authentification**: Firebase Authentication avec support OAuth
- **Autorisation**: Role-based access control (RBAC)
- **CORS**: Configuration sécurisée des origines
- **Headers**: Validation des headers `X-User-Id` et `X-User-Role`
- **Guards**: Auth guards et Admin guards dans Angular
- **Interceptors**: JWT et Error interceptors

---

## 🧪 Tests

### Backend

```bash
cd backend
mvn test
```

### Backoffice

```bash
cd backoffice
ng test
```

---

## 📦 Déploiement

### Docker

```bash
cd deployment
docker compose --profile full up --build
```

### Kubernetes

```bash
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
```

---

## 🤝 Contribution

Ce projet est développé par une équipe de 5 personnes dans le cadre d'un projet universitaire.

### Équipe

- **Personne 1**: Authentification & Gestion Utilisateurs
- **Personne 2**: Algorithme de Matching
- **Personne 3**: Messagerie & Recherche
- **Personne 4**: Gestion Projets & Dashboard
- **Personne 5**: Backoffice, Analytics & DevOps

---

## 📄 Licence

Ce projet est développé dans un cadre académique.

---

## 🔮 Roadmap

- [x] Authentification Firebase
- [x] Gestion utilisateurs
- [x] Algorithme de matching
- [x] Messagerie
- [x] Backoffice admin
- [x] Application mobile
- [ ] Swagger/OpenAPI documentation
- [ ] Cache Redis
- [ ] Tests E2E avec Cypress
- [ ] CI/CD pipeline avec GitHub Actions
- [ ] Monitoring avec Prometheus + Grafana
- [ ] Log centralisé avec ELK Stack
- [ ] Backup automatique MongoDB
- [ ] HTTPS avec Let's Encrypt

---

## 📞 Contact

Pour toute question ou suggestion, veuillez contacter l'équipe via le repository GitHub.

**Repository**: https://github.com/fzn-collab/Projet-Java


