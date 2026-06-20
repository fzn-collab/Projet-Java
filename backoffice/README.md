# Backoffice Admin (Personne 1)

## Fonctionnalites

- Connexion admin Firebase (email/mot de passe)
- Liste des utilisateurs MongoDB
- Etat actif/inactif
- Validation profil (complet/incomplet)
- Suspension / reactivation compte

## Lancer rapidement

1. Demarrer le backend Spring Boot sur http://localhost:8081
2. Ouvrir `backoffice/index.html` dans le navigateur (ou via un petit serveur statique)
3. Se connecter avec un compte admin Firebase

## Note role ADMIN

Le backoffice envoie le header `X-User-Role: ADMIN`.
Pour un vrai mode production, configure un custom claim Firebase role=ADMIN et retire le fallback header dans le backend.
