/**
 * Mobile E2E tests for workout functionality
 */
import { device, element, by, expect as detoxExpect, waitFor } from 'detox';

describe('Mobile Workout Management', () => {
  beforeAll(async () => {
    // Login before running workout tests
    await element(by.id('email-input')).typeText('test@twobirds.fit');
    await element(by.id('password-input')).typeText('SecureP@ssw0rd!');
    await element(by.id('login-button')).tap();
    await waitFor(element(by.id('dashboard-screen'))).toBeVisible().withTimeout(5000);
  });

  beforeEach(async () => {
    // Navigate back to workouts list
    await element(by.id('workouts-tab')).tap();
  });

  it('should display workouts list', async () => {
    await detoxExpect(element(by.id('workouts-list'))).toBeVisible();
  });

  it('should create a new workout', async () => {
    await element(by.id('add-workout-button')).tap();
    
    await element(by.id('workout-title-input')).typeText('Morning Run');
    await element(by.id('workout-description-input')).typeText('5K run');
    await element(by.id('workout-type-picker')).tap();
    await element(by.text('Cardio')).tap();
    await element(by.id('duration-input')).typeText('30');
    
    await element(by.id('save-workout-button')).tap();

    await waitFor(element(by.text('Morning Run'))).toBeVisible().withTimeout(3000);
  });

  it('should view workout details', async () => {
    await element(by.id('workout-card')).atIndex(0).tap();
    
    await detoxExpect(element(by.id('workout-detail-screen'))).toBeVisible();
    await detoxExpect(element(by.id('workout-title'))).toBeVisible();
    await detoxExpect(element(by.id('workout-duration'))).toBeVisible();
  });

  it('should edit a workout', async () => {
    await element(by.id('workout-card')).atIndex(0).tap();
    await element(by.id('edit-workout-button')).tap();
    
    await element(by.id('workout-title-input')).clearText();
    await element(by.id('workout-title-input')).typeText('Updated Workout');
    
    await element(by.id('save-workout-button')).tap();

    await detoxExpect(element(by.text('Updated Workout'))).toBeVisible();
  });

  it('should delete a workout', async () => {
    await element(by.id('workout-card')).atIndex(0).tap();
    await element(by.id('delete-workout-button')).tap();
    
    // Confirm deletion
    await element(by.text('Confirm')).tap();

    await detoxExpect(element(by.id('workouts-list'))).toBeVisible();
  });

  it('should filter workouts by type', async () => {
    await element(by.id('filter-button')).tap();
    await element(by.text('Cardio')).tap();
    
    // All visible workouts should be cardio type
    await detoxExpect(element(by.id('workouts-list'))).toBeVisible();
  });

  it('should search workouts', async () => {
    await element(by.id('search-input')).typeText('run');
    
    await waitFor(element(by.id('workout-card'))).toBeVisible().withTimeout(2000);
  });

  it('should mark workout as completed', async () => {
    await element(by.id('workout-card')).atIndex(0).tap();
    await element(by.id('complete-workout-button')).tap();
    
    await detoxExpect(element(by.id('workout-completed-badge'))).toBeVisible();
  });

  it('should add exercise to workout', async () => {
    await element(by.id('add-workout-button')).tap();
    
    await element(by.id('workout-title-input')).typeText('Strength Training');
    await element(by.id('workout-type-picker')).tap();
    await element(by.text('Strength')).tap();
    
    // Add exercise
    await element(by.id('add-exercise-button')).tap();
    await element(by.id('exercise-name-input')).typeText('Push-ups');
    await element(by.id('sets-input')).typeText('3');
    await element(by.id('reps-input')).typeText('10');
    await element(by.id('add-exercise-confirm')).tap();
    
    await element(by.id('save-workout-button')).tap();

    await detoxExpect(element(by.text('Strength Training'))).toBeVisible();
  });

  it('should handle pull-to-refresh', async () => {
    await element(by.id('workouts-list')).swipe('down', 'fast', 0.8);
    
    await waitFor(element(by.id('refresh-indicator'))).toBeVisible().withTimeout(1000);
    await waitFor(element(by.id('refresh-indicator'))).not.toBeVisible().withTimeout(3000);
  });

  it('should handle infinite scroll', async () => {
    await element(by.id('workouts-list')).scrollTo('bottom');
    
    // More workouts should load
    await waitFor(element(by.id('loading-more'))).toBeVisible().withTimeout(2000);
  });
});
