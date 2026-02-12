#!/bin/bash

# Check which ports are in use for TruthSeed PWA

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

echo "Checking ports for TruthSeed PWA..."
echo ""

# Check Next.js port
echo "Frontend (Next.js) - Port $PORT:"
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "  ✓ Port $PORT is IN USE"
    lsof -Pi :$PORT -sTCP:LISTEN
else
    echo "  ✗ Port $PORT is FREE"
fi

echo ""

# Check default port if different
if [ "$PORT" != "3000" ]; then
    echo "Default Port 3000:"
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "  ✓ Port 3000 is IN USE"
        lsof -Pi :3000 -sTCP:LISTEN
    else
        echo "  ✗ Port 3000 is FREE"
    fi
fi

echo ""
echo "Done."
