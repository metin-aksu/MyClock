import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle, Line, Text} from 'react-native-svg';

import {useAlignedNow} from './useAlignedNow';

interface AnalogClockProps {
  size: number;
  color?: string;
  secondHandColor?: string;
  showNumbers?: boolean;
  brightness?: number;
  isActive?: boolean;
}

const AnalogClock: React.FC<AnalogClockProps> = ({
  size,
  color = '#FFFFFF',
  secondHandColor = '#FF0000',
  showNumbers = true,
  brightness = 1.0,
  isActive = true,
}) => {
  const time = useAlignedNow(1000, isActive);

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
          stroke={color}
          strokeWidth="2"
          fill="none"
        />

        {Array.from({length: 60}).map((_, i) => {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const isHour = i % 5 === 0;
          const lineLength = radius * (isHour ? 0.08 : 0.05);
          const outerRadius = radius;
          const innerRadius = radius - lineLength;

          return (
            <Line
              key={i}
              x1={center + innerRadius * Math.cos(angle)}
              y1={center + innerRadius * Math.sin(angle)}
              x2={center + outerRadius * Math.cos(angle)}
              y2={center + outerRadius * Math.sin(angle)}
              stroke={color}
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
              fill={color}
              fontSize={radius * 0.15}
              textAnchor="middle"
              alignmentBaseline="middle">
              {number}
            </Text>
          ))}

        <Circle cx={center} cy={center} r={4} fill={color} />

        <Line
          x1={center}
          y1={center}
          x2={hourHand.x}
          y2={hourHand.y}
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />

        <Line
          x1={center}
          y1={center}
          x2={minuteHand.x}
          y2={minuteHand.y}
          stroke={color}
          strokeOpacity={0.8}
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
