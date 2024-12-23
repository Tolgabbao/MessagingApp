import { Platform } from 'react-native';

export const colors = {
  primary: '#17124A',    // heasy-blue
  secondary: '#845EF7',  // heasy-purple
  white: '#FFFFFF',      // heasy-white
  black: '#040217',      // heasy-blue-b6
  error: '#FF000D',
  warning: '#FFB020',
  info: '#3366FF',
  success: '#13CE66',
  
  // Grays
  lightGray: '#F5F6F8',    // heasy-gray-g1
  mediumGray: '#CCD2DA',   // heasy-gray-g3
  darkGray: '#8B95A3',     // heasy-gray-g6
  
  // Message colors
  messageOut: '#A09BCF',   // heasy-blue-b1
  messageIn: '#FFFFFF',    // heasy-white
  
  // Additional colors
  accent: '#E90E8B',       // heasy-pink
  highlight: '#00FFD1',    // heasy-turquoise
  attention: '#F15B2A',    // heasy-orange
};

export const typography = {
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  body: {
    fontSize: 16,
    color: colors.black,
  },
  caption: {
    fontSize: 12,
    color: colors.darkGray,
  },
};

export const layouts = {
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'ios' ? 50 : 25, // Add safe area padding
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  listItem: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  messageContainer: {
    padding: 8,
    borderRadius: 8,
    maxWidth: '80%',
    marginVertical: 4,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
  },
  button: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
  },
  errorContainer: {
    backgroundColor: colors.error,
    padding: 8,
    borderRadius: 4,
  }
};
