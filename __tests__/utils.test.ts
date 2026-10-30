/**
 * @format
 */

import {describe, expect, it} from '@jest/globals';

import {
  computeClockLayout,
  estimateInfoHeight,
  fitClockFontSize,
} from '../src/layout';
import {
  getBurnInOffset,
  getContrastColor,
  getSecondHandColor,
  isNightTime,
} from '../src/utils';

describe('isNightTime', () => {
  const at = (hour: number) => new Date(2026, 0, 1, hour, 30);

  it('handles a window across midnight', () => {
    expect(isNightTime(at(23), 22, 7)).toBe(true);
    expect(isNightTime(at(3), 22, 7)).toBe(true);
    expect(isNightTime(at(7), 22, 7)).toBe(false);
    expect(isNightTime(at(12), 22, 7)).toBe(false);
  });

  it('handles a window within one day', () => {
    expect(isNightTime(at(14), 13, 15)).toBe(true);
    expect(isNightTime(at(15), 13, 15)).toBe(false);
  });

  it('is off when start equals end', () => {
    expect(isNightTime(at(5), 5, 5)).toBe(false);
  });
});

describe('colors', () => {
  it('picks readable text', () => {
    expect(getContrastColor('#000000')).toBe('#FFFFFF');
    expect(getContrastColor('#FFFF00')).toBe('#000000');
    expect(getContrastColor('#C0C0C0')).toBe('#000000');
  });

  it('replaces a second hand that would vanish', () => {
    expect(getSecondHandColor('#000000', '#FFFFFF')).toBe('#FF0000');
    expect(getSecondHandColor('#FF0000', '#000000')).toBe('#000000');
  });
});

describe('getBurnInOffset', () => {
  it('stays within the margin and moves over time', () => {
    const offsets = Array.from({length: 9}, (_, i) =>
      getBurnInOffset(new Date(i * 60000)),
    );
    offsets.forEach(({x, y}) => {
      expect(Math.abs(x)).toBeLessThanOrEqual(6);
      expect(Math.abs(y)).toBeLessThanOrEqual(6);
    });
    expect(new Set(offsets.map(o => `${o.x},${o.y}`)).size).toBe(9);
  });
});

describe('layout', () => {
  const infoHeight = estimateInfoHeight({
    showDate: true,
    showWeekday: true,
    showBattery: true,
  });

  it('shrinks an oversized clock to fit', () => {
    const size = fitClockFontSize(300, '12:34', 360, 500);
    expect(size * 5 * 0.62).toBeLessThanOrEqual(360);
    expect(fitClockFontSize(80, '12:34', 360, 500)).toBe(80);
  });

  it.each([
    [360, 700],
    [700, 300],
  ])('fits both clocks within %ix%i', (width, height) => {
    const layout = computeClockLayout({
      width,
      height,
      showDigital: true,
      showAnalog: true,
      infoHeight,
    });
    const digitalHeight = layout.digitalMaxHeight;
    const usedHeight = layout.isRow
      ? Math.max(layout.analogSize, digitalHeight + infoHeight)
      : layout.analogSize + digitalHeight + infoHeight;
    const usedWidth = layout.isRow
      ? layout.analogSize + layout.digitalMaxWidth
      : Math.max(layout.analogSize, layout.digitalMaxWidth);
    expect(usedHeight).toBeLessThanOrEqual(height);
    expect(usedWidth).toBeLessThanOrEqual(width);
  });
});
