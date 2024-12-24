import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import BackgroundLayout from '../../components/BackgroundLayout';
import api from '../../services/api';
import { NavigationProps, FriendRequest, ApiResponse } from '../../types/global';

const PendingFriendRequestsScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [receivedRes, sentRes] = await Promise.all([
        api.get<ApiResponse<FriendRequest[]>>('/friends/pending'),
        api.get<ApiResponse<FriendRequest[]>>('/friends/sent')
      ]);

      console.log('Received requests:', JSON.stringify(receivedRes.data, null, 2));
      console.log('Sent requests:', JSON.stringify(sentRes.data, null, 2));

      setPendingRequests(receivedRes.data.data || []);
      setSentRequests((sentRes.data.data || []).map(req => ({ ...req, isSent: true })));
    } catch (err: any) {
      setError('Failed to load requests');
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllRequests();
    const unsubscribe = navigation.addListener('focus', loadAllRequests);
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

  const allRequests = [...pendingRequests, ...sentRequests];

  const handleAcceptRequest = async (email: string): Promise<void> => {
    try {
      await api.post('/friends/accept', { email });
      setPendingRequests(current => 
        current.filter(request => request.email !== email)
      );
    } catch (err: any) {
      console.log('Error accepting request: ' + (err?.message || 'Unknown error'));
    }
  };

  const renderRequestItem = ({ item, isSent }: { item: FriendRequest; isSent?: boolean }) => (
    <View style={styles.requestItem}>
          <View style={styles.userInfo}>
            <View style={[styles.avatarContainer, isSent && styles.avatarContainerSent]}>
              <Text style={styles.avatarText}>
                {(item.firstName?.[0] || '') + (item.lastName?.[0] || '')}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>
                {`${item.firstName} ${item.lastName}`}
              </Text>
              <Text style={styles.emailText}>{item.email}</Text>
            </View>
          </View>
          {!isSent && (
            <TouchableOpacity 
              style={styles.acceptButton}
              onPress={() => handleAcceptRequest(item.email)}
            >
              <Ionicons name="checkmark" size={24} color={colors.white} />
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          )}
          {isSent && (
            <View style={styles.sentBadge}>
              <Ionicons name="time" size={16} color={colors.mediumGray} />
              <Text style={styles.sentText}>Sent</Text>
            </View>
          )}
        </View>
  );

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
          <Text style={styles.headerText}>Friend Requests</Text>
        </View>

        <FlatList
          data={allRequests}
          keyExtractor={(item) => `${item.userId}-${item.isSent ? 'sent' : 'received'}`}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => renderRequestItem({ item, isSent: item.isSent })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open" size={48} color={colors.mediumGray} />
              <Text style={styles.emptyText}>No pending requests</Text>
              <Text style={styles.emptySubText}>
                Friend requests you send or receive will appear here
              </Text>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    ...typography.header,
    color: colors.white,
    flex: 1,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  requestItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  emailText: {
    ...typography.caption,
    color: colors.darkGray,
  },
  timeText: {
    ...typography.caption,
    color: colors.darkGray,
    marginTop: 4,
  },
  acceptButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  acceptButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
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
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  avatarContainerSent: {
    backgroundColor: colors.mediumGray,
  },
  sentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 16,
  },
  sentText: {
    ...typography.caption,
    color: colors.darkGray,
    marginLeft: 4,
  },
  backButton: {
    marginRight: 16,
  },
});


export default PendingFriendRequestsScreen;
