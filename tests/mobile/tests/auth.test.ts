/**
 * Mobile E2E tests for authentication
 */
import { device, element, by, expect as detoxExpect } from 'detox';

describe('Mobile Authentication', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen on app launch', async () => {
    await detoxExpect(element(by.id('login-screen'))).toBeVisible();
  });

  it('should allow user to login', async () => {
    await element(by.id('email-input')).typeText('test@twobirds.fit');
    await element(by.id('password-input')).typeText('SecureP@ssw0rd!');
    await element(by.id('login-button')).tap();

    await detoxExpect(element(by.id('dashboard-screen'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('test@twobirds.fit');
    await element(by.id('password-input')).typeText('WrongPassword');
    await element(by.id('login-button')).tap();

    await detoxExpect(element(by.text('Invalid credentials'))).toBeVisible();
  });

  it('should navigate to signup screen', async () => {
    await element(by.id('signup-link')).tap();
    await detoxExpect(element(by.id('signup-screen'))).toBeVisible();
  });

  it('should complete signup flow', async () => {
    await element(by.id('signup-link')).tap();
    
    await element(by.id('email-input')).typeText('newuser@twobirds.fit');
    await element(by.id('username-input')).typeText('newuser');
    await element(by.id('password-input')).typeText('SecureP@ssw0rd!');
    await element(by.id('confirm-password-input')).typeText('SecureP@ssw0rd!');
    
    await element(by.id('signup-button')).tap();

    await detoxExpect(element(by.id('dashboard-screen'))).toBeVisible();
  });

  it('should logout user', async () => {
    // Login first
    await element(by.id('email-input')).typeText('test@twobirds.fit');
    await element(by.id('password-input')).typeText('SecureP@ssw0rd!');
    await element(by.id('login-button')).tap();

    // Navigate to profile
    await element(by.id('profile-tab')).tap();
    
    // Logout
    await element(by.id('logout-button')).tap();

    await detoxExpect(element(by.id('login-screen'))).toBeVisible();
  });

  it('should handle password visibility toggle', async () => {
    await element(by.id('password-input')).typeText('SecureP@ssw0rd!');
    await element(by.id('toggle-password-visibility')).tap();
    
    // Password should be visible
    await detoxExpect(element(by.id('password-input'))).toHaveValue('SecureP@ssw0rd!');
  });

  it('should navigate to forgot password screen', async () => {
    await element(by.id('forgot-password-link')).tap();
    await detoxExpect(element(by.id('forgot-password-screen'))).toBeVisible();
  });
});
