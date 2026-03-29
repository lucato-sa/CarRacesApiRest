# ============================================
# DOCKERFILE - API CARRERAS (Multi-stage Build)
# ============================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# ============================================
# Stage 2: Runtime (imagen más pequeña)
FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar código compilado desde builder
COPY --from=builder /app/dist ./dist

# 🔐 IMPORTANTE: NO copiar .env a imagen
# Las credenciales se inyectan en tiempo de despliegue:
#   - docker run -e SUPABASE_URL=... -e SUPABASE_KEY=...
#   - docker-compose.yml (desde .env.production.local)
#   - Variables de entorno del sistema
# COPY .env .env

# ✅ Copiar .env.example como REFERENCIA (documentación)
COPY .env.docker.supabase .env

# Variables de entorno
# CTorre: 29-03-2026 - comentamos production - de momento solo dev
# ENV NODE_ENV=production
# ENV PORT=3000
# ENV BACKEND=postgres
# CTorre: 29-03-2026 - TEST - estoy en desarrollo y lo necesito testear
# ⚠️ NO hardcodear credenciales aquí
# Valores por defecto (serán reemplazados en despliegue)
ENV NODE_ENV=test
ENV PORT=3000
ENV BACKEND=supabase

# Metadata
LABEL version="1.0"
LABEL description="API de Carreras de Coches - CarRaces"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/server.js"]
