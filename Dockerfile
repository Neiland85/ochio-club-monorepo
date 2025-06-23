FROM node:18

# Set a non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production --legacy-peer-deps || exit 1

# Build the backend
WORKDIR /app/backend
RUN npm run build || exit 1

# Copy application files
WORKDIR /app
COPY . /app/

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Use a specific port for the application
EXPOSE 3000

# Asegurar instalación de tipos necesarios
RUN npm install --save-dev @types/send@latest @types/qs@latest @types/range-parser@latest @types/serve-static@latest @types/body-parser@latest @types/cors@latest @types/jsonwebtoken@latest @types/bcryptjs@latest @types/supertest@latest @types/jest@latest || exit 1

# Use exec form for CMD to prevent shell interpretation issues
CMD ["npm", "start"]
