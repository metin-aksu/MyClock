import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  // NativeModules,
  // BackHandler,
} from 'react-native';

import KeepAwake from 'react-native-keep-awake';
import BackgroundTimer from 'react-native-background-timer';
import {Immersive} from 'react-native-immersive';
import {getTime, getDate, getWeekday, getBatteryPercentage} from './utils';

const batteryIconEmpty = require('./assets/battery-icon-empty.png');
const batteryIcon25 = require('./assets/battery-icon-25.png');
const batteryIcon50 = require('./assets/battery-icon-50.png');
const batteryIcon75 = require('./assets/battery-icon-75.png');
const batteryIconFull = require('./assets/battery-icon-full.png');

function HomeScreen(): React.JSX.Element {
  const [time, setTime] = useState(getTime(new Date()));
  const [date, setDate] = useState(getDate(new Date()));
  const [weekday, setWeekday] = useState(getWeekday(new Date()));
  const [batteryLevel, setBatteryLevel] = useState(75); // Pil seviyesi durumu
  const [batteryIcon, setBatteryIcon] = useState(batteryIcon75);

  const {width, height} = useWindowDimensions();
  const orientation = width > height ? 'Landscape' : 'Portrait';

  useEffect(() => {
    Immersive.on();
  }, []);

  // const {MainActivity} = NativeModules;

  // useEffect(() => {
  //   const confirmExitWithLockScreen = () => {
  //     MainActivity.showLockScreen();
  //   };
  //   const backAction = () => {
  //     confirmExitWithLockScreen();
  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );
  //   return () => backHandler.remove();
  // }, [MainActivity]);

  useEffect(() => {
    // 5 saniyede bir saat ve tarihi güncelle
    const intervalId = BackgroundTimer.setInterval(() => {
      let currentDateTime = new Date();
      setTime(getTime(currentDateTime));
      setDate(getDate(currentDateTime));
      setWeekday(getWeekday(currentDateTime));
    }, 5000);

    KeepAwake.activate(); // Uygulamanın ekranını açık tut

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

    // Başlangıçta pil seviyesini alma
    (async () => {
      const newBatteryLevel = await getBatteryPercentage();
      setBatteryLevel(newBatteryLevel);
      updateBatteryIcon(newBatteryLevel);
    })();

    // Pil seviyesini her dakika güncelle
    const batteryIntervalId = BackgroundTimer.setInterval(async () => {
      const newBatteryLevel = await getBatteryPercentage();
      setBatteryLevel(newBatteryLevel);
      updateBatteryIcon(newBatteryLevel);
    }, 60000); // 60000 milisaniye = 1 dakika

    // İzinleri iste
    // Permissions.request(PERMISSIONS.ANDROID.SYSTEM_ALERT_WINDOW).then(
    //   response => {
    //     console.log('Permission response: ', response);
    //   },
    // );

    return () => {
      BackgroundTimer.clearInterval(intervalId);
      BackgroundTimer.clearInterval(batteryIntervalId);
      KeepAwake.deactivate();
    };
  }, []);

  return (
    <>
      <SafeAreaView
        style={
          orientation === 'Landscape'
            ? styles.containerLandscape
            : styles.containerPortrait
        }>
        <Text
          style={
            orientation === 'Landscape'
              ? styles.clockTextLandscape
              : styles.clockTextPortrait
          }>
          {time}
        </Text>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.weekdayText}>{weekday}</Text>

        {/* Pil seviyesi göstergesi */}
        <View style={styles.batteryContainer}>
          <Image style={styles.batteryIcon} source={batteryIcon} />
          <Text style={styles.batteryText}>{batteryLevel}%</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  containerPortrait: {
    flex: 1,
    paddingTop: 120,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  containerLandscape: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  clockTextPortrait: {
    fontSize: 80,
    color: '#fff',
    marginBottom: 50,
  },
  clockTextLandscape: {
    fontSize: 120,
    color: '#fff',
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

export default HomeScreen;
