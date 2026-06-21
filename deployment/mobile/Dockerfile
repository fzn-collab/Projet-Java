# Expo Web Build - ConnectEntrepreneurs Mobile
# Ce conteneur génère et sert les fichiers statiques web

FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers package
COPY mobile/package.json mobile/package-lock.json* ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY mobile/ .

# Configurer l'API URL pour le web
ENV API_URL=http://backend:8080/api

# Générer les fichiers statiques web
RUN npx expo export

# Copier le cadre mobile
COPY deployment/mobile/mobile-frame.html /app/dist/mobile-frame.html

# Étape 2: Servir les fichiers statiques avec nginx
FROM nginx:alpine

# Copier les fichiers générés depuis le builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx
COPY deployment/mobile/nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
