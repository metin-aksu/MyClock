const TEXT_LINE_HEIGHT_RATIO = 1.25;
const TEXT_CHAR_WIDTH_RATIO = 0.62;
const TEXT_MIN_FONT_SIZE = 20;

const DATE_ROW_HEIGHT = 50;
const WEEKDAY_ROW_HEIGHT = 30;
const BATTERY_ROW_HEIGHT = 45;

interface InfoRows {
  showDate: boolean;
  showWeekday: boolean;
  showBattery: boolean;
}

export const estimateInfoHeight = ({
  showDate,
  showWeekday,
  showBattery,
}: InfoRows) =>
  (showDate ? DATE_ROW_HEIGHT : 0) +
  (showWeekday ? WEEKDAY_ROW_HEIGHT : 0) +
  (showBattery ? BATTERY_ROW_HEIGHT : 0);

// Seçilen boyutu, metin tek satırda alana sığacak şekilde sınırlar.
export const fitClockFontSize = (
  requested: number,
  text: string,
  maxWidth: number,
  maxHeight: number,
) => {
  const byWidth = maxWidth / (text.length * TEXT_CHAR_WIDTH_RATIO);
  const byHeight = maxHeight / TEXT_LINE_HEIGHT_RATIO;
  return Math.max(
    TEXT_MIN_FONT_SIZE,
    Math.floor(Math.min(requested, byWidth, byHeight)),
  );
};

interface ClockLayoutInput {
  width: number;
  height: number;
  showDigital: boolean;
  showAnalog: boolean;
  infoHeight: number;
}

export interface ClockLayout {
  isRow: boolean;
  analogSize: number;
  digitalMaxWidth: number;
  digitalMaxHeight: number;
}

// Saatleri ve bilgi satırlarını verilen alana taşmadan yerleştirir.
export const computeClockLayout = ({
  width,
  height,
  showDigital,
  showAnalog,
  infoHeight,
}: ClockLayoutInput): ClockLayout => {
  const clocksHeight = Math.max(0, height - infoHeight);

  if (!showAnalog) {
    return {
      isRow: false,
      analogSize: 0,
      digitalMaxWidth: width,
      digitalMaxHeight: clocksHeight,
    };
  }
  if (!showDigital) {
    return {
      isRow: false,
      analogSize: Math.min(width, clocksHeight),
      digitalMaxWidth: 0,
      digitalMaxHeight: 0,
    };
  }

  // Yatayda iki saat yan yana, dikeyde alt alta
  if (width > height) {
    const analogSize = Math.min(height, width / 2);
    return {
      isRow: true,
      analogSize,
      digitalMaxWidth: width - analogSize,
      digitalMaxHeight: clocksHeight,
    };
  }
  const analogSize = Math.min(width, clocksHeight * 0.6);
  return {
    isRow: false,
    analogSize,
    digitalMaxWidth: width,
    digitalMaxHeight: clocksHeight - analogSize,
  };
};
