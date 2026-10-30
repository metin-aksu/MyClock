/* eslint-env jest */

require('react-native').NativeModules.ScreenBrightness = {
  setBrightness: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-device-info', () => ({
  getBatteryLevel: jest.fn(() => Promise.resolve(0.5)),
}));

jest.mock('react-native-keep-awake', () => ({
  activate: jest.fn(),
  deactivate: jest.fn(),
}));

jest.mock('react-native-orientation-locker', () => ({
  lockToPortrait: jest.fn(),
  lockToLandscape: jest.fn(),
  unlockAllOrientations: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const insets = {top: 0, bottom: 0, left: 0, right: 0};
  return {
    SafeAreaProvider: ({children}) => children,
    useSafeAreaInsets: () => insets,
  };
});

jest.mock('react-native-svg', () => {
  const Mock = () => null;
  return {__esModule: true, default: Mock, Circle: Mock, Line: Mock, Text: Mock};
});

jest.mock('@react-native-community/slider', () => () => null);

jest.mock('react-native-wheel-color-picker', () => () => null);
