/**
 * @format
 */

import React from 'react';
import {act, create, ReactTestRenderer} from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState, Image, Modal, NativeModules, Text} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {it, expect, jest, beforeEach} from '@jest/globals';

import App from '../src/App';
import Settings from '../src/Settings';
import {getBatteryPercentage} from '../src/utils';

const renderApp = async () => {
  let tree: ReactTestRenderer;
  await act(async () => {
    tree = create(<App />);
  });
  return tree!;
};

const openSettings = async (tree: ReactTestRenderer) => {
  const pressables = tree.root.findAll(
    node => typeof node.props.onPress === 'function',
  );
  await act(async () => {
    pressables[pressables.length - 1].props.onPress();
  });
};

const allText = (tree: ReactTestRenderer) =>
  tree.root
    .findAllByType(Text)
    .map(node => [node.props.children].flat().join(''))
    .join(' ');

beforeEach(async () => {
  jest.useFakeTimers({now: new Date(2026, 9, 30, 12, 0, 0)});
  jest.clearAllMocks();
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

it('renders the saved settings on start', async () => {
  await AsyncStorage.setItem('showDate', 'false');
  const tree = await renderApp();
  expect(allText(tree)).toContain('50%');
  expect(allText(tree)).not.toContain('2026');
});

it('keeps the orientation lock when settings are opened', async () => {
  await AsyncStorage.setItem('orientation', 'portrait');
  const setItem = jest.spyOn(AsyncStorage, 'setItem');
  setItem.mockClear();
  const tree = await renderApp();

  await openSettings(tree);
  expect(tree.root.findAllByType(Settings)).toHaveLength(1);

  expect(setItem).not.toHaveBeenCalledWith('orientation', expect.anything());
  expect(await AsyncStorage.getItem('orientation')).toBe('portrait');
  expect(Orientation.lockToPortrait).toHaveBeenCalled();
  expect(Orientation.unlockAllOrientations).not.toHaveBeenCalled();
});

it('tints the clock for a light background', async () => {
  await AsyncStorage.setItem('backgroundColor', '#FFFF00');
  const tree = await renderApp();
  const colors = tree.root
    .findAllByType(Image)
    .flatMap(node => [node.props.style].flat(2))
    .map(style => style?.tintColor)
    .filter(Boolean);
  expect(colors.length).toBeGreaterThan(0);
  colors.forEach(color => expect(color).toBe('#000000'));
});

it('refreshes the battery level with the resolved value', async () => {
  const tree = await renderApp();
  expect(allText(tree)).toContain('50%');
  await act(async () => {
    jest.advanceTimersByTime(60000);
  });
  expect(allText(tree)).toContain('50%');
  expect(await getBatteryPercentage()).toBe(50);
});

const lastScreenBrightness = () =>
  (NativeModules.ScreenBrightness.setBrightness as jest.Mock).mock.lastCall?.[0];

it('follows the system brightness by default', async () => {
  await renderApp();
  expect(lastScreenBrightness()).toBe(-1);
});

it('applies the saved screen brightness', async () => {
  await AsyncStorage.setItem('customScreenBrightness', 'true');
  await AsyncStorage.setItem('screenBrightness', '0.4');
  await renderApp();
  expect(lastScreenBrightness()).toBe(0.4);
});

it('reapplies the screen brightness when the app returns to the foreground', async () => {
  await AsyncStorage.setItem('customScreenBrightness', 'true');
  await AsyncStorage.setItem('screenBrightness', '0.4');
  await renderApp();
  const addListener = AppState.addEventListener as unknown as jest.Mock;
  const handler = addListener.mock.lastCall?.[1] as (state: string) => void;
  (NativeModules.ScreenBrightness.setBrightness as jest.Mock).mockClear();
  handler('active');
  expect(lastScreenBrightness()).toBe(0.4);
});

it('dims the screen during night hours', async () => {
  await AsyncStorage.setItem('nightMode', 'true');
  await AsyncStorage.setItem('nightStartHour', '10');
  await AsyncStorage.setItem('nightEndHour', '14');
  await renderApp();
  expect(lastScreenBrightness()).toBe(0.1);
});

it('keeps a lower saved brightness during night hours', async () => {
  await AsyncStorage.setItem('customScreenBrightness', 'true');
  await AsyncStorage.setItem('screenBrightness', '0.05');
  await AsyncStorage.setItem('nightMode', 'true');
  await AsyncStorage.setItem('nightStartHour', '10');
  await AsyncStorage.setItem('nightEndHour', '14');
  await renderApp();
  expect(lastScreenBrightness()).toBe(0.05);
});

it('closes settings', async () => {
  const tree = await renderApp();
  await openSettings(tree);
  await act(async () => {
    tree.root.findByType(Modal).props.onRequestClose();
  });
  expect(tree.root.findAllByType(Settings)).toHaveLength(0);
});
