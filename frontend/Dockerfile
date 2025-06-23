FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy application files
COPY . .

# Expose the application port
EXPOSE 3000

# Use exec form for CMD to prevent shell interpretation issues
CMD ["npm", "start"]

# Copiar archivos del backend
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm install --production --legacy-peer-deps || exit 1

# Ejecutar el build del backend
RUN npm run build || exit 1
