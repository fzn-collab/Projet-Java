# A activer quand le dossier backend/ sera ajoute par l'equipe (Spring Boot 3.3.5 + Java 17)

FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

COPY backend/pom.xml .
COPY backend/src ./src

RUN apk add --no-cache maven && \
    mvn -q package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
