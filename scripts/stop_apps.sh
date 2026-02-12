#!/bin/bash

# Stop TruthSeed PWA
# This script stops the Next.js development server

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Load ports from .ports.env if it exists
if [ -f ".ports.env" ]; then
    export $(cat .ports.env | xargs)
    PORT=${FRONTEND_PORT:-3000}
else
    PORT=3000
fi

echo "Stopping TruthSeed PWA on port $PORT..."

# Kill process on port
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Killing process on port $PORT..."
    lsof -ti:$PORT | xargs kill -9 || true
    echo "Process stopped."
else
    echo "No process found on port $PORT."
fi

# Also check default port 3000
if [ "$PORT" != "3000" ]; then
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "Killing process on default port 3000..."
        lsof -ti:3000 | xargs kill -9 || true
    fi
fi

echo "All processes stopped."
