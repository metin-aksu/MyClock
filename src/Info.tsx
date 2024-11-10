import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';
import {getDate, getWeekday, getBatteryPercentage} from './utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const batteryIconEmpty = require('./assets/icons/battery-icon-empty.png');
const batteryIcon25 = require('./assets/icons/battery-icon-25.png');
const batteryIcon50 = require('./assets/icons/battery-icon-50.png');
const batteryIcon75 = require('./assets/icons/battery-icon-75.png');
const batteryIconFull = require('./assets/icons/battery-icon-full.png');

interface InfoProps {
  isModalVisible?: boolean;
  brightness?: number;
}

const Info: React.FC<InfoProps> = ({isModalVisible = false, brightness = 1.0}) => {
  const [date, setDate] = useState(getDate(new Date()));
  const [weekday, setWeekday] = useState(getWeekday(new Date()));
  const [batteryLevel, setBatteryLevel] = useState(75); // Pil seviyesi durumu
  const [batteryIcon, setBatteryIcon] = useState(batteryIcon75);

  const [showDate, setShowDate] = useState(true);
  const [showWeekday, setShowWeekday] = useState(true);
  const [showBattery, setShowBattery] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const dateValue = await AsyncStorage.getItem('showDate');
        const weekdayValue = await AsyncStorage.getItem('showWeekday');
        const batteryValue = await AsyncStorage.getItem('showBattery');

        setShowDate(dateValue === null ? true : dateValue === 'true');
        setShowWeekday(weekdayValue === null ? true : weekdayValue === 'true');
        setShowBattery(batteryValue === null ? true : batteryValue === 'true');
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, [isModalVisible]);

  const updateBatteryIcon = (level: number) => {
    if (level < 10) {
      setBatteryIcon(batteryIconEmpty);
    } else if (level < 25) {
      setBatteryIcon(batteryIcon25);
    } else if (level < 50) {
      setBatteryIcon(batteryIcon50);
    } else if (level < 75) {
      setBatteryIcon(batteryIcon75);
    } else {
      setBatteryIcon(batteryIconFull);
    }
  };

  useEffect(() => {
    // Başlangıçta pil seviyesini alma
    (async () => {
      const newBatteryLevel = await getBatteryPercentage();
      setBatteryLevel(newBatteryLevel);
      updateBatteryIcon(newBatteryLevel);
    })();

    // Tarih, günü ve pil seviyesini her dakika güncelle
    const intervalId = BackgroundTimer.setInterval(async () => {
      let currentDateTime = new Date();
      setDate(getDate(currentDateTime));
      setWeekday(getWeekday(currentDateTime));

      const newBatteryLevel = await getBatteryPercentage();
      setBatteryLevel(newBatteryLevel);
      updateBatteryIcon(newBatteryLevel);
    }, 60000);

    return () => {
      BackgroundTimer.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <View style={[styles.container, {opacity: brightness}]}>
        {showDate && <Text style={styles.dateText}>{date}</Text>}
        {showWeekday && <Text style={styles.weekdayText}>{weekday}</Text>}

        {showBattery && (
          <View style={styles.batteryContainer}>
            <Image style={styles.batteryIcon} source={batteryIcon} />
            <Text style={styles.batteryText}>{batteryLevel}%</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 24,
    color: '#fff',
    marginTop: 20,
  },
  weekdayText: {
    fontSize: 24,
    color: '#fff',
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
    color: '#fff',
  },
});

export default Info;
