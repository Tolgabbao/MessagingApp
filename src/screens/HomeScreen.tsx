import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, layouts } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import BackgroundLayout from '../components/BackgroundLayout';
import { logout } from '../services/auth';
import { NavigationProps } from '../types/global';

interface MenuItem {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color: string;
}

const HomeScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const menuItems: MenuItem[] = [
    {
          title: "Friends List",
          icon: "people",
          onPress: () => navigation.navigate('FriendsList'),
          color: colors.secondary
        },
        {
          title: "Add Friend",
          icon: "person-add",
          onPress: () => navigation.navigate('AddFriend'),
          color: colors.accent
        },
        {
          title: "Friend Requests",
          icon: "mail-unread",
          onPress: () => navigation.navigate('PendingRequests'),
          color: colors.attention
        },
        {
          title: "Groups",
          icon: "chatbubbles",
          onPress: () => navigation.navigate('GroupList'),
          color: colors.highlight
        }
  ];

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome</Text>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={async () => { 
              await logout(); 
              navigation.replace('Login'); 
            }}
          >
            <Ionicons name="log-out" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.title}
              style={[styles.menuItem, { backgroundColor: item.color }]}
              onPress={item.onPress}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={32} color={colors.white} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={colors.white} 
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Messaging App v1.0
            </Text>
          </View>
        </View>
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    ...typography.header,
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.error,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
    fontSize: 18,
  },
  chevron: {
    opacity: 0.8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    ...typography.caption,
    color: colors.darkGray,
  },
});


export default HomeScreen;
