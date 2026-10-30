import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Modal, Text} from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
import tinycolor from 'tinycolor2';

const PRESET_COLORS = [
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

export default function CustomColorPicker({value, onChange}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {PRESET_COLORS.map(color => (
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
        <TouchableOpacity
          style={[
            styles.colorCircle,
            {
              backgroundColor: value,
              borderWidth: 2,
              borderColor: '#007AFF',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
          onPress={() => setModalVisible(true)}>
          <Text style={{color: '#fff', fontSize: 18}}>+</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: value }]}> 
            <WheelColorPicker
              color={value}
              onColorChange={color => {
                const hex = tinycolor(color).toHexString();
                onChange(hex);
              }}
              thumbStyle={{ borderWidth: 2, borderColor: '#fff' }}
              sliderHidden={true}
              style={{ width: 250, height: 250 }}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#fff', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  modalContent: {
    minWidth: 280,
    maxWidth: 340,
    minHeight: 340,
    maxHeight: 400,
    backgroundColor: '#222',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
