/**
 * E2E tests for workout management
 */
import { test, expect } from '@playwright/test';

test.describe('Workout Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@twobirds.fit');
    await page.fill('[name="password"]', 'SecureP@ssw0rd!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('user can create a new workout', async ({ page }) => {
    await page.click('text=New Workout');
    
    await page.fill('[name="title"]', 'Morning Run');
    await page.fill('[name="description"]', '5K run in the park');
    await page.selectOption('[name="workoutType"]', 'cardio');
    await page.fill('[name="duration"]', '30');
    await page.fill('[name="caloriesBurned"]', '250');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Workout created successfully')).toBeVisible();
    await expect(page.locator('text=Morning Run')).toBeVisible();
  });

  test('user can view workout details', async ({ page }) => {
    // Click on a workout card
    await page.click('[data-testid="workout-card"]').first();
    
    await expect(page).toHaveURL(/.*workouts\/\d+/);
    await expect(page.locator('[data-testid="workout-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="workout-duration"]')).toBeVisible();
  });

  test('user can edit a workout', async ({ page }) => {
    await page.click('[data-testid="workout-card"]').first();
    await page.click('text=Edit');
    
    await page.fill('[name="title"]', 'Updated Workout Title');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Workout updated successfully')).toBeVisible();
    await expect(page.locator('text=Updated Workout Title')).toBeVisible();
  });

  test('user can delete a workout', async ({ page }) => {
    const workoutCount = await page.locator('[data-testid="workout-card"]').count();
    
    await page.click('[data-testid="workout-card"]').first();
    await page.click('text=Delete');
    
    // Confirm deletion
    await page.click('text=Confirm');
    
    await expect(page.locator('text=Workout deleted')).toBeVisible();
    
    // Verify workout count decreased
    const newCount = await page.locator('[data-testid="workout-card"]').count();
    expect(newCount).toBe(workoutCount - 1);
  });

  test('user can filter workouts by type', async ({ page }) => {
    await page.selectOption('[name="filterType"]', 'cardio');
    
    // All visible workouts should be cardio
    const workouts = page.locator('[data-testid="workout-card"]');
    const count = await workouts.count();
    
    for (let i = 0; i < count; i++) {
      await expect(workouts.nth(i).locator('[data-workout-type="cardio"]')).toBeVisible();
    }
  });

  test('user can search workouts', async ({ page }) => {
    await page.fill('[placeholder="Search workouts"]', 'run');
    
    // Should show only workouts matching search
    await expect(page.locator('[data-testid="workout-card"]')).toContainText('run', { ignoreCase: true });
  });

  test('user can mark workout as completed', async ({ page }) => {
    await page.click('[data-testid="workout-card"]').first();
    await page.click('text=Mark as Complete');
    
    await expect(page.locator('[data-completed="true"]')).toBeVisible();
  });

  test('user can add exercises to workout', async ({ page }) => {
    await page.click('text=New Workout');
    
    await page.fill('[name="title"]', 'Strength Training');
    await page.selectOption('[name="workoutType"]', 'strength');
    
    // Add exercise
    await page.click('text=Add Exercise');
    await page.fill('[name="exerciseName"]', 'Push-ups');
    await page.fill('[name="sets"]', '3');
    await page.fill('[name="reps"]', '10');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Workout created successfully')).toBeVisible();
  });

  test('displays workout statistics', async ({ page }) => {
    await page.click('text=Statistics');
    
    await expect(page.locator('[data-testid="total-workouts"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-duration"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-calories"]')).toBeVisible();
  });

  test('workout form validation', async ({ page }) => {
    await page.click('text=New Workout');
    
    // Try to submit without required fields
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Duration is required')).toBeVisible();
  });

  test('pagination works correctly', async ({ page }) => {
    // Assuming there are multiple pages of workouts
    const firstPageWorkout = await page.locator('[data-testid="workout-card"]').first().textContent();
    
    await page.click('text=Next');
    
    const secondPageWorkout = await page.locator('[data-testid="workout-card"]').first().textContent();
    
    expect(firstPageWorkout).not.toBe(secondPageWorkout);
  });
});
