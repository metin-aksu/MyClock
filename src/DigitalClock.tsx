import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, useWindowDimensions} from 'react-native';

import {getTime} from './utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DigitalClock(): React.JSX.Element {
  const [time, setTime] = useState(getTime(new Date()));

  const [portraitClockFontSize, setPortraitClockFontSize] = useState(80);
  const [landscapeClockFontSize, setLandscapeClockFontSize] = useState(120);
  const [font, setFont] = useState('System');

  const {width, height} = useWindowDimensions();
  const orientation = width > height ? 'Landscape' : 'Portrait';

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const portraitFontSize = await AsyncStorage.getItem(
          'portraitClockFontSize',
        );
        const landscapeFontSize = await AsyncStorage.getItem(
          'landscapeClockFontSize',
        );
        const savedFont = await AsyncStorage.getItem('clockFont');

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
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      let currentDateTime = new Date();
      setTime(getTime(currentDateTime));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Text
          style={[
            styles.clockText,
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockText: {
    color: '#fff',
  },
});

export default DigitalClock;
