# Etapa de construcción
FROM node:18.18.0 AS builder
WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia y compila la aplicación
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18.18.0 AS production
WORKDIR /app

# Copia archivos necesarios para producción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Instala solo las dependencias de producción
RUN npm install --only=production

# Expone el puerto que Next.js usará
EXPOSE 3000

# Comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
