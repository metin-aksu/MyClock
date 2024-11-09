import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Svg, {Circle, Line, G, Text} from 'react-native-svg';

interface AnalogClockProps {
  size?: number;
  hourHandColor?: string;
  minuteHandColor?: string;
  secondHandColor?: string;
  dialColor?: string;
  showNumbers?: boolean;
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
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Saat merkez noktası
  const center = size / 2;
  // Kadran yarıçapı
  const radius = (size / 2) * 0.9;

  // Saat, dakika ve saniye açılarını hesapla
  const secondAngle = time.getSeconds() * 6 - 90; // Her saniye 6 derece (360/60)
  const minuteAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1 - 90; // Her dakika 6 derece
  const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 - 90; // Her saat 30 derece (360/12)

  // Akrep, yelkovan ve saniye kollarının uzunlukları
  const secondHandLength = radius * 0.8;
  const minuteHandLength = radius * 0.7;
  const hourHandLength = radius * 0.5;

  // Açıdan x,y koordinatlarını hesaplama fonksiyonu
  const getCoordinates = (angle: number, length: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: center + length * Math.cos(radian),
      y: center + length * Math.sin(radian),
    };
  };

  // Saat rakamlarını oluştur
  const numbers = Array.from({length: 12}, (_, i) => {
    const angle = (i * 30 - 60) * (Math.PI / 180); // Her rakam arası 30 derece
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
    <View style={styles.container}>
      <Svg height={size} width={size}>
        {/* Saat kadranı */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={dialColor}
          strokeWidth="2"
          fill="none"
        />

        {/* Saat çizgileri */}
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

        {/* Saat rakamları */}
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

        {/* Merkez noktası */}
        <Circle cx={center} cy={center} r={4} fill={dialColor} />

        {/* Akrep */}
        <Line
          x1={center}
          y1={center}
          x2={hourHand.x}
          y2={hourHand.y}
          stroke={hourHandColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Yelkovan */}
        <Line
          x1={center}
          y1={center}
          x2={minuteHand.x}
          y2={minuteHand.y}
          stroke={minuteHandColor}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Saniye */}
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
