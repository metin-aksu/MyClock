import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  Modal,
  Pressable,
  // NativeModules,
  // BackHandler,
} from 'react-native';
import Settings from './Settings';
import AnalogClock from './AnalogClock';

import KeepAwake from 'react-native-keep-awake';
import BackgroundTimer from 'react-native-background-timer';
import {Immersive} from 'react-native-immersive';
import {getTime, getDate, getWeekday, getBatteryPercentage} from './utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const batteryIconEmpty = require('./assets/icons/battery-icon-empty.png');
const batteryIcon25 = require('./assets/icons/battery-icon-25.png');
const batteryIcon50 = require('./assets/icons/battery-icon-50.png');
const batteryIcon75 = require('./assets/icons/battery-icon-75.png');
const batteryIconFull = require('./assets/icons/battery-icon-full.png');
const settingsIcon = require('./assets/icons/settings-icon.png');

function App(): React.JSX.Element {
  const [time, setTime] = useState(getTime(new Date()));
  const [date, setDate] = useState(getDate(new Date()));
  const [weekday, setWeekday] = useState(getWeekday(new Date()));
  const [batteryLevel, setBatteryLevel] = useState(75); // Pil seviyesi durumu
  const [batteryIcon, setBatteryIcon] = useState(batteryIcon75);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [showDate, setShowDate] = useState(
    AsyncStorage.getItem('showDate') === 'true',
  );
  const [showWeekday, setShowWeekday] = useState(
    AsyncStorage.getItem('showWeekday') === 'true',
  );
  const [showBattery, setShowBattery] = useState(
    AsyncStorage.getItem('showBattery') === 'true',
  );
  const [showSettingsIcon, setShowSettingsIcon] = useState(
    AsyncStorage.getItem('showSettingsIcon') === 'true',
  );
  const [portraitClockFontSize, setPortraitClockFontSize] = useState(80);
  const [landscapeClockFontSize, setLandscapeClockFontSize] = useState(120);
  const [font, setFont] = useState('System');

  const {width, height} = useWindowDimensions();
  const orientation = width > height ? 'Landscape' : 'Portrait';

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const dateValue = await AsyncStorage.getItem('showDate');
        const weekdayValue = await AsyncStorage.getItem('showWeekday');
        const batteryValue = await AsyncStorage.getItem('showBattery');
        const settingsValue = await AsyncStorage.getItem('showSettingsIcon');

        const portraitFontSize = await AsyncStorage.getItem(
          'portraitClockFontSize',
        );
        const landscapeFontSize = await AsyncStorage.getItem(
          'landscapeClockFontSize',
        );
        const savedFont = await AsyncStorage.getItem('clockFont');

        setShowDate(dateValue === 'true');
        setShowWeekday(weekdayValue === 'true');
        setShowBattery(batteryValue === 'true');
        setShowSettingsIcon(settingsValue === 'true');
        setPortraitClockFontSize(
          portraitFontSize ? Number(portraitFontSize) : 80,
        );
        setLandscapeClockFontSize(
          landscapeFontSize ? Number(landscapeFontSize) : 120,
        );
        if (savedFont) {
          setFont(savedFont);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, [isModalVisible]);

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
        <View style={styles.settingsContainer}>
          <Pressable onPress={() => setIsModalVisible(true)}>
            {showSettingsIcon ? (
              <Image style={styles.settingsIcon} source={settingsIcon} />
            ) : (
              <Text style={styles.settingsText}>Settings</Text>
            )}
          </Pressable>
        </View>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsModalVisible(false)}>
          <Settings onClose={() => setIsModalVisible(false)} />
        </Modal>
        <Text
          style={
            orientation === 'Landscape'
              ? styles.clockTextLandscape
              : styles.clockTextPortrait
          }>
          {/* <Text
            style={{
              fontSize:
                orientation === 'Landscape'
                  ? landscapeClockFontSize
                  : portraitClockFontSize,
            }}> */}
          <Text
            style={[
              {
                fontSize:
                  orientation === 'Landscape'
                    ? landscapeClockFontSize
                    : portraitClockFontSize,
              },
              {fontFamily: font},
            ]}>
            {time}
          </Text>
        </Text>
        <AnalogClock
          size={300}
          hourHandColor="#FFFFFF"
          minuteHandColor="#CCCCCC"
          secondHandColor="#FF0000"
          dialColor="#FFFFFF"
          showNumbers={true}
        />
        {showDate && <Text style={styles.dateText}>{date}</Text>}
        {showWeekday && <Text style={styles.weekdayText}>{weekday}</Text>}

        {showBattery && (
          <View style={styles.batteryContainer}>
            <Image style={styles.batteryIcon} source={batteryIcon} />
            <Text style={styles.batteryText}>{batteryLevel}%</Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  containerPortrait: {
    flex: 1,
    // paddingTop: 120,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  containerLandscape: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  settingsContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  settingsText: {
    fontSize: 18,
    color: '#fff',
  },
  clockTextPortrait: {
    color: '#fff',
    marginTop: 120,
    marginBottom: 30,
  },
  clockTextLandscape: {
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

export default App;
