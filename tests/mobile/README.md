# Mobile App Tests

End-to-end tests for TwoBirds Fit mobile application using Detox.

## Overview

This directory contains E2E tests for React Native mobile app on both iOS and Android platforms.

## Prerequisites

### iOS
- macOS with Xcode installed
- CocoaPods: `sudo gem install cocoapods`
- iOS Simulator

### Android
- Android Studio
- Android SDK
- Android Emulator configured

### Common
- Node.js 18+
- Detox CLI: `npm install -g detox-cli`

## Setup

### Install Dependencies
```bash
npm install
```

### iOS Setup
```bash
cd ios && pod install && cd ..
```

### Android Setup
```bash
cd android && ./gradlew clean && cd ..
```

### Build Test App

**iOS:**
```bash
detox build --configuration ios.sim.debug
```

**Android:**
```bash
detox build --configuration android.emu.debug
```

## Running Tests

### iOS Tests
```bash
# Run all tests
detox test --configuration ios.sim.debug

# Run specific test file
detox test --configuration ios.sim.debug tests/auth.test.ts

# Run in headed mode
detox test --configuration ios.sim.debug --headless false
```

### Android Tests
```bash
# Run all tests
detox test --configuration android.emu.debug

# Run specific test file
detox test --configuration android.emu.debug tests/auth.test.ts
```

## Test Structure

```
mobile/
├── tests/
│   ├── auth.test.ts           # Authentication flows
│   ├── workout.test.ts        # Workout management
│   ├── navigation.test.ts     # Navigation tests
│   ├── offline.test.ts        # Offline mode tests
│   └── gestures.test.ts       # Gesture interactions
├── .detoxrc.json              # Detox configuration
├── jest.config.js             # Jest configuration
└── jest.setup.js              # Test setup
```

## Writing Tests

### Basic Test Structure
```typescript
import { device, element, by, expect as detoxExpect } from 'detox';

describe('Feature Name', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should do something', async () => {
    await element(by.id('element-id')).tap();
    await detoxExpect(element(by.text('Result'))).toBeVisible();
  });
});
```

### Matchers
```typescript
// Visibility
await detoxExpect(element(by.id('element'))).toBeVisible();
await detoxExpect(element(by.id('element'))).not.toBeVisible();

// Text
await detoxExpect(element(by.id('label'))).toHaveText('Hello');
await detoxExpect(element(by.id('input'))).toHaveValue('value');

// Existence
await detoxExpect(element(by.id('element'))).toExist();
```

### Actions
```typescript
// Tap
await element(by.id('button')).tap();
await element(by.id('button')).multiTap(3);
await element(by.id('button')).longPress();

// Type
await element(by.id('input')).typeText('Hello');
await element(by.id('input')).replaceText('World');
await element(by.id('input')).clearText();

// Scroll
await element(by.id('list')).scrollTo('bottom');
await element(by.id('list')).scroll(100, 'down');

// Swipe
await element(by.id('view')).swipe('up', 'fast');
await element(by.id('view')).swipe('left', 'slow', 0.75);
```

### Matchers and Selectors
```typescript
// By ID
by.id('element-id')

// By text
by.text('Button Label')

// By label (accessibility label)
by.label('Submit')

// By type (component type)
by.type('RCTScrollView')

// At index
element(by.id('list-item')).atIndex(0)
```

## Debugging

### Run in Debug Mode
```bash
detox test --configuration ios.sim.debug --loglevel trace
```

### Take Screenshots
```typescript
await device.takeScreenshot('test-screenshot');
```

### Record Video
Tests automatically record video on failure. Videos are saved to:
- iOS: `artifacts/ios/video/`
- Android: `artifacts/android/video/`

### View Test Artifacts
All test artifacts (screenshots, videos, logs) are stored in the `artifacts/` directory.

## Platform-Specific Tests

### iOS Only
```typescript
if (device.getPlatform() === 'ios') {
  // iOS-specific test
}
```

### Android Only
```typescript
if (device.getPlatform() === 'android') {
  // Android-specific test
}
```

## Best Practices

1. **Use testID**: Add `testID` props to React Native components
   ```jsx
   <Button testID="submit-button" title="Submit" />
   ```

2. **Wait for Elements**: Always wait for async operations
   ```typescript
   await waitFor(element(by.id('result')))
     .toBeVisible()
     .withTimeout(5000);
   ```

3. **Avoid Hardcoded Delays**: Use `waitFor` instead of `setTimeout`

4. **Test on Both Platforms**: Run tests on iOS and Android

5. **Use Accessibility Labels**: Helps with testing and accessibility
   ```jsx
   <View accessible={true} accessibilityLabel="Main Content">
   ```

6. **Reset App State**: Clean state between tests
   ```typescript
   beforeEach(async () => {
     await device.reloadReactNative();
   });
   ```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run iOS Tests
  run: |
    detox build --configuration ios.sim.debug
    detox test --configuration ios.sim.debug --cleanup

- name: Run Android Tests
  run: |
    detox build --configuration android.emu.debug
    detox test --configuration android.emu.debug --cleanup

- name: Upload Test Artifacts
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: detox-artifacts
    path: artifacts/
```

## Troubleshooting

### iOS Simulator Issues
```bash
# Reset simulator
xcrun simctl erase all

# List available simulators
xcrun simctl list devices
```

### Android Emulator Issues
```bash
# List emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_5_API_31
```

### Build Issues
```bash
# Clean iOS build
cd ios && rm -rf build && pod install && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..
```

### App Not Installing
```bash
# Uninstall app
detox test --configuration ios.sim.debug --cleanup

# Or manually
xcrun simctl uninstall booted com.twobirdsfit
```

## Performance Testing

Tests also measure performance metrics:
- App launch time
- Screen transition time
- List scroll performance
- Animation frame rates

Performance reports are generated in `artifacts/performance/`.

## Accessibility Testing

Tests include accessibility checks:
- Element labels
- Touch target sizes
- Color contrast
- Screen reader compatibility

## Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
