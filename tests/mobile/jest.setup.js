const { device } = require('detox');

beforeAll(async () => {
  await device.launchApp({
    permissions: { notifications: 'YES', location: 'always' },
    newInstance: true,
  });
});

beforeEach(async () => {
  await device.reloadReactNative();
});

afterAll(async () => {
  await device.terminateApp();
});
