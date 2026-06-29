#!/bin/bash
set -euo pipefail

export OUTPUT_DIR="$INPUT_BASE_OUTPUT_DIR"
REPORT_HTML="$OUTPUT_DIR/k6-report.html"
DASHBOARD_PNG_DIR="$OUTPUT_DIR/images"

echo "Creating $OUTPUT_DIR ..."
mkdir -p "$OUTPUT_DIR"
echo "Creating $DASHBOARD_PNG_DIR ..."
mkdir -p "$DASHBOARD_PNG_DIR"

export BASE_URL="${INPUT_BASE_URL}"
export SITEMAP_URL="${INPUT_SITEMAP_URL}"
export VUS="${INPUT_VUS}"
export DURATION="${INPUT_DURATION}"
export URL_LIMIT="${INPUT_URL_LIMIT}"
export HTTP_TIMEOUT="${INPUT_HTTP_TIMEOUT}"
export K6_WEB_DASHBOARD="true"
export K6_WEB_DASHBOARD_EXPORT="$REPORT_HTML"

k6 run /opt/analyze-sitemap.js

echo "dashboard_html=$REPORT_HTML" >> "$GITHUB_OUTPUT"

node /opt/load-dashboard.mjs

echo "dashboard_png=$DASHBOARD_PNG_DIR/dashboard.png" >> "$GITHUB_OUTPUT"
