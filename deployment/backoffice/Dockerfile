# Build Angular backoffice
FROM node:20-alpine AS build

WORKDIR /app

COPY backoffice/package.json backoffice/package-lock.json* ./
RUN npm ci

COPY backoffice/ .
RUN npm run build -- --configuration=production

# Serve with nginx
FROM nginx:1.27-alpine

COPY deployment/backoffice/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/backoffice/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
