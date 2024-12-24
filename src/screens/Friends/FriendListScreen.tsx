import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, layouts } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import BackgroundLayout from '../../components/BackgroundLayout';
import api from '../../services/api';
import { NavigationProps, User, ApiResponse } from '../../types/global';

const FriendsListScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<ApiResponse<User[]>>('/friends');
      console.log('Friends response:', res.data); // Debug log
      
      // Check if response has data array
      if (Array.isArray(res.data.data)) {
        setFriends(res.data.data);
      } else {
        console.error('Invalid friends data structure:', res.data);
        setFriends([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load friends');
      console.error('Error loading friends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFriends);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <BackgroundLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      </BackgroundLayout>
    );
  }

  if (error) {
    return (
      <BackgroundLayout>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFriends}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Friends</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddFriend')}
          >
            <Ionicons name="person-add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={friends}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.friendItem}
              onPress={() => navigation.navigate('Chat', { 
                friendId: item.userId, 
                friendName: `${item.firstName} ${item.lastName}`,
                friendEmail: item.email // Add this line
              })}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {(item.firstName?.[0] || '') + (item.lastName?.[0] || '')}
                </Text>
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.friendEmail}>{item.email}</Text>
              </View>
              <Ionicons name="chatbubble-outline" size={24} color={colors.secondary} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loading && !error ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people" size={48} color={colors.mediumGray} />
                <Text style={styles.emptyText}>No friends yet</Text>
                <Text style={styles.emptySubText}>
                  Add friends to start chatting
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    padding: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: colors.white,
    marginLeft: 4,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  friendEmail: {
    ...typography.caption,
    color: colors.darkGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 16,
  },
  retryText: {
    color: colors.white,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    ...typography.body,
    color: colors.darkGray,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    ...typography.caption,
    color: colors.mediumGray,
    textAlign: 'center',
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
});


export default FriendsListScreen;
