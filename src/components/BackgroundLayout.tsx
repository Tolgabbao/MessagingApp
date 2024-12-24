import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { StyledComponentProps } from '../types/global';

const BackgroundLayout: React.FC<StyledComponentProps> = ({ children, style }) => {
    return (
      <ImageBackground
        source={require('../../assets/background.jpeg')}
        style={[styles.background, style]}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
    },
  });
  
  export default BackgroundLayout;