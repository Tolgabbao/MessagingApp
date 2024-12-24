import { Theme as NavigationTheme } from '@react-navigation/native';
import { colors } from './theme';

// Export all
export * from './theme';
export * from './styles/common';
export * from './components/StyleProvider';

// Define theme interface
export interface AppTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
  };
}

// Type the navigation theme
export const navigationTheme: NavigationTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.white,
    card: colors.white,
    text: colors.black,
    border: colors.lightGray,
    notification: colors.primary,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: 'bold',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900',
    },
  },
};