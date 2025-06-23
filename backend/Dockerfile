FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Install TypeScript globally
RUN npm install -g typescript

# Copy the rest of the application code
COPY . .

# Ajuste para copiar archivos del backend correctamente
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm install --production --legacy-peer-deps || exit 1

# Copiar el resto de los archivos del backend
COPY backend/. .

# Ejecutar el build del backend
RUN npm run build || exit 1

# Expose the application port
EXPOSE 3000

# Use exec form for CMD to prevent shell interpretation issues
CMD ["npm", "start"]
