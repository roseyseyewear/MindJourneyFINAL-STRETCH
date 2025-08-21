#!/bin/bash

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if we have a built version and if build is needed
if [ ! -f "dist/index.js" ] || [ "server/index.ts" -nt "dist/index.js" ]; then
    echo "Building application..."
    npm run build
fi

# Try to start production build, fallback to dev mode
if [ -f "dist/index.js" ]; then
    echo "Starting production build..."
    NODE_ENV=production node dist/index.js
else
    echo "Production build failed, starting in development mode..."
    NODE_ENV=development npx tsx server/index.ts
fi