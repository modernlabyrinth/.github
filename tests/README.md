# TwoBirds Fit - Testing Suite

Comprehensive testing framework for the TwoBirds Fit fitness application.

## Table of Contents
- [Overview](#overview)
- [Test Types](#test-types)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [CI/CD Integration](#cicd-integration)

## Overview

This testing suite provides complete coverage for the TwoBirds Fit application, including:
- Backend API tests
- Frontend component tests
- End-to-end tests
- Performance tests
- Mobile app tests
- Security tests

## Test Types

### 1. Backend API Tests (`backend/`)
- Unit tests for business logic
- Integration tests for API endpoints
- Database integration tests
- Authentication & authorization tests
- Third-party service integration tests

### 2. Frontend Tests (`frontend/`)
- Component unit tests
- Integration tests
- Hook tests
- Redux/state management tests
- Accessibility tests

### 3. E2E Tests (`e2e/`)
- User journey tests
- Cross-browser tests
- Responsive design tests
- Critical path testing

### 4. Performance Tests (`performance/`)
- Load testing
- Stress testing
- API performance benchmarks
- Frontend performance metrics

### 5. Mobile Tests (`mobile/`)
- React Native component tests
- Native module tests
- Platform-specific tests (iOS/Android)
- Gesture and navigation tests

### 6. Security Tests (`security/`)
- Authentication vulnerability tests
- SQL injection tests
- XSS prevention tests
- API security tests

## Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose

### Installation

```bash
# Install all test dependencies
npm install

# Install Python dependencies
pip install -r tests/requirements.txt

# Setup Playwright browsers
npx playwright install
```

## Running Tests

### All Tests
```bash
npm test
```

### Backend Tests
```bash
# Unit tests
cd tests/backend
pytest tests/unit -v

# Integration tests
pytest tests/integration -v

# With coverage
pytest --cov=app --cov-report=html
```

### Frontend Tests
```bash
# Unit tests
npm run test:frontend

# Watch mode
npm run test:frontend:watch

# Coverage
npm run test:frontend:coverage
```

### E2E Tests
```bash
# All E2E tests
npm run test:e2e

# Specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Headed mode (see browser)
npm run test:e2e:headed
```

### Performance Tests
```bash
# Start load tests
cd tests/performance
locust -f load_tests.py
```

### Mobile Tests
```bash
# iOS
npm run test:mobile:ios

# Android
npm run test:mobile:android
```

## Test Coverage

Coverage reports are generated in the following locations:
- Backend: `tests/backend/coverage/`
- Frontend: `tests/frontend/coverage/`
- E2E: `tests/e2e/coverage/`

Minimum coverage thresholds:
- Backend: 80%
- Frontend: 75%
- E2E: Critical paths must pass

## CI/CD Integration

Tests are automatically run on:
- Pull requests
- Merges to main/develop branches
- Nightly builds

See `.github/workflows/` for CI configuration.

## Writing New Tests

### Backend Test Example
```python
import pytest
from app.models import User

def test_user_creation():
    user = User(email="test@example.com", name="Test User")
    assert user.email == "test@example.com"
```

### Frontend Test Example
```javascript
import { render, screen } from '@testing-library/react';
import WorkoutCard from './WorkoutCard';

test('renders workout card with correct data', () => {
  render(<WorkoutCard title="Morning Run" duration={30} />);
  expect(screen.getByText('Morning Run')).toBeInTheDocument();
});
```

### E2E Test Example
```javascript
test('user can complete a workout', async ({ page }) => {
  await page.goto('/workouts');
  await page.click('text=Start Workout');
  await page.fill('[name="duration"]', '30');
  await page.click('text=Complete');
  await expect(page).toHaveURL('/workouts/complete');
});
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Clarity**: Test names should describe what they test
3. **Speed**: Keep unit tests fast, move slow tests to integration
4. **Data**: Use fixtures and factories for test data
5. **Cleanup**: Always clean up after tests (database, files, etc.)

## Troubleshooting

### Common Issues

**Tests timing out**
- Increase timeout in test config
- Check if services are running

**Flaky tests**
- Add proper waits in E2E tests
- Check for race conditions

**Database issues**
- Ensure test database is properly seeded
- Check migrations are up to date

## Contact

For questions about testing, contact the QA team or see the main project README.
