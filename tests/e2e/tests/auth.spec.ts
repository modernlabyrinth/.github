/**
 * E2E tests for authentication flows
 */
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('user can register a new account', async ({ page }) => {
    await page.click('text=Sign Up');
    
    await page.fill('[name="email"]', 'newuser@twobirds.fit');
    await page.fill('[name="username"]', 'newuser');
    await page.fill('[name="password"]', 'SecureP@ssw0rd!');
    await page.fill('[name="confirmPassword"]', 'SecureP@ssw0rd!');
    await page.fill('[name="firstName"]', 'New');
    await page.fill('[name="lastName"]', 'User');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('user can login with valid credentials', async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('[name="email"]', 'test@twobirds.fit');
    await page.fill('[name="password"]', 'SecureP@ssw0rd!');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('shows error with invalid credentials', async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('[name="email"]', 'test@twobirds.fit');
    await page.fill('[name="password"]', 'WrongPassword');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('user can logout', async ({ page }) => {
    // First login
    await page.click('text=Login');
    await page.fill('[name="email"]', 'test@twobirds.fit');
    await page.fill('[name="password"]', 'SecureP@ssw0rd!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Then logout
    await page.click('[aria-label="User menu"]');
    await page.click('text=Logout');
    
    await expect(page).toHaveURL('/');
  });

  test('password reset flow', async ({ page }) => {
    await page.click('text=Login');
    await page.click('text=Forgot password?');
    
    await page.fill('[name="email"]', 'test@twobirds.fit');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Check your email')).toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    await page.click('text=Sign Up');
    
    await page.fill('[name="email"]', 'invalid-email');
    await page.fill('[name="password"]', 'SecureP@ssw0rd!');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=valid email')).toBeVisible();
  });

  test('validates password strength', async ({ page }) => {
    await page.click('text=Sign Up');
    
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'weak');
    
    await expect(page.locator('text=Password must be')).toBeVisible();
  });

  test('prevents access to protected routes when not logged in', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});
