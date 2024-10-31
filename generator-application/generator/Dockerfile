# Etapa de construcción
FROM maven:3.8.5-openjdk-17 AS build

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo pom.xml y descarga las dependencias necesarias
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copia el resto del código fuente de la aplicación y construye el proyecto
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa de ejecución
FROM openjdk:17-jdk-slim

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el .jar generado desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar

# Expone el puerto 8443
#EXPOSE 8080

# Ejecuta la aplicación en el puerto 8443
ENTRYPOINT ["java", "-jar", "app.jar"]
