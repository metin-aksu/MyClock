import React from 'react';
import {StyleSheet, View} from 'react-native';
import tinycolor from 'tinycolor2';

import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import Info from './Info';
import {computeClockLayout, estimateInfoHeight, fitClockFontSize} from './layout';
import {AppSettings, AUTO_TEXT_COLOR} from './SettingsContext';
import {
  getContrastColor,
  getSecondHandColor,
  getTime,
  isNightTime,
} from './utils';

const NIGHT_BACKGROUND_COLOR = '#000000';
const NIGHT_TEXT_COLOR = '#FFFFFF';
// Ekran parlaklığı da düştüğü için saat bundan daha soluk olursa okunmaz
const NIGHT_MAX_OPACITY = 0.5;
const NIGHT_MAX_SCREEN_BRIGHTNESS = 0.1;

// Ayarlara ve saate göre ekranda kullanılacak renkleri ve parlaklığı belirler
export const resolveAppearance = (settings: AppSettings, now: Date) => {
  const screenBrightness = settings.customScreenBrightness
    ? settings.screenBrightness
    : null;
  if (
    settings.nightMode &&
    isNightTime(now, settings.nightStartHour, settings.nightEndHour)
  ) {
    return {
      backgroundColor: NIGHT_BACKGROUND_COLOR,
      textColor: NIGHT_TEXT_COLOR,
      opacity: Math.min(settings.brightness, NIGHT_MAX_OPACITY),
      screenBrightness: Math.min(
        screenBrightness ?? NIGHT_MAX_SCREEN_BRIGHTNESS,
        NIGHT_MAX_SCREEN_BRIGHTNESS,
      ),
    };
  }
  const isAutoText =
    settings.textColor === AUTO_TEXT_COLOR ||
    !tinycolor(settings.textColor).isValid();
  return {
    backgroundColor: settings.backgroundColor,
    textColor: isAutoText
      ? getContrastColor(settings.backgroundColor)
      : settings.textColor,
    opacity: settings.brightness,
    screenBrightness,
  };
};

interface ClockFaceProps {
  settings: AppSettings;
  now: Date;
  width: number;
  height: number;
  // Ayarlar ekranındaki önizleme için ölçek; bilgi satırları yalnız tam ekranda çizilir
  scale?: number;
  isActive?: boolean;
}

const ClockFace: React.FC<ClockFaceProps> = ({
  settings,
  now,
  width,
  height,
  scale = 1,
  isActive = true,
}) => {
  const {backgroundColor, textColor, opacity} = resolveAppearance(settings, now);
  const time = getTime(now, settings.use24Hour);
  const isLandscape = width > height;

  const layout = computeClockLayout({
    width,
    height,
    showDigital: settings.showDigitalClock,
    showAnalog: settings.showAnalogClock,
    infoHeight: estimateInfoHeight(settings),
  });

  const fontSize = fitClockFontSize(
    isLandscape
      ? settings.landscapeClockFontSize
      : settings.portraitClockFontSize,
    time,
    layout.digitalMaxWidth,
    layout.digitalMaxHeight,
  );

  const digitalClock = settings.showDigitalClock && (
    <DigitalClock
      time={time}
      fontSize={fontSize * scale}
      fontFamily={settings.clockFont}
      color={textColor}
      brightness={opacity}
    />
  );
  const info = scale === 1 && (
    <Info
      now={now}
      color={textColor}
      showDate={settings.showDate}
      showWeekday={settings.showWeekday}
      showBattery={settings.showBattery}
      brightness={opacity}
    />
  );

  return (
    <View style={layout.isRow ? styles.row : styles.column}>
      {settings.showAnalogClock && (
        <AnalogClock
          size={layout.analogSize * scale}
          color={textColor}
          secondHandColor={getSecondHandColor(backgroundColor, textColor)}
          showNumbers={scale === 1}
          brightness={opacity}
          isActive={isActive}
        />
      )}
      {layout.isRow ? (
        <View style={styles.column}>
          {digitalClock}
          {info}
        </View>
      ) : (
        <>
          {digitalClock}
          {info}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ClockFace;
