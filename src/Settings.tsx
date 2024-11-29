import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';

import About from './About';

import {useOrientationSetting} from './hooks/useOrientationSetting';
import {OrientationTypes} from './constants/storage';

const closeIcon = require('./assets/icons/close-icon.png');
const checkedIcon = require('./assets/icons/checked-icon.png');
const uncheckedIcon = require('./assets/icons/unchecked-icon.png');

const AVAILABLE_FONTS = [
  {
    name: 'Default',
    value: 'System',
  },
  {
    name: 'Digital-7',
    value: 'Digital-7',
  },
];

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({onClose}) => {
  const [showDigitalClock, setShowDigitalClock] = useState(true);
  // const [showAnalogClock, setShowAnalogClock] = useState(false);

  const [showDate, setShowDate] = useState(true);
  const [showWeekday, setShowWeekday] = useState(true);
  const [showBattery, setShowBattery] = useState(true);
  const [showSettingsIcon, setShowSettingsIcon] = useState(true);

  const [portraitClockFontSize, setPortraitClockFontSize] = useState(80);
  const [landscapeClockFontSize, setLandscapeClockFontSize] = useState(120);
  const [brightness, setBrightness] = useState(1.0);
  const [selectedFont, setSelectedFont] = useState('System');
  const {orientationSetting, setOrientation} = useOrientationSetting();

  const loadSettings = async () => {
    try {
      const digitalClockValue = await AsyncStorage.getItem('showDigitalClock');
      // const analogClockValue = await AsyncStorage.getItem('showAnalogClock');
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
      const savedBrightness = await AsyncStorage.getItem('brightness');
      const savedFont = await AsyncStorage.getItem('clockFont');

      setShowDigitalClock(
        digitalClockValue === null ? true : digitalClockValue === 'true',
      );
      // setShowAnalogClock(
      //   analogClockValue === null ? false : analogClockValue === 'true',
      // );
      setShowDate(dateValue === null ? true : dateValue === 'true');
      setShowWeekday(weekdayValue === null ? true : weekdayValue === 'true');
      setShowBattery(batteryValue === null ? true : batteryValue === 'true');
      setShowSettingsIcon(
        settingsValue === null ? true : settingsValue === 'true',
      );
      setPortraitClockFontSize(
        portraitFontSize === null ? 80 : Number(portraitFontSize),
      );
      setLandscapeClockFontSize(
        landscapeFontSize === null ? 120 : Number(landscapeFontSize),
      );
      if (savedBrightness !== null) {
        setBrightness(parseFloat(savedBrightness));
      }
      setSelectedFont(savedFont === null ? 'System' : savedFont);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleShowDigitalClockChange = async (value: boolean) => {
    setShowDigitalClock(value);
    await AsyncStorage.setItem('showDigitalClock', String(value));
  };

  // const handleShowAnalogClockChange = async (value: boolean) => {
  //   setShowAnalogClock(value);
  //   await AsyncStorage.setItem('showAnalogClock', String(value));
  // };

  const handleShowDateChange = async (value: boolean) => {
    setShowDate(value);
    await AsyncStorage.setItem('showDate', String(value));
  };

  const handleShowWeekdayChange = async (value: boolean) => {
    setShowWeekday(value);
    await AsyncStorage.setItem('showWeekday', String(value));
  };

  const handleShowBatteryChange = async (value: boolean) => {
    setShowBattery(value);
    await AsyncStorage.setItem('showBattery', String(value));
  };

  const handleShowSettingsIconChange = async (value: boolean) => {
    !value &&
      Alert.alert(
        'Info',
        'You can access the settings by clicking on the area where the settings icon is located.',
      );
    setShowSettingsIcon(value);
    await AsyncStorage.setItem('showSettingsIcon', String(value));
  };

  const handlePortraitClockFontSizeChange = async (value: number) => {
    setPortraitClockFontSize(Number(value));
    await AsyncStorage.setItem('portraitClockFontSize', String(value));
  };

  const handleLandscapeClockFontSizeChange = async (value: number) => {
    setLandscapeClockFontSize(Number(value));
    await AsyncStorage.setItem('landscapeClockFontSize', String(value));
  };

  const handleBrightnessChange = async (value: number) => {
    setBrightness(value);
    await AsyncStorage.setItem('brightness', String(value));
  };

  const handleFontChange = async (fontValue: string) => {
    try {
      await AsyncStorage.setItem('clockFont', fontValue);
      setSelectedFont(fontValue);
    } catch (error) {
      console.error('Error saving font:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Settings</Text>
        <Pressable onPress={onClose}>
          <Image style={styles.closeIcon} source={closeIcon} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false} // Kaydırma çubuğunu gizler (opsiyonel)
      >
        <View style={styles.settingsContainer}>
          <Pressable
            style={styles.checkboxContainer}
            onPress={() => handleShowDigitalClockChange(!showDigitalClock)}>
            <Image
              style={styles.checkbox}
              source={showDigitalClock ? checkedIcon : uncheckedIcon}
            />
            <Text style={styles.label}>Show digital clock</Text>
          </Pressable>

          {/* <Pressable
            style={styles.checkboxContainer}
            onPress={() => handleShowAnalogClockChange(!showAnalogClock)}>
            <Image
              style={styles.checkbox}
              source={showAnalogClock ? checkedIcon : uncheckedIcon}
            />
            <Text style={styles.label}>Show analog clock</Text>
          </Pressable> */}

          <Pressable
            style={styles.checkboxContainer}
            onPress={() => handleShowDateChange(!showDate)}>
            <Image
              style={styles.checkbox}
              source={showDate ? checkedIcon : uncheckedIcon}
            />
            <Text style={styles.label}>Show date</Text>
          </Pressable>

          <Pressable
            style={styles.checkboxContainer}
            onPress={() => handleShowWeekdayChange(!showWeekday)}>
            <Image
              style={styles.checkbox}
              source={showWeekday ? checkedIcon : uncheckedIcon}
            />
            <Text style={styles.label}>Show weekday</Text>
          </Pressable>

          <Pressable
            style={styles.checkboxContainer}
            onPress={() => handleShowBatteryChange(!showBattery)}>
            <Image
              style={styles.checkbox}
              source={showBattery ? checkedIcon : uncheckedIcon}
            />
            <Text style={styles.label}>Show battery icon</Text>
          </Pressable>

          <Pressable
            style={styles.checkboxContainer}
            onPress={() => handleShowSettingsIconChange(!showSettingsIcon)}>
            <Image
              style={styles.checkbox}
              source={showSettingsIcon ? checkedIcon : uncheckedIcon}
            />
            <Text style={styles.label}>Show settings icon</Text>
          </Pressable>

          <View style={styles.sliderContainer}>
            <Text style={styles.label}>
              Digital clock portrait size: {portraitClockFontSize}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={300}
              value={portraitClockFontSize}
              onValueChange={handlePortraitClockFontSizeChange}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#000000"
              thumbTintColor="#FFFFFF"
              step={1}
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.label}>
              Digital clock landscape size: {landscapeClockFontSize}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={300}
              value={landscapeClockFontSize}
              onValueChange={handleLandscapeClockFontSizeChange}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#000000"
              thumbTintColor="#FFFFFF"
              step={1}
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.label}>
              Brightness: {Math.round(brightness * 100)}%
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={1.0}
              value={brightness}
              onValueChange={handleBrightnessChange}
              // minimumTrackTintColor="#FFFFFF"
              // maximumTrackTintColor="#000000"
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#000000"
              thumbTintColor="#FFFFFF"
            />
          </View>

          <View style={styles.fontSection}>
            <Text style={styles.sectionTitle}>Clock Font</Text>
            <View style={styles.fontGrid}>
              {AVAILABLE_FONTS.map(font => (
                <TouchableOpacity
                  key={font.value}
                  style={[
                    styles.fontOption,
                    selectedFont === font.value && styles.selectedFont,
                  ]}
                  onPress={() => handleFontChange(font.value)}>
                  <Text
                    style={[
                      styles.fontSampleText,
                      {fontFamily: font.value},
                      selectedFont === font.value && styles.selectedFontText,
                    ]}>
                    12:00
                  </Text>
                  <Text
                    style={[
                      styles.fontName,
                      selectedFont === font.value && styles.selectedFontText,
                    ]}>
                    {font.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* // Ekran yönü ayarları */}
          <View>
            <Text style={styles.sectionTitle}>Screen Orientation</Text>
            <View style={styles.orientationContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  orientationSetting === OrientationTypes.FREE &&
                    styles.selectedOption,
                ]}
                onPress={() => setOrientation(OrientationTypes.FREE)}>
                <Text style={styles.optionText}>Free</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  orientationSetting === OrientationTypes.PORTRAIT &&
                    styles.selectedOption,
                ]}
                onPress={() => setOrientation(OrientationTypes.PORTRAIT)}>
                <Text style={styles.optionText}>Portrait</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  orientationSetting === OrientationTypes.LANDSCAPE &&
                    styles.selectedOption,
                ]}
                onPress={() => setOrientation(OrientationTypes.LANDSCAPE)}>
                <Text style={styles.optionText}>Landscape</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* // Ekran yönü ayarları */}

          <About />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  scrollView: {
    flex: 1,
  },
  settingsContainer: {
    padding: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  closeIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  checkbox: {
    width: 15,
    height: 15,
    marginRight: 8,
  },
  label: {
    margin: 8,
    fontSize: 18,
    color: 'white',
  },
  sliderContainer: {
    alignItems: 'stretch',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  fontSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 12,
  },
  fontGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -5,
  },
  fontOption: {
    width: '48%',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFont: {
    borderColor: '#007AFF',
    backgroundColor: '#1a3c5a',
  },
  fontSampleText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
  },
  fontName: {
    fontSize: 14,
    color: '#999',
  },
  selectedFontText: {
    color: 'white',
  },
  orientationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: '32%',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#1a3c5a',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Settings;
