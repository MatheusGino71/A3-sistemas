# ==========================================
# ZENIT - Dockerfile Multi-stage
# ==========================================

# Stage 1: Base
FROM node:18-alpine AS base
LABEL maintainer="ZENIT Team <suporte@zenit.com.br>"
LABEL description="Sistema Anti-Fraude PIX"

# Instalar dependências do sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    curl

WORKDIR /app

# ==========================================
# Stage 2: Dependencies
# ==========================================
FROM base AS dependencies

# Copiar apenas package files para aproveitar cache
COPY backend/package*.json ./

# Instalar todas as dependências
RUN npm ci --production=false

# ==========================================
# Stage 3: Build
# ==========================================
FROM base AS build

WORKDIR /app

# Copiar dependências instaladas
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar código do backend
COPY backend/ ./

# Remover dev dependencies
RUN npm prune --production

# ==========================================
# Stage 4: Production
# ==========================================
FROM node:18-alpine AS production

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar apenas o necessário para produção
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/server.js ./
COPY --from=build --chown=nodejs:nodejs /app/middleware ./middleware
COPY --from=build --chown=nodejs:nodejs /app/utils ./utils

# Copiar documentação
COPY --chown=nodejs:nodejs docs/ ./docs/

# Criar diretórios necessários
RUN mkdir -p /app/logs /app/data && \
    chown -R nodejs:nodejs /app/logs /app/data

# Variáveis de ambiente padrão
ENV NODE_ENV=production \
    PORT=3001 \
    DATABASE_PATH=/app/data/sentinela_pix.db \
    LOG_LEVEL=info

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Mudar para usuário não-root
USER nodejs

# Iniciar aplicação
CMD ["node", "server.js"]
