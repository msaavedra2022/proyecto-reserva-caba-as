# Construye el frontend
FROM node:14 as frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Crea la imagen del backend
FROM node:14 as backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Copia los archivos del frontend generados al directorio público del backend
RUN mkdir -p /app/backend/public
COPY --from=frontend /app/frontend/dist /app/backend/public

# Expone el puerto 3000
EXPOSE 3000

# Inicia el backend
CMD ["npm", "start"]
