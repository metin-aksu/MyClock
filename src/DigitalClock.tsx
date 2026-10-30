import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, useWindowDimensions} from 'react-native';

import {getTime} from './utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DigitalClockProps {
  isModalVisible?: boolean;
  brightness?: number;
}

const DigitalClock: React.FC<DigitalClockProps> = ({
  isModalVisible = false,
  brightness = 1.0,
}) => {
  const [time, setTime] = useState(getTime(new Date()));
  const [showDigitalClock, setShowDigitalClock] = useState(true);
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

        const digitalClockValue = await AsyncStorage.getItem(
          'showDigitalClock',
        );

        setPortraitClockFontSize(
          portraitFontSize ? Number(portraitFontSize) : 80,
        );
        setLandscapeClockFontSize(
          landscapeFontSize ? Number(landscapeFontSize) : 120,
        );
        if (savedFont) {
          setFont(savedFont);
        }

        setShowDigitalClock(
          digitalClockValue === null ? true : digitalClockValue === 'true',
        );
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, [isModalVisible]);

  useEffect(() => {
    if (showDigitalClock === true) {
      const timer = setInterval(() => {
        let currentDateTime = new Date();
        setTime(getTime(currentDateTime));
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [showDigitalClock]);

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
            {opacity: brightness},
          ]}>
          {time}
        </Text>
      </View>
    </>
  );
};

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
