import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

const COLORS = [
  '#000000',
  '#222222',
  '#666666',
  '#888888',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#00FFFF',
  '#FF00FF',
  '#FFA500',
  '#800080',
  '#008000',
  '#808000',
  '#008080',
  '#C0C0C0',
];

export default function ColorPicker({value, onChange}) {
  return (
    <View style={styles.container}>
      {COLORS.map(color => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorCircle,
            {
              backgroundColor: color,
              borderWidth: value === color ? 3 : 1,
              borderColor: value === color ? '#fff' : '#888',
            },
          ]}
          onPress={() => onChange(color)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
    justifyContent: 'center',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 6,
  },
});
