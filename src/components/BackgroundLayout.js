import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export default function BackgroundLayout({ children, style }) {
  return (
    <ImageBackground
      source={require('../../assets/background.jpeg')}
      style={[styles.background, style]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
});
