# Kubernetes Deployment — ConnectEntrepreneurs

Personne 5 — DevOps & Kubernetes

## Prérequis

- Minikube installé
- kubectl configuré
- Docker installé
- Images Docker construites (voir ../README.md)

## Démarrage Minikube

```powershell
minikube start
minikube addons enable ingress
```

## Construction des images Docker

```powershell
# Backend
docker build -f deployment/backend/Dockerfile -t connectentrepreneurs/backend:latest .

# Backoffice
docker build -f deployment/backoffice/Dockerfile -t connectentrepreneurs/backoffice:latest .

# Mobile
docker build -f deployment/mobile/Dockerfile -t connectentrepreneurs/mobile:latest .
```

## Chargement des images dans Minikube

```powershell
minikube image load connectentrepreneurs/backend:latest
minikube image load connectentrepreneurs/backoffice:latest
minikube image load connectentrepreneurs/mobile:latest
```

## Déploiement sur Kubernetes

```powershell
# Créer le namespace
kubectl apply -f deployment/kubernetes/namespace.yaml

# Déployer MongoDB
kubectl apply -f deployment/kubernetes/mongodb-pvc.yaml
kubectl apply -f deployment/kubernetes/mongodb-deployment.yaml
kubectl apply -f deployment/kubernetes/mongodb-service.yaml

# Déployer le Backend
kubectl apply -f deployment/kubernetes/backend-deployment.yaml
kubectl apply -f deployment/kubernetes/backend-service.yaml

# Déployer le Backoffice
kubectl apply -f deployment/kubernetes/backoffice-deployment.yaml
kubectl apply -f deployment/kubernetes/backoffice-service.yaml

# Déployer le Mobile
kubectl apply -f deployment/kubernetes/mobile-deployment.yaml
kubectl apply -f deployment/kubernetes/mobile-service.yaml

# Déployer l'Ingress
kubectl apply -f deployment/kubernetes/ingress.yaml
```

## Vérification du déploiement

```powershell
# Vérifier les pods
kubectl get pods -n connectentrepreneurs

# Vérifier les services
kubectl get services -n connectentrepreneurs

# Vérifier l'ingress
kubectl get ingress -n connectentrepreneurs

# Logs des pods
kubectl logs -f deployment/backend -n connectentrepreneurs
kubectl logs -f deployment/backoffice -n connectentrepreneurs
kubectl logs -f deployment/mobile -n connectentrepreneurs
```

## Accès à l'application

```powershell
# Obtenir l'URL du backoffice
minikube service backoffice -n connectentrepreneurs --url

# Ou via l'ingress (après avoir ajouté l'entrée dans /etc/hosts)
echo "$(minikube ip) connectentrepreneurs.local" | sudo tee -a /etc/hosts
```

## Scaling

```powershell
# Scaler le backend
kubectl scale deployment backend -n connectentrepreneurs --replicas=3

# Scaler le backoffice
kubectl scale deployment backoffice -n connectentrepreneurs --replicas=3
```

## Nettoyage

```powershell
# Supprimer tous les ressources
kubectl delete namespace connectentrepreneurs

# Ou fichier par fichier
kubectl delete -f deployment/kubernetes/
```

## Architecture

```
Internet
  ↓
Ingress (connectentrepreneurs.local)
  ↓
Backoffice Service (LoadBalancer)
  ↓
Backoffice Pods (Angular + Nginx)
  ↓
Backend Service (ClusterIP)
  ↓
Backend Pods (Spring Boot)
  ↓
MongoDB Service (ClusterIP)
  ↓
MongoDB Pod (avec PVC)

[Mobile App] - (Expo, hors Docker/Kubernetes)
  ↓
Backend API (http://IP_MACHINE:8080/api)
```

## Monitoring

```powershell
# Ressources utilisées
kubectl top pods -n connectentrepreneurs

# Events
kubectl get events -n connectentrepreneurs --sort-by='.lastTimestamp'
```

## Déploiement complet (script)

```powershell
# deployment/kubernetes/deploy-all.ps1
kubectl apply -f deployment/kubernetes/namespace.yaml
kubectl apply -f deployment/kubernetes/mongodb-pvc.yaml
kubectl apply -f deployment/kubernetes/mongodb-deployment.yaml
kubectl apply -f deployment/kubernetes/mongodb-service.yaml
kubectl apply -f deployment/kubernetes/backend-deployment.yaml
kubectl apply -f deployment/kubernetes/backend-service.yaml
kubectl apply -f deployment/kubernetes/backoffice-deployment.yaml
kubectl apply -f deployment/kubernetes/backoffice-service.yaml
kubectl apply -f deployment/kubernetes/mobile-deployment.yaml
kubectl apply -f deployment/kubernetes/mobile-service.yaml
kubectl apply -f deployment/kubernetes/ingress.yaml

echo "Attente des pods..."
kubectl wait --for=condition=ready pod -l app=backend -n connectentrepreneurs --timeout=300s
kubectl wait --for=condition=ready pod -l app=backoffice -n connectentrepreneurs --timeout=300s
kubectl wait --for=condition=ready pod -l app=mobile -n connectentrepreneurs --timeout=300s

echo "Déploiement terminé!"
minikube service backoffice -n connectentrepreneurs --url
minikube service mobile -n connectentrepreneurs --url
```

## Note sur le Mobile

L'application mobile (React Native / Expo) est maintenant conteneurisée dans Docker/Kubernetes:
- Le conteneur Expo Development Server sert l'app mobile
- L'app mobile elle-même s'exécute sur l'appareil mobile ou l'émulateur
- Le conteneur mobile se connecte au backend API via HTTP interne
- Pour le développement local: `http://localhost:19000` (Expo)
- Pour l'émulateur Android: `http://10.0.2.2:19000`
- Pour les appareils réels: `http://IP_DE_VOTRE_MACHINE:19000`
