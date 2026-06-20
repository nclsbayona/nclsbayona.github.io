FROM docker.io/mcp/playwright:latest

USER root
# Install k6 from Grafana's official apt repo
RUN apt-get update && apt-get install -y ca-certificates curl gnupg \
  && mkdir -p /etc/apt/keyrings \
  && curl -fsSL https://dl.k6.io/key.gpg | gpg --dearmor -o /etc/apt/keyrings/k6.gpg \
  && echo "deb [signed-by=/etc/apt/keyrings/k6.gpg] https://dl.k6.io/deb stable main" \
     > /etc/apt/sources.list.d/k6.list \
  && apt-get update && apt-get install -y git k6 \
  && rm -rf /var/lib/apt/lists/*

COPY scripts/ /opt/
COPY entrypoint.sh /entrypoint.sh

# --- Playwright install ---
WORKDIR /opt
RUN npm init -y \
  && npm i playwright \
  && npx playwright install chromium \
  && rm -rf /root/.npm

ENV NODE_PATH=/opt/node_modules
WORKDIR /github/workspace
ENTRYPOINT ["/entrypoint.sh"]
