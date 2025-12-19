# Dockerfile für myHealth Agent Backend
# Optimiert für Fly.io Deployment

FROM node:20-slim AS builder

WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm ci

# TypeScript kompilieren
COPY . .
RUN npm run build

# Production Stage
FROM node:20-slim AS runner

WORKDIR /app

# Nur Production Dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Kompilierte Dateien kopieren
COPY --from=builder /app/dist ./dist

# Non-root User für Security mit richtigem Home-Directory
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs --home /home/agent agent && \
    mkdir -p /home/agent/.claude && \
    chown -R agent:nodejs /home/agent

USER agent

# Environment
ENV NODE_ENV=production
ENV PORT=3001
ENV HOME=/home/agent

EXPOSE 3001

# Health Check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/server.js"]
