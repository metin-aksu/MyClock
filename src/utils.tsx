import DeviceInfo from 'react-native-device-info';
import tinycolor from 'tinycolor2';

export const getBatteryPercentage = async () => {
    const batteryLevel = await DeviceInfo.getBatteryLevel();
    return Math.round(batteryLevel * 100);
};

export const getTime = (propTime: Date, use24Hour = true) => {
  if (!(propTime instanceof Date)) {
    throw new Error('Invalid date provided to getTime');
  }
  return propTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour,
  });
};

export const getDate = (propDate: Date) => {
  if (!(propDate instanceof Date)) {
    throw new Error('Invalid date provided to getDate');
  }
  return propDate.toLocaleDateString([], {
    year: 'numeric',
    month: 'long', // 'numeric' yerine 'long' ay adını verir (örneðin: Ocak)
    day: '2-digit',
  });
};

export const getWeekday = (propWeekday: Date) => {
  if (!(propWeekday instanceof Date)) {
    throw new Error('Invalid date provided to getWeekday');
  }
  return propWeekday.toLocaleDateString([], {
    weekday: 'long',
  });
};

export const getContrastColor = (backgroundColor: string) =>
  tinycolor(backgroundColor).isLight() ? '#000000' : '#FFFFFF';

// Saniye ibresi arka planda kaybolmasın
export const getSecondHandColor = (
  backgroundColor: string,
  fallbackColor: string,
) =>
  tinycolor.readability(backgroundColor, '#FF0000') < 2
    ? fallbackColor
    : '#FF0000';

// Başlangıç ve bitiş gece yarısını aşabilir (ör. 22 - 07)
export const isNightTime = (now: Date, startHour: number, endHour: number) => {
  const hour = now.getHours();
  if (startHour === endHour) {
    return false;
  }
  return startHour < endHour
    ? hour >= startHour && hour < endHour
    : hour >= startHour || hour < endHour;
};

const BURN_IN_OFFSET = 6;
const BURN_IN_POSITIONS = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

export const BURN_IN_MARGIN = BURN_IN_OFFSET;

// OLED ekran yanmasını azaltmak için içeriği dakikada bir kaydırır
export const getBurnInOffset = (now: Date) => {
  const totalMinutes = Math.floor(now.getTime() / 60000);
  const [x, y] = BURN_IN_POSITIONS[totalMinutes % BURN_IN_POSITIONS.length];
  return {x: x * BURN_IN_OFFSET, y: y * BURN_IN_OFFSET};
};
