FROM openjdk:21-jdk-slim

WORKDIR /app


COPY build/libs/eelarve-*.jar /app/eelarve.jar


COPY .env /app/.env

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/eelarve.jar"]