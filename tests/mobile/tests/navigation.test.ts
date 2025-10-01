/**
 * Mobile E2E tests for app navigation
 */
import { device, element, by, expect as detoxExpect } from 'detox';

describe('Mobile Navigation', () => {
  beforeAll(async () => {
    // Login
    await element(by.id('email-input')).typeText('test@twobirds.fit');
    await element(by.id('password-input')).typeText('SecureP@ssw0rd!');
    await element(by.id('login-button')).tap();
  });

  it('should navigate between tabs', async () => {
    await element(by.id('dashboard-tab')).tap();
    await detoxExpect(element(by.id('dashboard-screen'))).toBeVisible();

    await element(by.id('workouts-tab')).tap();
    await detoxExpect(element(by.id('workouts-screen'))).toBeVisible();

    await element(by.id('stats-tab')).tap();
    await detoxExpect(element(by.id('stats-screen'))).toBeVisible();

    await element(by.id('profile-tab')).tap();
    await detoxExpect(element(by.id('profile-screen'))).toBeVisible();
  });

  it('should navigate back from detail screens', async () => {
    await element(by.id('workouts-tab')).tap();
    await element(by.id('workout-card')).atIndex(0).tap();
    
    await detoxExpect(element(by.id('workout-detail-screen'))).toBeVisible();
    
    await element(by.id('back-button')).tap();
    
    await detoxExpect(element(by.id('workouts-screen'))).toBeVisible();
  });

  it('should handle deep linking', async () => {
    // Simulate deep link to specific workout
    await device.openURL({ url: 'twobirdsfit://workouts/1' });
    
    await detoxExpect(element(by.id('workout-detail-screen'))).toBeVisible();
  });

  it('should handle gestures for navigation', async () => {
    await element(by.id('workouts-tab')).tap();
    await element(by.id('workout-card')).atIndex(0).tap();
    
    // Swipe right to go back (iOS gesture)
    if (device.getPlatform() === 'ios') {
      await element(by.id('workout-detail-screen')).swipe('right', 'fast', 0.1, 0.5);
      await detoxExpect(element(by.id('workouts-screen'))).toBeVisible();
    }
  });

  it('should preserve navigation state on app background', async () => {
    await element(by.id('profile-tab')).tap();
    
    // Background and reopen app
    await device.sendToHome();
    await device.launchApp({ newInstance: false });
    
    // Should still be on profile tab
    await detoxExpect(element(by.id('profile-screen'))).toBeVisible();
  });
});
