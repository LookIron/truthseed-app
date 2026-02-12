#!/bin/bash

# Start TruthSeed PWA (Next.js)
# This script starts the Next.js development server

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Load ports from .ports.env if it exists (for worktree isolation)
if [ -f ".ports.env" ]; then
    echo "Loading ports from .ports.env..."
    export $(cat .ports.env | xargs)
    PORT=${FRONTEND_PORT:-3000}
else
    PORT=3000
fi

echo "Starting TruthSeed PWA on port $PORT..."

# Kill any existing process on the port
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Port $PORT is already in use. Killing existing process..."
    lsof -ti:$PORT | xargs kill -9 || true
    sleep 2
fi

# Start Next.js dev server
echo "Starting Next.js development server..."
PORT=$PORT pnpm dev
