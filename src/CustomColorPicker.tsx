import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Modal, Text} from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
import tinycolor from 'tinycolor2';

import {strings} from './i18n';
import {getContrastColor} from './utils';

const PRESET_COLORS = [
  '#000000',
  '#222222',
  '#666666',
  '#888888',
  '#FFFFFF',
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

const FALLBACK_COLOR = '#FFFFFF';

interface CustomColorPickerProps {
  // null: hazır renklerden hiçbiri seçili değil (ör. otomatik yazı rengi)
  value: string | null;
  onChange: (color: string) => void;
}

export default function CustomColorPicker({
  value,
  onChange,
}: CustomColorPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const customColor = value ?? FALLBACK_COLOR;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {PRESET_COLORS.map(color => {
          const isSelected = value?.toUpperCase() === color;
          return (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                {backgroundColor: color},
                isSelected ? styles.selectedCircle : styles.unselectedCircle,
              ]}
              onPress={() => onChange(color)}
            />
          );
        })}
        <TouchableOpacity
          style={[
            styles.colorCircle,
            styles.customCircle,
            {backgroundColor: customColor},
          ]}
          onPress={() => setModalVisible(true)}>
          <Text
            style={[styles.plusText, {color: getContrastColor(customColor)}]}>
            +
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        supportedOrientations={['portrait', 'landscape-left', 'landscape-right']}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.wheel}>
              <WheelColorPicker
                color={customColor}
                onColorChangeComplete={color => {
                  onChange(tinycolor(color).toHexString());
                }}
                thumbSize={28}
                sliderHidden={true}
                swatches={false}
              />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>{strings.close}</Text>
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
  selectedCircle: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  unselectedCircle: {
    borderWidth: 1,
    borderColor: '#888',
  },
  customCircle: {
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 18,
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
    backgroundColor: '#222',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  wheel: {
    width: 250,
    height: 250,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
  },
});
