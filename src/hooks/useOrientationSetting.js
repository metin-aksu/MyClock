// src/hooks/useOrientationSetting.js
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';
import {ORIENTATION_SETTING_KEY, OrientationTypes} from '../constants/storage';

export const useOrientationSetting = () => {
  const [orientationSetting, setOrientationSetting] = useState(
    OrientationTypes.FREE,
  );

  // Ayarı kaydet ve uygula
  const setOrientation = async setting => {
    try {
      await AsyncStorage.setItem(ORIENTATION_SETTING_KEY, setting);
      setOrientationSetting(setting);
      applyOrientation(setting);
    } catch (error) {
      console.error('Orientation setting could not be saved:', error);
    }
  };

  // Yön kilidini uygula
  const applyOrientation = setting => {
    switch (setting) {
      case OrientationTypes.PORTRAIT:
        Orientation.lockToPortrait();
        break;
      case OrientationTypes.LANDSCAPE:
        Orientation.lockToLandscape();
        break;
      case OrientationTypes.FREE:
      default:
        Orientation.unlockAllOrientations();
        break;
    }
  };

  // Kayıtlı ayarı yükle
  useEffect(() => {
    const loadSavedOrientation = async () => {
      try {
        const savedSetting = await AsyncStorage.getItem(
          ORIENTATION_SETTING_KEY,
        );
        if (savedSetting) {
          setOrientationSetting(savedSetting);
          applyOrientation(savedSetting);
        }
      } catch (error) {
        console.error('Could not load orientation setting:', error);
      }
    };

    loadSavedOrientation();

    // Cleanup
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return {
    orientationSetting,
    setOrientation,
  };
};
