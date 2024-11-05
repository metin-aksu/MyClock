import React from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';

function SettingsScreen(): React.JSX.Element {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text>Setting Screen</Text>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});

export default SettingsScreen;
