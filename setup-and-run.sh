#!/usr/bin/env bash

set -e

# Colors for logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
  echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"
}
success() {
  echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}
warn() {
  echo -e "${YELLOW}[$(date +'%H:%M:%S')] $1${NC}"
}

# Check for dependencies
if [ ! -d "server/node_modules" ]; then
  log "Installing server dependencies..."
  (cd server && pnpm install)
  success "Server dependencies installed."
else
  success "Server dependencies already installed."
fi

if [ ! -d "client/node_modules" ]; then
  log "Installing client dependencies..."
  (cd client && pnpm install)
  success "Client dependencies installed."
else
  success "Client dependencies already installed."
fi

# Check if migration is needed (look for migration table in DB or a marker file)
MIGRATION_MARKER="server/prisma/.migrated"
if [ ! -f "$MIGRATION_MARKER" ]; then
  log "Running DB migrations..."
  (cd server && pnpm run db:migrate)
  touch "$MIGRATION_MARKER"
  success "DB migrations complete."
else
  success "DB already migrated."
fi

# Check if seeding is needed (look for a marker file)
SEED_MARKER="server/prisma/.seeded"
if [ ! -f "$SEED_MARKER" ]; then
  log "Seeding database (and downloading images if needed)..."
  (cd server && pnpm run db:seed)
  touch "$SEED_MARKER"
  success "Database seeded and images downloaded."
else
  success "Database already seeded."
fi

# Run both client and server in the same terminal using concurrently if available
if pnpm list -g concurrently > /dev/null 2>&1 || pnpm list concurrently > /dev/null 2>&1; then
  log "Starting client and server with concurrently..."
  pnpm dlx concurrently -n "SERVER,CLIENT" -c "blue,green" "cd server && pnpm run dev" "cd client && pnpm run dev"
else
  warn "'concurrently' is not installed. Running server first, then client."
  warn "For best experience, install concurrently: pnpm add -g concurrently"
  log "Starting server... (Press Ctrl+C to stop)"
  (cd server && pnpm run dev &)
  SERVER_PID=$!
  sleep 5
  log "Starting client... (Press Ctrl+C to stop)"
  (cd client && pnpm run dev &)
  CLIENT_PID=$!
  trap "kill $SERVER_PID $CLIENT_PID" SIGINT
  wait 
fi 