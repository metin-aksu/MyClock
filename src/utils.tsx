import DeviceInfo from 'react-native-device-info';

export const getBatteryPercentage = async () => {
    const batteryLevel = await DeviceInfo.getBatteryLevel();
    return Math.round(batteryLevel * 100);
};

export const getTime = (propTime: Date) => {
  if (!propTime instanceof Date) {
    throw new Error('Invalid date provided to getTime');
  }
  return propTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const getDate = (propDate: Date) => {
  if (!propDate instanceof Date) {
    throw new Error('Invalid date provided to getDate');
  }
  return propDate.toLocaleDateString([], {
    year: 'numeric',
    month: 'long', // 'numeric' yerine 'long' ay adını verir (örneðin: Ocak)
    day: '2-digit',
  });
};

export const getWeekday = (propWeekday: Date) => {
  if (!propWeekday instanceof Date) {
    throw new Error('Invalid date provided to getWeekday');
  }
  return propWeekday.toLocaleDateString([], {
    weekday: 'long',
  });
};
