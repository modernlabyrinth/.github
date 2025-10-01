/**
 * Mobile E2E tests for offline functionality
 */
import { device, element, by, expect as detoxExpect, waitFor } from 'detox';

describe('Mobile Offline Mode', () => {
  beforeAll(async () => {
    // Login
    await element(by.id('email-input')).typeText('test@twobirds.fit');
    await element(by.id('password-input')).typeText('SecureP@ssw0rd!');
    await element(by.id('login-button')).tap();
  });

  it('should show offline indicator when disconnected', async () => {
    await device.setNetworkConnection('none');
    
    await waitFor(element(by.id('offline-indicator'))).toBeVisible().withTimeout(3000);
  });

  it('should cache workouts for offline viewing', async () => {
    // Load workouts while online
    await device.setNetworkConnection('wifi');
    await element(by.id('workouts-tab')).tap();
    await waitFor(element(by.id('workouts-list'))).toBeVisible().withTimeout(3000);
    
    // Go offline
    await device.setNetworkConnection('none');
    
    // Should still see cached workouts
    await detoxExpect(element(by.id('workouts-list'))).toBeVisible();
    await detoxExpect(element(by.id('workout-card')).atIndex(0)).toBeVisible();
  });

  it('should queue actions when offline', async () => {
    await device.setNetworkConnection('none');
    
    // Try to create workout while offline
    await element(by.id('add-workout-button')).tap();
    await element(by.id('workout-title-input')).typeText('Offline Workout');
    await element(by.id('save-workout-button')).tap();
    
    // Should show queued message
    await detoxExpect(element(by.text('Will sync when online'))).toBeVisible();
    
    // Go back online
    await device.setNetworkConnection('wifi');
    
    // Should sync automatically
    await waitFor(element(by.text('Synced'))).toBeVisible().withTimeout(5000);
  });

  it('should handle network recovery gracefully', async () => {
    await device.setNetworkConnection('none');
    await waitFor(element(by.id('offline-indicator'))).toBeVisible().withTimeout(2000);
    
    await device.setNetworkConnection('wifi');
    await waitFor(element(by.id('offline-indicator'))).not.toBeVisible().withTimeout(3000);
  });

  afterAll(async () => {
    // Restore network connection
    await device.setNetworkConnection('wifi');
  });
});
