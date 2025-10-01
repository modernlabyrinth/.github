#!/bin/bash

# Clean test data and artifacts
# Usage: ./scripts/clean-test-data.sh

set -e

echo "Cleaning test data and artifacts..."

# Remove test database
echo "Dropping test database..."
docker-compose -f docker-compose.test.yml down -v

# Remove coverage reports
echo "Removing coverage reports..."
rm -rf backend/htmlcov backend/.coverage backend/coverage.xml
rm -rf frontend/coverage

# Remove test artifacts
echo "Removing test artifacts..."
rm -rf e2e/test-results e2e/playwright-report
rm -rf mobile/artifacts
rm -rf performance/*.html performance/*.csv

# Remove temporary files
echo "Removing temporary files..."
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true

echo "✓ Cleanup complete!"
