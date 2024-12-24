import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { StyledComponentProps } from '../types/global';

interface StyledTextInputProps extends Omit<TextInputProps, 'style'>, Omit<StyledComponentProps, 'style'> {
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
  style?: TextInputProps['style'];
}

const StyledTextInput: React.FC<StyledTextInputProps> = ({
  icon,
  value,
  onChangeText,
  placeholder,
  style,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={colors.darkGray} />
        </View>
      )}
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mediumGray}
        autoCorrect={false}
        underlineColorAndroid="transparent"
        selectionColor={colors.secondary}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.mediumGray,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      width: '100%',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    iconContainer: {
      marginRight: 12,
      width: 24,
      alignItems: 'center',
    },
    input: {
      ...typography.body,
      flex: 1,
      color: colors.black,
      padding: 0,
      margin: 0,
      minHeight: 20,
    },
  });
  
  export default StyledTextInput;
