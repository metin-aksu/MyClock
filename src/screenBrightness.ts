import {useEffect} from 'react';
import {AppState, NativeModules} from 'react-native';

const SYSTEM_BRIGHTNESS = -1;

const applyScreenBrightness = (value: number | null) => {
  NativeModules.ScreenBrightness.setBrightness(value ?? SYSTEM_BRIGHTNESS);
};

// null sistem parlaklığını kullanır. Uygulama öne dönünce değer yeniden uygulanır,
// çünkü Android'de pencere yeniden oluşturulmuş olabilir.
export const useScreenBrightness = (value: number | null) => {
  useEffect(() => {
    applyScreenBrightness(value);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        applyScreenBrightness(value);
      }
    });
    return () => subscription.remove();
  }, [value]);
};
