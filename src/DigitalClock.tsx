import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

interface DigitalClockProps {
  time: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  brightness?: number;
}

const DigitalClock: React.FC<DigitalClockProps> = ({
  time,
  fontSize,
  fontFamily,
  color,
  brightness = 1.0,
}) => {
  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{fontSize, fontFamily, color, opacity: brightness}}>
        {time}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DigitalClock;
