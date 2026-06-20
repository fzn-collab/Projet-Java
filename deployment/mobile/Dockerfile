# Expo Development Server - ConnectEntrepreneurs Mobile
# Ce conteneur sert l'app Expo pour le développement

FROM node:20-alpine

WORKDIR /app

# Copier les fichiers package
COPY mobile/package.json mobile/package-lock.json* ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY mobile/ .

# Exposer les ports Expo
EXPOSE 19000 19001 19002

# Variables d'environnement
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
ENV API_URL=http://backend:8080/api

# Démarrer Expo
CMD ["npx", "expo", "start", "--web", "--host", "0.0.0.0"]
