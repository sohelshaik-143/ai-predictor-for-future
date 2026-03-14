## ── Stage 1: Build ─────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy pom first for dependency caching
COPY pom.xml .
RUN mvn -B dependency:go-offline -q

# Copy source and build
COPY src ./src
RUN mvn -B clean package -DskipTests -q

## ── Stage 2: Run ────────────────────────────────
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /workspace/target/*.jar app.jar

# Render injects PORT; fallback to 8084 for local
EXPOSE 8084
ENV PORT=8084

ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Dserver.port=${PORT}", \
  "-jar", "app.jar"]
