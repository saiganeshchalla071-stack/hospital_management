# ------------------------------------------------------------------------------
# Build Stage: Compile and Package Spring Boot Application
# ------------------------------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy dependency definition and download dependencies first (caching layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source code and package executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ------------------------------------------------------------------------------
# Runtime Stage: Lightweight JRE Container
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-privileged user for enhanced security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Dynamic environment defaults
ENV PORT=8085
EXPOSE ${PORT}

# Run the Spring Boot application
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
