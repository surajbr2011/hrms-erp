# ─── Backend Dockerfile ───────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# Install deps separately for better layer caching
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads/daily-reports

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
