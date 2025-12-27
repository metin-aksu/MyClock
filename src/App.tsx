import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import Settings from './Settings';

import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import Info from './Info';

import KeepAwake from 'react-native-keep-awake';
import {Immersive} from 'react-native-immersive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';

const settingsIcon = require('./assets/icons/settings-icon.png');

const OrientationTypes = {
  FREE: 'free',
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
};

function App(): React.JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSettingsIcon, setShowSettingsIcon] = useState(true);
  const [showDigitalClock, setShowDigitalClock] = useState(true);
  const [showAnalogClock, setShowAnalogClock] = useState(false);
  const [brightness, setBrightness] = useState(1.0);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsValue = await AsyncStorage.getItem('showSettingsIcon');
        const digitalClockValue = await AsyncStorage.getItem(
          'showDigitalClock',
        );
        const analogClockValue = await AsyncStorage.getItem('showAnalogClock');
        const savedBrightness = await AsyncStorage.getItem('brightness');

        setShowSettingsIcon(
          settingsValue === null ? true : settingsValue === 'true',
        );
        setShowDigitalClock(
          digitalClockValue === null ? true : digitalClockValue === 'true',
        );
        setShowAnalogClock(
          analogClockValue === null ? false : analogClockValue === 'true',
        );
        if (savedBrightness !== null) {
          setBrightness(parseFloat(savedBrightness));
        }
        const savedOrientation = await AsyncStorage.getItem('orientation');
        if (savedOrientation !== null) {
          applyOrientation(savedOrientation);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, [isModalVisible]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Immersive.on();
    }
  }, []);

  useEffect(() => {
    KeepAwake.activate(); // Uygulamanın ekranını açık tut

    return () => {
      KeepAwake.deactivate();
    };
  }, []);

  const applyOrientation = (
    setting: (typeof OrientationTypes)[keyof typeof OrientationTypes],
  ) => {
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

  return (
    <>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}>
        <Settings onClose={() => setIsModalVisible(false)} />
      </Modal>

      <SafeAreaView style={styles.container}>
        <View style={styles.settingsContainer}>
          <Pressable onPress={() => setIsModalVisible(true)}>
            {showSettingsIcon ? (
              <Image style={styles.settingsIcon} source={settingsIcon} />
            ) : (
              <Text style={[styles.settingsText, styles.settingsIcon]}>
                &nbsp;
              </Text>
            )}
          </Pressable>
        </View>

        {showDigitalClock && (
          <DigitalClock
            isModalVisible={isModalVisible}
            brightness={brightness}
          />
        )}
        {showAnalogClock && (
          <AnalogClock
            isModalVisible={isModalVisible}
            isVisible={showAnalogClock}
            brightness={brightness}
          />
        )}
        <Info isModalVisible={isModalVisible} brightness={brightness} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default App;
