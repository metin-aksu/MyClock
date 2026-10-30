import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Circle, Line, Text} from 'react-native-svg';

interface AnalogClockProps {
  size?: number;
  hourHandColor?: string;
  minuteHandColor?: string;
  secondHandColor?: string;
  dialColor?: string;
  showNumbers?: boolean;
  brightness?: number;
  isModalVisible?: boolean;
  isVisible?: boolean; // Yeni prop ekledik
}

const AnalogClock: React.FC<AnalogClockProps> = ({
  size = Math.min(
    Dimensions.get('window').width,
    Dimensions.get('window').height,
  ) * 0.8,
  hourHandColor = '#FFFFFF',
  minuteHandColor = '#CCCCCC',
  secondHandColor = '#FF0000',
  dialColor = '#FFFFFF',
  showNumbers = true,
  brightness = 1.0,
  isModalVisible = false,
  isVisible = true, // Varsayılan değer true
}) => {
  const [time, setTime] = useState(new Date());
  const [showAnalogClock, setShowAnalogClock] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const analogClockValue = await AsyncStorage.getItem('showAnalogClock');
        setShowAnalogClock(
          analogClockValue === null ? false : analogClockValue === 'true',
        );
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, [isModalVisible]);

  useEffect(() => {
    // İki koşulu da kontrol ediyoruz: showAnalogClock ve isVisible
    if (showAnalogClock && isVisible) {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showAnalogClock, isVisible]); // isVisible'ı dependency array'e ekledik

  // Eğer komponent görünür değilse null döndürüyoruz
  if (!isVisible) {
    return null;
  }

  const center = size / 2;
  const radius = (size / 2) * 0.9;

  const secondAngle = time.getSeconds() * 6 - 90;
  const minuteAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1 - 90;
  const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 - 90;

  const secondHandLength = radius * 0.8;
  const minuteHandLength = radius * 0.7;
  const hourHandLength = radius * 0.5;

  const getCoordinates = (angle: number, length: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: center + length * Math.cos(radian),
      y: center + length * Math.sin(radian),
    };
  };

  const numbers = Array.from({length: 12}, (_, i) => {
    const angle = ((i + 33) % 12) * 30 * (Math.PI / 180);
    const numberRadius = radius * 0.8;
    return {
      number: i === 0 ? 12 : i,
      x: center + numberRadius * Math.cos(angle),
      y: center + numberRadius * Math.sin(angle),
    };
  });

  const secondHand = getCoordinates(secondAngle, secondHandLength);
  const minuteHand = getCoordinates(minuteAngle, minuteHandLength);
  const hourHand = getCoordinates(hourAngle, hourHandLength);

  return (
    <View style={[styles.container, {opacity: brightness}]}>
      <Svg height={size} width={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={dialColor}
          strokeWidth="2"
          fill="none"
        />

        {Array.from({length: 60}).map((_, i) => {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const isHour = i % 5 === 0;
          const lineLength = isHour ? 15 : 10;
          const outerRadius = radius;
          const innerRadius = radius - lineLength;

          return (
            <Line
              key={i}
              x1={center + innerRadius * Math.cos(angle)}
              y1={center + innerRadius * Math.sin(angle)}
              x2={center + outerRadius * Math.cos(angle)}
              y2={center + outerRadius * Math.sin(angle)}
              stroke={dialColor}
              strokeWidth={isHour ? 2 : 1}
            />
          );
        })}

        {showNumbers &&
          numbers.map(({number, x, y}) => (
            <Text
              key={number}
              x={x}
              y={y + 5}
              fill={dialColor}
              fontSize={radius * 0.15}
              textAnchor="middle"
              alignmentBaseline="middle">
              {number}
            </Text>
          ))}

        <Circle cx={center} cy={center} r={4} fill={dialColor} />

        <Line
          x1={center}
          y1={center}
          x2={hourHand.x}
          y2={hourHand.y}
          stroke={hourHandColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        <Line
          x1={center}
          y1={center}
          x2={minuteHand.x}
          y2={minuteHand.y}
          stroke={minuteHandColor}
          strokeWidth="3"
          strokeLinecap="round"
        />

        <Line
          x1={center}
          y1={center}
          x2={secondHand.x}
          y2={secondHand.y}
          stroke={secondHandColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnalogClock;
