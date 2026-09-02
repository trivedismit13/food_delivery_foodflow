# ─── Stage 1: Build ─────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy Maven wrapper first (allows layer caching of dependencies)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies (cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src/ src/

# Build — skip tests (tests run separately in CI; Docker just packages)
RUN ./mvnw clean package -DskipTests -B

# ─── Stage 2: Runtime ───────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

# Create non-root user for security
RUN groupadd -r foodflow && useradd -r -g foodflow foodflow

# Copy only the built JAR
COPY --from=build /app/target/foodflow-0.0.1-SNAPSHOT.jar app.jar

# Give ownership to non-root user
RUN chown foodflow:foodflow app.jar

USER foodflow

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
