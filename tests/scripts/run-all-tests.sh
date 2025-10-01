#!/bin/bash

# Run all tests for TwoBirds Fit
# Usage: ./scripts/run-all-tests.sh

set -e

echo "=================================="
echo "TwoBirds Fit - Full Test Suite"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILED_TESTS=()

# Function to run tests and track failures
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -e "${YELLOW}Running ${test_name}...${NC}"
    if eval "$test_command"; then
        echo -e "${GREEN}✓ ${test_name} passed${NC}"
        echo ""
    else
        echo -e "${RED}✗ ${test_name} failed${NC}"
        FAILED_TESTS+=("$test_name")
        echo ""
    fi
}

# Start timer
START_TIME=$(date +%s)

# Backend Tests
echo "=== Backend Tests ==="
run_test "Backend Unit Tests" "cd backend && pytest tests/unit -v"
run_test "Backend Integration Tests" "cd backend && pytest tests/integration -v"

# Frontend Tests
echo "=== Frontend Tests ==="
run_test "Frontend Tests" "npm run test:frontend -- --coverage"
run_test "Frontend Linting" "npm run lint"

# E2E Tests
echo "=== E2E Tests ==="
run_test "E2E Tests (Chromium)" "npm run test:e2e:chromium"

# Performance Tests
echo "=== Performance Tests ==="
run_test "API Benchmarks" "cd performance && python api_benchmarks.py"

# Security Tests
echo "=== Security Tests ==="
run_test "Security Scan" "npm run test:security"

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

# Summary
echo "=================================="
echo "Test Suite Summary"
echo "=================================="
echo "Duration: ${MINUTES}m ${SECONDS}s"
echo ""

if [ ${#FAILED_TESTS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed:${NC}"
    for test in "${FAILED_TESTS[@]}"; do
        echo -e "${RED}  - $test${NC}"
    done
    exit 1
fi
