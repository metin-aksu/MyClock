import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

import {getDate, getWeekday, getBatteryPercentage} from './utils';

const batteryIconEmpty = require('./assets/icons/battery-icon-empty.png');
const batteryIcon25 = require('./assets/icons/battery-icon-25.png');
const batteryIcon50 = require('./assets/icons/battery-icon-50.png');
const batteryIcon75 = require('./assets/icons/battery-icon-75.png');
const batteryIconFull = require('./assets/icons/battery-icon-full.png');

const getBatteryIcon = (level: number) => {
  if (level < 10) {
    return batteryIconEmpty;
  } else if (level < 25) {
    return batteryIcon25;
  } else if (level < 50) {
    return batteryIcon50;
  } else if (level < 75) {
    return batteryIcon75;
  }
  return batteryIconFull;
};

interface InfoProps {
  now: Date;
  color: string;
  showDate: boolean;
  showWeekday: boolean;
  showBattery: boolean;
  brightness?: number;
}

const Info: React.FC<InfoProps> = ({
  now,
  color,
  showDate,
  showWeekday,
  showBattery,
  brightness = 1.0,
}) => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  // Pil seviyesini dakikada bir güncelle
  useEffect(() => {
    let isCurrent = true;
    getBatteryPercentage()
      .then(level => {
        if (isCurrent) {
          // Pil bilgisi olmayan cihazlar (ör. simülatör) negatif değer döndürür
          setBatteryLevel(level < 0 ? null : level);
        }
      })
      .catch(error => console.error('Error reading battery level:', error));
    return () => {
      isCurrent = false;
    };
  }, [now]);

  return (
    <View style={[styles.container, {opacity: brightness}]}>
      {showDate && <Text style={[styles.dateText, {color}]}>{getDate(now)}</Text>}
      {showWeekday && (
        <Text style={[styles.weekdayText, {color}]}>{getWeekday(now)}</Text>
      )}

      {showBattery && batteryLevel !== null && (
        <View style={styles.batteryContainer}>
          <Image
            style={[styles.batteryIcon, {tintColor: color}]}
            source={getBatteryIcon(batteryLevel)}
          />
          <Text style={[styles.batteryText, {color}]}>{batteryLevel}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 24,
    marginTop: 20,
  },
  weekdayText: {
    fontSize: 24,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  batteryIcon: {
    width: 45,
    height: 24,
    marginRight: 8,
  },
  batteryText: {
    fontSize: 18,
  },
});

export default Info;
