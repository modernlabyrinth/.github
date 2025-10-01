# TwoBirds Fit - Complete Testing Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Testing Philosophy](#testing-philosophy)
3. [Test Types](#test-types)
4. [Quick Start](#quick-start)
5. [Running Tests Locally](#running-tests-locally)
6. [Writing Tests](#writing-tests)
7. [Best Practices](#best-practices)
8. [CI/CD](#cicd)
9. [Troubleshooting](#troubleshooting)

## Introduction

This guide provides comprehensive documentation for testing the TwoBirds Fit application. Our testing suite ensures code quality, prevents regressions, and maintains system reliability.

## Testing Philosophy

### Testing Pyramid

```
       /\
      /  \
     / E2E \          - End-to-End Tests (10%)
    /______\
   /        \
  /Integration\       - Integration Tests (30%)
 /____________\
/              \
/  Unit Tests   \     - Unit Tests (60%)
/________________\
```

### Core Principles

1. **Fast Feedback**: Tests should run quickly in development
2. **Reliability**: Tests should be deterministic and not flaky
3. **Maintainability**: Tests should be easy to understand and update
4. **Coverage**: Aim for high coverage but focus on critical paths
5. **Isolation**: Each test should be independent

## Test Types

### 1. Unit Tests
- **Purpose**: Test individual functions and components in isolation
- **Location**: `backend/tests/unit/`, `frontend/tests/`
- **Speed**: Very fast (milliseconds)
- **When to use**: Testing business logic, utilities, pure functions

### 2. Integration Tests
- **Purpose**: Test interactions between components
- **Location**: `backend/tests/integration/`
- **Speed**: Fast to medium (seconds)
- **When to use**: Testing API endpoints, database operations

### 3. E2E Tests
- **Purpose**: Test complete user journeys
- **Location**: `e2e/tests/`
- **Speed**: Slow (minutes)
- **When to use**: Critical user paths, smoke tests

### 4. Performance Tests
- **Purpose**: Ensure system performs under load
- **Location**: `performance/`
- **Speed**: Slow (minutes to hours)
- **When to use**: Before releases, weekly regression

### 5. Mobile Tests
- **Purpose**: Test mobile app functionality
- **Location**: `mobile/tests/`
- **Speed**: Medium to slow
- **When to use**: Mobile-specific features, gestures

### 6. Security Tests
- **Purpose**: Identify security vulnerabilities
- **Location**: Integrated in CI/CD
- **Speed**: Medium
- **When to use**: Every commit, dependency updates

## Quick Start

### Prerequisites
```bash
# Install Node.js 18+
node --version

# Install Python 3.10+
python --version

# Install Docker
docker --version
```

### Initial Setup
```bash
# Clone repository
git clone https://github.com/modernlabyrinth/twobirds-fit.git
cd twobirds-fit

# Install all dependencies
cd tests
npm install
pip install -r requirements.txt

# Setup Playwright
npx playwright install

# Setup environment
cp .env.example .env.test
```

### Run All Tests
```bash
npm test
```

## Running Tests Locally

### Backend Tests

```bash
# All backend tests
cd tests/backend
pytest

# Specific test file
pytest tests/unit/test_user_model.py

# Specific test
pytest tests/unit/test_user_model.py::TestUserModel::test_user_creation

# With coverage
pytest --cov=app --cov-report=html

# Watch mode (requires pytest-watch)
ptw
```

### Frontend Tests

```bash
# All frontend tests
npm run test:frontend

# Watch mode
npm run test:frontend:watch

# Coverage
npm run test:frontend:coverage

# Specific test file
npm run test:frontend -- WorkoutCard.test.tsx

# Update snapshots
npm run test:frontend -- -u
```

### E2E Tests

```bash
# All E2E tests
npm run test:e2e

# Specific browser
npm run test:e2e:chromium

# Headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# Specific test file
npx playwright test e2e/tests/auth.spec.ts
```

### Performance Tests

```bash
# Load tests (web UI)
cd tests/performance
locust -f load_tests.py

# Load tests (headless)
locust -f load_tests.py --headless -u 100 -r 10 -t 60s

# API benchmarks
python api_benchmarks.py
```

### Mobile Tests

```bash
# iOS
npm run test:mobile:ios

# Android
npm run test:mobile:android

# Build and test
detox build --configuration ios.sim.debug
detox test --configuration ios.sim.debug
```

## Writing Tests

### Backend Unit Test Example

```python
# tests/backend/tests/unit/test_workout_service.py
import pytest
from app.services import WorkoutService

class TestWorkoutService:
    def test_calculate_calories(self):
        """Test calorie calculation."""
        service = WorkoutService()
        calories = service.calculate_calories(
            duration_minutes=30,
            weight_kg=70,
            met_value=8.0
        )
        assert calories == pytest.approx(186.67, rel=0.1)
```

### Frontend Component Test Example

```typescript
// tests/frontend/tests/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Test Example

```typescript
// tests/e2e/tests/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('complete workout creation flow', async ({ page }) => {
  await page.goto('/workouts');
  await page.click('text=New Workout');
  await page.fill('[name="title"]', 'Test Workout');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/.*workouts\/\d+/);
  await expect(page.locator('text=Test Workout')).toBeVisible();
});
```

## Best Practices

### General

1. **Descriptive Names**: Test names should describe what they test
   ```python
   # Good
   def test_user_login_with_valid_credentials():
   
   # Bad
   def test_login():
   ```

2. **AAA Pattern**: Arrange, Act, Assert
   ```python
   def test_workout_creation():
       # Arrange
       user = create_test_user()
       workout_data = {"title": "Test"}
       
       # Act
       result = create_workout(user, workout_data)
       
       # Assert
       assert result.title == "Test"
   ```

3. **One Assertion Per Test**: Focus on single behavior
   ```python
   # Good
   def test_workout_title():
       assert workout.title == "Morning Run"
   
   def test_workout_duration():
       assert workout.duration == 30
   ```

4. **Use Fixtures**: Share setup code
   ```python
   @pytest.fixture
   def workout():
       return Workout(title="Test", duration=30)
   
   def test_workout(workout):
       assert workout.title == "Test"
   ```

### Backend-Specific

1. **Mock External Services**: Don't hit real APIs
   ```python
   @patch('app.services.email.send_email')
   def test_send_welcome_email(mock_send):
       send_welcome_email('test@example.com')
       mock_send.assert_called_once()
   ```

2. **Test Database Isolation**: Each test should have clean state
3. **Test Edge Cases**: Not just happy paths
4. **Use Parametrize**: Test multiple inputs
   ```python
   @pytest.mark.parametrize("duration,expected", [
       (30, 250),
       (60, 500),
   ])
   def test_calories(duration, expected):
       assert calculate_calories(duration) == expected
   ```

### Frontend-Specific

1. **Query by Accessibility**: Use accessible queries
   ```typescript
   // Good
   screen.getByRole('button', { name: /submit/i })
   
   // Avoid
   document.querySelector('.submit-btn')
   ```

2. **Wait for Async**: Don't forget async operations
   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument();
   });
   ```

3. **Test User Interactions**: Simulate real user behavior
   ```typescript
   await userEvent.type(input, 'test');
   await userEvent.click(button);
   ```

### E2E-Specific

1. **Stable Selectors**: Use data-testid
   ```html
   <button data-testid="submit-button">Submit</button>
   ```

2. **Wait for Elements**: Use proper waits
   ```typescript
   await page.waitForSelector('[data-testid="result"]');
   ```

3. **Minimize Brittle Tests**: Don't rely on exact text
   ```typescript
   // Good
   expect(page.locator('text=Success')).toBeVisible();
   
   // Avoid
   expect(page.locator('text=Congratulations! Your workout has been successfully created.')).toBeVisible();
   ```

## CI/CD

### GitHub Actions

All tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- Nightly builds
- Manual triggers

### Workflow Files

- `test-backend.yml`: Backend unit & integration tests
- `test-frontend.yml`: Frontend component tests
- `test-e2e.yml`: End-to-end tests
- `test-mobile.yml`: Mobile app tests
- `test-performance.yml`: Performance tests
- `test-security.yml`: Security scans
- `test-all.yml`: Complete test suite

### Status Checks

Required checks for PRs:
- ✅ Backend tests pass
- ✅ Frontend tests pass
- ✅ E2E tests pass
- ✅ 80% code coverage
- ✅ No security vulnerabilities
- ✅ Linting passes

## Troubleshooting

### Common Issues

#### Tests Timing Out
```bash
# Increase timeout
pytest --timeout=300

# For Playwright
npx playwright test --timeout=60000
```

#### Flaky Tests
```bash
# Run multiple times to identify
pytest --count=10 tests/test_flaky.py

# For Playwright
npx playwright test --repeat-each=5
```

#### Database Issues
```bash
# Reset test database
psql -U test -d twobirds_test -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Run migrations
alembic upgrade head
```

#### Port Already in Use
```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9
```

### Debug Mode

#### Backend
```python
# Add breakpoint
import pdb; pdb.set_trace()

# Run with verbose output
pytest -vv -s
```

#### Frontend
```typescript
// Add debug output
screen.debug();

// Run with debug
npm run test:frontend -- --watch --verbose
```

#### E2E
```bash
# Run in headed mode
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# Slow motion
npx playwright test --slow-mo=1000
```

### Getting Help

1. Check test output and logs
2. Review test documentation
3. Search existing issues
4. Ask team in #testing channel
5. Create detailed bug report

## Resources

### Documentation
- [Pytest Documentation](https://docs.pytest.org/)
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Locust Documentation](https://locust.io/)
- [Detox Documentation](https://wix.github.io/Detox/)

### Tools
- [Testing Library](https://testing-library.com/)
- [Jest-Axe](https://github.com/nickcolley/jest-axe)
- [Faker.js](https://fakerjs.dev/)
- [Factory Boy](https://factoryboy.readthedocs.io/)

### Books
- "Test Driven Development" by Kent Beck
- "Growing Object-Oriented Software, Guided by Tests"
- "The Art of Unit Testing"

## Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update documentation
5. Follow testing conventions

## Questions?

Contact the QA team or open an issue in the repository.
