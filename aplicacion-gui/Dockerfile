# Utilizar una imagen de Node.js como base
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de paquetes
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Compilar la aplicación
RUN npm run build

# Usar una imagen más ligera para ejecutar la aplicación
FROM node:18-alpine AS runner

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos construidos desde la etapa anterior
COPY --from=builder /app ./

# Copiar el archivo de configuración TypeScript
COPY --from=builder /app/next.config.ts ./ 

# Establecer el comando por defecto para el modo de desarrollo
CMD ["npm", "run", "dev"]
