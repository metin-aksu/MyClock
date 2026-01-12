import React from 'react';
import {View, Text, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import {
  version as appVersion,
  name as appName,
  author as appAuthor,
  website as appWebsite,
} from '../app.json';

const About: React.FC = () => {
  const handleLinkPress = () => {
    Linking.openURL(appWebsite).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <View style={styles.aboutContainer}>
      <Text style={styles.aboutText}>{appAuthor}</Text>
      <TouchableOpacity onPress={handleLinkPress}>
        <Text style={[styles.aboutText, styles.linkText]}>{appWebsite}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    marginTop: 40,
  },
  aboutText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#fff',
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default About;
