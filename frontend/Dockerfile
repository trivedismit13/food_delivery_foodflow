# ─── Stage 1: Build ─────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files for layer caching
COPY package.json package-lock.json ./

# Install exact dependencies
RUN npm ci

# Copy source
COPY . .

# Build arguments for environment configuration
# VITE_API_BASE_URL is the URL the BROWSER uses to reach the backend.
# In Docker Compose local setup this is http://localhost:8080/api
ARG VITE_API_BASE_URL=http://localhost:8080/api
ARG VITE_APP_ENV=production
ARG VITE_GOOGLE_CLIENT_ID=

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

RUN npm run build

# ─── Stage 2: Nginx runtime ──────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default nginx site
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (SPA routing support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
