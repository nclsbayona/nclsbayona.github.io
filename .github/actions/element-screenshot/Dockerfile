FROM docker.io/mcp/playwright:latest

USER root
# ---- Playwright install ---
WORKDIR /opt
RUN npm init -y \
  && npm i playwright \
  && npx playwright install chromium \
  && rm -rf /root/.npm \
  && apt-get update && apt-get install -y ca-certificates \
  && rm -rf /var/lib/apt/lists/*
  
ENV NODE_PATH=/opt/node_modules
WORKDIR /github/workspace
COPY entrypoint.sh /entrypoint.sh
COPY scripts/ /opt/
ENTRYPOINT ["/entrypoint.sh"]
