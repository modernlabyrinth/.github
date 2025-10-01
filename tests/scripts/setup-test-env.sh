#!/bin/bash

# Setup test environment for TwoBirds Fit
# Usage: ./scripts/setup-test-env.sh

set -e

echo "Setting up test environment..."

# Check prerequisites
echo "Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required but not installed. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }

echo "✓ Prerequisites check passed"

# Install Node dependencies
echo "Installing Node.js dependencies..."
npm ci

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install Playwright browsers
echo "Installing Playwright browsers..."
npx playwright install --with-deps

# Setup environment file
if [ ! -f .env.test ]; then
    echo "Creating .env.test from .env.example..."
    cp .env.example .env.test
    echo "✓ Created .env.test"
else
    echo "✓ .env.test already exists"
fi

# Start Docker services
echo "Starting Docker services..."
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 5

# Run database migrations
echo "Running database migrations..."
cd backend && alembic upgrade head && cd ..

# Seed test data
echo "Seeding test data..."
python scripts/seed-test-data.py

echo ""
echo "=================================="
echo "✓ Test environment setup complete!"
echo "=================================="
echo ""
echo "You can now run tests with:"
echo "  npm test"
echo "  npm run test:backend"
echo "  npm run test:frontend"
echo "  npm run test:e2e"
echo ""
