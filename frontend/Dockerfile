## ── Stage 1: Build React app ────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

# REACT_APP_API_BASE is passed as build-arg → becomes env var at build time
ARG REACT_APP_API_BASE
ENV REACT_APP_API_BASE=$REACT_APP_API_BASE

RUN npm run build

## ── Stage 2: Serve with Nginx ───────────────────
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# React Router support — all routes fall back to index.html
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
  location ~* \.(js|css|png|jpg|ico|svg|woff2?)$ { expires 1y; add_header Cache-Control "public,immutable"; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
