import {useEffect, useState} from 'react';
import {AppState} from 'react-native';

// Saati, birim (saniye/dakika) sınırına hizalı olarak günceller.
export const useAlignedNow = (unitMs: number, enabled = true) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = new Date();
      setNow(current);
      timer = setTimeout(tick, unitMs - (current.getTime() % unitMs));
    };
    tick();

    // Arka planda duran zamanlayıcı dönüşte hemen yenilensin
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        clearTimeout(timer);
        tick();
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, [unitMs, enabled]);

  return now;
};
