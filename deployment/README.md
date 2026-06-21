# Déploiement Docker — ConnectEntrepreneurs

Mardey Zineb
## Structure du projet (cible finale)

```
ConnectEntrepreneurs/
├── backend/          ← Spring Boot 3.3.5
├── mobile/           ← Expo (React Native)
├── backoffice/       ← Angular PWA
└── deployment/       ← ce dossier
```

---

## Déploiement complet (Docker)

### Prérequis
- Docker installé
- Dossier `mobile/` présent (quand l'équipe terminera)

### Commandes

```powershell
cd deployment
docker compose --profile full up --build
```

### Services déployés

| Service    | URL                      | Port  |
|------------|--------------------------|-------|
| Backoffice | http://localhost:4200    | 4200  |
| Backend API| http://localhost:8080/api | 8080 |
| MongoDB    | localhost:27017        | 27017 |
| Mobile Expo| http://localhost:19000  | 19000 |
| Expo Web   | http://localhost:19001  | 19001 |
| Expo DevTools| http://localhost:19002| 19002 |

### Architecture

```
Internet
  ↓
Backoffice (Nginx) → Backend API
  ↓                    ↓
MongoDB ←──────────────┘

Mobile (Expo Server) → Backend API
```

---

## Vérification du déploiement

### Vérifier que les conteneurs tournent

```powershell
docker ps
```

Tu devrais voir:
- `ce-backend` (Up)
- `ce-backoffice` (Up)
- `ce-mongodb` (Up)
- `ce-mobile` (Up)

### Vérifier les logs

```powershell
docker compose logs -f backend
docker compose logs -f backoffice
docker compose logs -f mobile
```

### Tester l'accès

```powershell
# Backend health check
curl http://localhost:8080/api/actuator/health

# Backoffice
curl http://localhost:4200

# Mobile Expo
curl http://localhost:19000
```

---

## Ce que le prof va faire

Le prof n'a besoin que de **Docker installé**. Il fera:

```powershell
cd deployment
docker compose --profile full up --build
```

Et **tout fonctionnera automatiquement**:
- ✅ Backend Spring Boot démarré
- ✅ Backoffice Angular accessible
- ✅ MongoDB configuré
- ✅ Mobile Expo Server prêt
- ✅ Aucune installation manuelle requise

---

## Commandes utiles

```powershell
# Arrêter
docker compose down

# Arrêter + supprimer volumes MongoDB
docker compose down -v

# Voir les logs
docker compose logs -f backoffice
docker compose logs -f backend
docker compose logs -f mobile

# Redémarrer un service
docker compose restart backend
```

---

## Kubernetes (Production)

Voir `kubernetes/README.md` pour le déploiement sur Kubernetes.

---

## Pourquoi Docker?

**Valeur ajoutée:**
- **Environnement isolé** - Pas de conflits avec ton système
- **Reproductible** - Même environnement partout
- **Déploiement rapide** - Une seule commande
- **Pas d'installation manuelle** - Le prof n'installe rien
- **Portabilité** - Fonctionne sur n'importe quelle machine avec Docker

**Pour le prof:**
- Il ouvre le dossier
- Il lance `docker compose up`
- Il teste l'application
- **C'est tout!**
