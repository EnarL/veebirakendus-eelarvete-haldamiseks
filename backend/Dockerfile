# Use OpenJDK 17 as the base image
FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build directory to the container
COPY build/libs/eelarve-0.0.1-SNAPSHOT.jar /app/eelarve-0.0.1-SNAPSHOT.jar

# Expose port 8080 (or whatever port your Spring Boot app uses)
EXPOSE 8080

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "eelarve-0.0.1-SNAPSHOT.jar"]
