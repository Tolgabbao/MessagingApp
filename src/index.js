export * from './theme';
export * from './styles/common';
export * from './components/StyleProvider';

// Default app-wide settings
import { colors } from './theme';
import { NavigationContainer } from '@react-navigation/native';

export const navigationTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.white,
    card: colors.white,
    text: colors.black,
    border: colors.lightGray,
  },
};
