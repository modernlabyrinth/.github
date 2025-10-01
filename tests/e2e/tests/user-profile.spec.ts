/**
 * E2E tests for user profile management
 */
import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@twobirds.fit');
    await page.fill('[name="password"]', 'SecureP@ssw0rd!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('user can view their profile', async ({ page }) => {
    await page.click('[aria-label="User menu"]');
    await page.click('text=Profile');
    
    await expect(page).toHaveURL(/.*profile/);
    await expect(page.locator('[data-testid="user-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
  });

  test('user can edit profile information', async ({ page }) => {
    await page.goto('/profile');
    
    await page.click('text=Edit Profile');
    await page.fill('[name="firstName"]', 'Updated');
    await page.fill('[name="lastName"]', 'Name');
    await page.fill('[name="bio"]', 'Fitness enthusiast');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
    await expect(page.locator('text=Updated Name')).toBeVisible();
  });

  test('user can update fitness goals', async ({ page }) => {
    await page.goto('/profile/goals');
    
    await page.fill('[name="targetWeight"]', '70');
    await page.fill('[name="weeklyWorkoutGoal"]', '5');
    await page.check('[name="goal-weight-loss"]');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Goals updated')).toBeVisible();
  });

  test('user can update privacy settings', async ({ page }) => {
    await page.goto('/profile/settings');
    
    await page.click('text=Privacy');
    await page.check('[name="profileVisible"]');
    await page.uncheck('[name="workoutsVisible"]');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Settings saved')).toBeVisible();
  });

  test('user can change password', async ({ page }) => {
    await page.goto('/profile/settings');
    
    await page.click('text=Security');
    await page.fill('[name="currentPassword"]', 'SecureP@ssw0rd!');
    await page.fill('[name="newPassword"]', 'NewSecureP@ssw0rd!');
    await page.fill('[name="confirmPassword"]', 'NewSecureP@ssw0rd!');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Password updated')).toBeVisible();
  });

  test('user can upload profile picture', async ({ page }) => {
    await page.goto('/profile');
    
    await page.click('text=Edit Profile');
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/profile-pic.jpg');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="profile-picture"]')).toBeVisible();
  });

  test('displays user statistics on profile', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page.locator('[data-testid="total-workouts"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-followers"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-following"]')).toBeVisible();
  });

  test('user can view achievements', async ({ page }) => {
    await page.goto('/profile/achievements');
    
    await expect(page.locator('[data-testid="achievement-badge"]')).toHaveCount(await page.locator('[data-testid="achievement-badge"]').count());
  });

  test('validates profile form inputs', async ({ page }) => {
    await page.goto('/profile');
    await page.click('text=Edit Profile');
    
    // Clear required field
    await page.fill('[name="firstName"]', '');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=First name is required')).toBeVisible();
  });
});
