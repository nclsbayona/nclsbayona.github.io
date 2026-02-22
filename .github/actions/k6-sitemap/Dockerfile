FROM mcr.microsoft.com/playwright:v1.58.2-noble

# Install k6 from Grafana's official apt repo
RUN apt-get update && apt-get install -y ca-certificates curl gnupg \
  && mkdir -p /etc/apt/keyrings \
  && curl -fsSL https://dl.k6.io/key.gpg | gpg --dearmor -o /etc/apt/keyrings/k6.gpg \
  && echo "deb [signed-by=/etc/apt/keyrings/k6.gpg] https://dl.k6.io/deb stable main" \
     > /etc/apt/sources.list.d/k6.list \
  && apt-get update && apt-get install -y k6 \
  && rm -rf /var/lib/apt/lists/* && npm install -g playwright

COPY scripts/ /opt/

WORKDIR /work