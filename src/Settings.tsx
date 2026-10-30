import React, {useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import About from './About';
import ClockFace, {resolveAppearance} from './ClockFace';
import CustomColorPicker from './CustomColorPicker';
import {strings} from './i18n';
import {
  AppSettings,
  AUTO_TEXT_COLOR,
  OrientationTypes,
  useSettings,
} from './SettingsContext';
import {useScreenBrightness} from './screenBrightness';
import {useAlignedNow} from './useAlignedNow';

const closeIcon = require('./assets/icons/close-icon.png');
const checkedIcon = require('./assets/icons/checked-icon.png');
const uncheckedIcon = require('./assets/icons/unchecked-icon.png');

const AVAILABLE_FONTS = [
  {
    name: strings.fontDefault,
    value: 'System',
  },
  {
    name: 'Digital-7',
    value: 'Digital-7',
  },
];

const ORIENTATION_OPTIONS = [
  {name: strings.orientationFree, value: OrientationTypes.FREE},
  {name: strings.orientationPortrait, value: OrientationTypes.PORTRAIT},
  {name: strings.orientationLandscape, value: OrientationTypes.LANDSCAPE},
];

const PREVIEW_SCALE = 0.25;
const HOURS_IN_DAY = 24;

const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

interface CheckboxRowProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const CheckboxRow: React.FC<CheckboxRowProps> = ({label, value, onChange}) => (
  <Pressable style={styles.checkboxContainer} onPress={() => onChange(!value)}>
    <Image style={styles.checkbox} source={value ? checkedIcon : uncheckedIcon} />
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

interface HourStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const HourStepper: React.FC<HourStepperProps> = ({label, value, onChange}) => (
  <View style={styles.stepperRow}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.stepperControls}>
      <TouchableOpacity
        style={styles.stepperButton}
        onPress={() => onChange((value + HOURS_IN_DAY - 1) % HOURS_IN_DAY)}>
        <Text style={styles.stepperButtonText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepperValue}>{formatHour(value)}</Text>
      <TouchableOpacity
        style={styles.stepperButton}
        onPress={() => onChange((value + 1) % HOURS_IN_DAY)}>
        <Text style={styles.stepperButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

interface SettingsProps {
  onClose: () => void;
}

type SliderKey =
  | 'portraitClockFontSize'
  | 'landscapeClockFontSize'
  | 'brightness'
  | 'screenBrightness';

const Settings: React.FC<SettingsProps> = ({onClose}) => {
  const {settings, updateSetting} = useSettings();
  const insets = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const now = useAlignedNow(60000);

  // Kaydırıcı sürüklenirken önizleme güncellenir, kayıt bırakınca yapılır
  const [sliderDraft, setSliderDraft] = useState<Partial<AppSettings>>({});
  const previewSettings: AppSettings = {...settings, ...sliderDraft};
  const previewAppearance = resolveAppearance(previewSettings, now);
  useScreenBrightness(previewAppearance.screenBrightness);

  const handleShowAnalogClockChange = (value: boolean) => {
    value && Alert.alert(strings.attention, strings.analogBatteryWarning);
    updateSetting('showAnalogClock', value);
  };

  const handleShowSettingsIconChange = (value: boolean) => {
    !value && Alert.alert(strings.info, strings.hiddenSettingsInfo);
    updateSetting('showSettingsIcon', value);
  };

  const renderSlider = (
    key: SliderKey,
    label: string,
    minimumValue: number,
    maximumValue: number,
    step?: number,
  ) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.label}>{label}</Text>
      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        value={settings[key]}
        onValueChange={value =>
          setSliderDraft(current => ({...current, [key]: value}))
        }
        onSlidingComplete={value => updateSetting(key, value)}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#000000"
        thumbTintColor="#FFFFFF"
        step={step}
      />
    </View>
  );

  const isAutoTextColor = settings.textColor === AUTO_TEXT_COLOR;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{strings.settings}</Text>
        <Pressable onPress={onClose}>
          <Image style={styles.closeIcon} source={closeIcon} />
        </Pressable>
      </View>

      <View
        style={[
          styles.preview,
          {
            width: width * PREVIEW_SCALE,
            height: height * PREVIEW_SCALE,
            backgroundColor: previewAppearance.backgroundColor,
          },
        ]}>
        <ClockFace
          settings={previewSettings}
          now={now}
          width={width}
          height={height}
          scale={PREVIEW_SCALE}
          isActive={false}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false} // Kaydırma çubuğunu gizler (opsiyonel)
      >
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>{strings.backgroundColor}</Text>
          <CustomColorPicker
            value={settings.backgroundColor}
            onChange={color => updateSetting('backgroundColor', color)}
          />

          <Text style={styles.sectionTitle}>{strings.textColor}</Text>
          <TouchableOpacity
            style={[styles.option, isAutoTextColor && styles.selectedOption]}
            onPress={() => updateSetting('textColor', AUTO_TEXT_COLOR)}>
            <Text style={styles.optionText}>{strings.automatic}</Text>
          </TouchableOpacity>
          <CustomColorPicker
            value={isAutoTextColor ? null : settings.textColor}
            onChange={color => updateSetting('textColor', color)}
          />

          <CheckboxRow
            label={strings.showDigitalClock}
            value={settings.showDigitalClock}
            onChange={value => updateSetting('showDigitalClock', value)}
          />
          <CheckboxRow
            label={strings.showAnalogClock}
            value={settings.showAnalogClock}
            onChange={handleShowAnalogClockChange}
          />
          <CheckboxRow
            label={strings.showDate}
            value={settings.showDate}
            onChange={value => updateSetting('showDate', value)}
          />
          <CheckboxRow
            label={strings.showWeekday}
            value={settings.showWeekday}
            onChange={value => updateSetting('showWeekday', value)}
          />
          <CheckboxRow
            label={strings.showBattery}
            value={settings.showBattery}
            onChange={value => updateSetting('showBattery', value)}
          />
          <CheckboxRow
            label={strings.showSettingsIcon}
            value={settings.showSettingsIcon}
            onChange={handleShowSettingsIconChange}
          />
          <CheckboxRow
            label={strings.use24Hour}
            value={settings.use24Hour}
            onChange={value => updateSetting('use24Hour', value)}
          />
          <CheckboxRow
            label={strings.burnInProtection}
            value={settings.burnInProtection}
            onChange={value => updateSetting('burnInProtection', value)}
          />
          <CheckboxRow
            label={strings.nightMode}
            value={settings.nightMode}
            onChange={value => updateSetting('nightMode', value)}
          />
          {settings.nightMode && (
            <>
              <HourStepper
                label={strings.nightModeStart}
                value={settings.nightStartHour}
                onChange={value => updateSetting('nightStartHour', value)}
              />
              <HourStepper
                label={strings.nightModeEnd}
                value={settings.nightEndHour}
                onChange={value => updateSetting('nightEndHour', value)}
              />
            </>
          )}

          {renderSlider(
            'portraitClockFontSize',
            `${strings.portraitSize}: ${previewSettings.portraitClockFontSize}`,
            50,
            300,
            1,
          )}
          {renderSlider(
            'landscapeClockFontSize',
            `${strings.landscapeSize}: ${previewSettings.landscapeClockFontSize}`,
            50,
            300,
            1,
          )}
          {renderSlider(
            'brightness',
            `${strings.clockOpacity}: ${Math.round(
              previewSettings.brightness * 100,
            )}%`,
            0.1,
            1.0,
          )}
          <CheckboxRow
            label={strings.customScreenBrightness}
            value={settings.customScreenBrightness}
            onChange={value => updateSetting('customScreenBrightness', value)}
          />
          {settings.customScreenBrightness &&
            renderSlider(
              'screenBrightness',
              `${strings.screenBrightness}: ${Math.round(
                previewSettings.screenBrightness * 100,
              )}%`,
              0.05,
              1.0,
            )}

          <View style={styles.fontSection}>
            <Text style={styles.sectionTitle}>{strings.clockFont}</Text>
            <View style={styles.fontGrid}>
              {AVAILABLE_FONTS.map(font => (
                <TouchableOpacity
                  key={font.value}
                  style={[
                    styles.fontOption,
                    settings.clockFont === font.value && styles.selectedFont,
                  ]}
                  onPress={() => updateSetting('clockFont', font.value)}>
                  <Text
                    style={[
                      styles.fontSampleText,
                      {fontFamily: font.value},
                      settings.clockFont === font.value &&
                        styles.selectedFontText,
                    ]}>
                    12:00
                  </Text>
                  <Text
                    style={[
                      styles.fontName,
                      settings.clockFont === font.value &&
                        styles.selectedFontText,
                    ]}>
                    {font.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* // Ekran yönü ayarları */}
          <View>
            <Text style={styles.sectionTitle}>{strings.screenOrientation}</Text>
            <View style={styles.orientationContainer}>
              {ORIENTATION_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    styles.orientationOption,
                    settings.orientation === option.value &&
                      styles.selectedOption,
                  ]}
                  onPress={() => updateSetting('orientation', option.value)}>
                  <Text style={styles.optionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* // Ekran yönü ayarları */}

          <About />
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  preview: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
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
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 23,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  stepperValue: {
    width: 70,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
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
  orientationOption: {
    width: '32%',
  },
  option: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#1a3c5a',
  },
  optionText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default Settings;
