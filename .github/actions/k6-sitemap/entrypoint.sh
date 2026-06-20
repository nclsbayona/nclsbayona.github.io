#!/bin/bash
set -euo pipefail

OUTPUT_DIR="$INPUT_BASE_OUTPUT_DIR"
REPORT_HTML="$OUTPUT_DIR/k6-report.html"
DASHBOARD_PNG_DIR="$OUTPUT_DIR/images"

mkdir -p "$OUTPUT_DIR"
mkdir -p "$DASHBOARD_PNG_DIR"

export BASE_URL="${INPUT_BASE_URL:?}"
export SITEMAP_URL="${INPUT_SITEMAP_URL:-}"
export VUS="${INPUT_VUS:-5}"
export DURATION="${INPUT_DURATION:-1m}"
export URL_LIMIT="${INPUT_URL_LIMIT:-500}"
export HTTP_TIMEOUT="${INPUT_HTTP_TIMEOUT:-5s}"
export K6_WEB_DASHBOARD="true"
export K6_WEB_DASHBOARD_EXPORT="$REPORT_HTML"

k6 run /opt/analyze-sitemap.js

echo "dashboard_html=$REPORT_HTML" >> "$GITHUB_OUTPUT"

node /opt/load-dashboard.mjs

echo "dashboard_png=$DASHBOARD_PNG_DIR/k6-dashboard.png" >> "$GITHUB_OUTPUT"
