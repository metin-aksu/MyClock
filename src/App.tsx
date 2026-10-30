import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import KeepAwake from 'react-native-keep-awake';
// Immersive mode is now handled natively in MainActivity.kt
import Orientation from 'react-native-orientation-locker';

import ClockFace, {resolveAppearance} from './ClockFace';
import Settings from './Settings';
import {
  OrientationTypes,
  SettingsProvider,
  useSettings,
} from './SettingsContext';
import {useScreenBrightness} from './screenBrightness';
import {useAlignedNow} from './useAlignedNow';
import {BURN_IN_MARGIN, getBurnInOffset} from './utils';

const settingsIcon = require('./assets/icons/settings-icon.png');
const closeIcon = require('./assets/icons/close-icon.png');

const TOP_BAR_HEIGHT = 48;

const applyOrientation = (setting: string) => {
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

function ClockScreen(): React.JSX.Element {
  const {settings, isLoaded} = useSettings();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {width, height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const now = useAlignedNow(60000);

  useEffect(() => {
    if (isLoaded) {
      applyOrientation(settings.orientation);
    }
  }, [isLoaded, settings.orientation]);

  useEffect(() => {
    KeepAwake.activate(); // Uygulamanın ekranını açık tut

    return () => {
      KeepAwake.deactivate();
    };
  }, []);

  const {backgroundColor, textColor, opacity, screenBrightness} =
    resolveAppearance(settings, now);
  useScreenBrightness(screenBrightness);

  const offset = settings.burnInProtection
    ? getBurnInOffset(now)
    : {x: 0, y: 0};
  const iconStyle = [styles.icon, {tintColor: textColor, opacity}];

  // Üst çubuk altta da aynı kadar boşluk ayırır, saat ortada kalır
  const faceWidth =
    width - insets.left - insets.right - 2 * BURN_IN_MARGIN;
  const faceHeight =
    height -
    2 * Math.max(insets.top, insets.bottom) -
    2 * (TOP_BAR_HEIGHT + BURN_IN_MARGIN);

  if (!isLoaded) {
    return <View style={styles.loading} />;
  }

  return (
    <>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        supportedOrientations={[
          'portrait',
          'landscape-left',
          'landscape-right',
        ]}
        onRequestClose={() => setIsModalVisible(false)}>
        <Settings onClose={() => setIsModalVisible(false)} />
      </Modal>

      <View style={[styles.container, {backgroundColor}]}>
        <View
          style={[
            styles.content,
            {transform: [{translateX: offset.x}, {translateY: offset.y}]},
          ]}>
          <View
            style={[
              styles.topBar,
              {
                top: insets.top + BURN_IN_MARGIN,
                left: insets.left,
                right: insets.right,
              },
            ]}>
            {/* Çıkış ikonu (solda) sadece Android'de */}
            {Platform.OS === 'android' && (
              <Pressable
                onPress={() => {
                  BackHandler.exitApp();
                }}
                style={styles.iconButton}>
                <Image style={iconStyle} source={closeIcon} />
              </Pressable>
            )}
            {/* Boşluk */}
            <View style={styles.spacer} />
            {/* Ayarlar ikonu (sağda) */}
            <Pressable
              onPress={() => setIsModalVisible(true)}
              style={styles.iconButton}>
              {settings.showSettingsIcon ? (
                <Image style={iconStyle} source={settingsIcon} />
              ) : (
                <View style={styles.icon} />
              )}
            </Pressable>
          </View>

          <ClockFace
            settings={settings}
            now={now}
            width={faceWidth}
            height={faceHeight}
            isActive={!isModalVisible}
          />
        </View>
      </View>
    </>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ClockScreen />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    height: TOP_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  spacer: {
    flex: 1,
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default App;
