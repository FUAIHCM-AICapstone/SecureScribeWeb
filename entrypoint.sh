#!/bin/sh

# Entrypoint script for Docker container
# Generate runtime env file from environment variables

echo "🚀 Generating runtime config from environment variables..."

# Set defaults if not provided
API_ENDPOINT="${API_ENDPOINT:-https://securescribe.wc504.io.vn/be/api}"
BRAND_NAME="${BRAND_NAME:-SecureScribe}"
BRAND_LOGO="${BRAND_LOGO:-/images/logos/logo.png}"

# Export for envsubst
export API_ENDPOINT BRAND_NAME BRAND_LOGO

# Generate env-config.js from template
envsubst < /app/public/env-config.template.js > /app/public/env-config.js

echo "✅ Runtime config generated"
echo "   API_ENDPOINT: $API_ENDPOINT"
echo "   BRAND_NAME: $BRAND_NAME"

# Start Next.js application
echo "🌐 Starting Next.js application..."
exec "$@"