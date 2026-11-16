# Static HTML/CSS/JS design system — no build step, just served by nginx.
FROM nginx:1.27-alpine

# Backend base URL baked into assets/js/env.js at image build time
# (override with --build-arg API_BASE_URL=... for other environments)
ARG API_BASE_URL=https://api-dev.hfive.com

WORKDIR /usr/share/nginx/html

COPY . .

# Repo/tooling files that shouldn't ship as part of the served site
RUN rm -f Dockerfile docker-compose.yml nginx.conf .dockerignore .gitignore gitignore.txt

# Render the runtime config from its template (nginx:alpine ships envsubst)
RUN API_BASE_URL="${API_BASE_URL}" envsubst '${API_BASE_URL}' \
    < assets/js/env.template.js > assets/js/env.js && \
    rm -f assets/js/env.template.js

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/index.html >/dev/null || exit 1
