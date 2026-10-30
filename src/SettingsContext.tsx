import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTO_TEXT_COLOR = 'auto';

export const OrientationTypes = {
  FREE: 'free',
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
} as const;

export interface AppSettings {
  showDigitalClock: boolean;
  showAnalogClock: boolean;
  showDate: boolean;
  showWeekday: boolean;
  showBattery: boolean;
  showSettingsIcon: boolean;
  portraitClockFontSize: number;
  landscapeClockFontSize: number;
  brightness: number;
  customScreenBrightness: boolean;
  screenBrightness: number;
  clockFont: string;
  orientation: string;
  backgroundColor: string;
  textColor: string;
  use24Hour: boolean;
  burnInProtection: boolean;
  nightMode: boolean;
  nightStartHour: number;
  nightEndHour: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  showDigitalClock: true,
  showAnalogClock: false,
  showDate: true,
  showWeekday: true,
  showBattery: true,
  showSettingsIcon: true,
  portraitClockFontSize: 80,
  landscapeClockFontSize: 120,
  brightness: 1.0,
  customScreenBrightness: false,
  screenBrightness: 0.5,
  clockFont: 'System',
  orientation: OrientationTypes.FREE,
  backgroundColor: '#000000',
  textColor: AUTO_TEXT_COLOR,
  use24Hour: true,
  burnInProtection: true,
  nightMode: false,
  nightStartHour: 22,
  nightEndHour: 7,
};

const parseValue = <K extends keyof AppSettings>(
  key: K,
  raw: string | null,
): AppSettings[K] => {
  const fallback = DEFAULT_SETTINGS[key];
  if (raw === null) {
    return fallback;
  }
  if (typeof fallback === 'boolean') {
    return (raw === 'true') as AppSettings[K];
  }
  if (typeof fallback === 'number') {
    const parsed = Number(raw);
    return (Number.isNaN(parsed) ? fallback : parsed) as AppSettings[K];
  }
  return raw as AppSettings[K];
};

interface SettingsContextValue {
  settings: AppSettings;
  isLoaded: boolean;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const keys = Object.keys(DEFAULT_SETTINGS) as (keyof AppSettings)[];
        const pairs = await AsyncStorage.multiGet(keys);
        const loaded = {...DEFAULT_SETTINGS};
        pairs.forEach(([key, raw]) => {
          const settingKey = key as keyof AppSettings;
          (loaded as Record<string, unknown>)[settingKey] = parseValue(
            settingKey,
            raw,
          );
        });
        setSettings(loaded);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  const updateSetting = useCallback<SettingsContextValue['updateSetting']>(
    (key, value) => {
      setSettings(current => ({...current, [key]: value}));
      AsyncStorage.setItem(key, String(value)).catch(error =>
        console.error('Error saving setting:', error),
      );
    },
    [],
  );

  const contextValue = useMemo(
    () => ({settings, isLoaded, updateSetting}),
    [settings, isLoaded, updateSetting],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
