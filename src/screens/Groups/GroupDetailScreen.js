import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { colors, typography, layouts } from '../../theme';
import BackgroundLayout from '../../components/BackgroundLayout';

export default function GroupDetailScreen({ route, navigation }) {
  const { groupId } = route.params;
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the endpoint structure matching the GroupController
      const groupRes = await api.get(`/groups/details/${groupId}`);
      console.log('Group details:', groupRes.data);
      setGroupInfo(groupRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load group details');
      console.error('Error loading group:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);

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
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadGroupDetails}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </BackgroundLayout>
    );
  }

  if (!groupInfo) {
    return (
      <BackgroundLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.groupName}>{groupInfo.group.groupName}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Created: {new Date(groupInfo.group.createdAt).toLocaleString()}
          </Text>
          <Text style={styles.infoText}>
            Last Updated: {new Date(groupInfo.group.updatedAt).toLocaleString()}
          </Text>
          <Text style={styles.adminText}>Admin: {groupInfo.adminName}</Text>
        </View>
        
        <Text style={styles.membersHeader}>
          Members ({groupInfo.members.length}):
        </Text>
        
        <FlatList 
          data={groupInfo.members}
          keyExtractor={(item) => item.userId}
          renderItem={({item}) => (
            <View style={styles.memberItem}>
              <Text style={styles.memberText}>
                {`${item.firstName} ${item.lastName}`}
              </Text>
              <Text style={styles.emailText}>{item.email}</Text>
            </View>
          )}
        />
        
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => navigation.navigate('GroupChat', { 
            groupId: groupInfo.group.groupId, 
            groupName: groupInfo.group.groupName,
            groupDetails: groupInfo // Pass the entire groupInfo
          })}
        >
          <Text style={styles.buttonText}>Open Chat</Text>
        </TouchableOpacity>
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layouts.contentContainer,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  groupName: {
    ...typography.header,
    color: colors.white,
  },
  infoSection: {
    padding: 16,
    backgroundColor: colors.lightGray,
  },
  infoText: {
    ...typography.body,
    color: colors.darkGray,
    marginBottom: 4,
  },
  adminText: {
    ...typography.body,
    color: colors.accent,
    fontWeight: 'bold',
    marginTop: 8,
  },
  membersHeader: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.primary,
    padding: 16,
    backgroundColor: colors.white,
  },
  memberItem: {
    ...layouts.listItem,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  memberText: {
    ...typography.body,
    color: colors.black,
  },
  emailText: {
    ...typography.caption,
    color: colors.mediumGray,
  },
  chatButton: {
    backgroundColor: colors.secondary,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
  },
  errorContainer: {
    ...layouts.errorContainer,
    margin: 16,
  },
  errorText: {
    color: colors.white,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.mediumGray,
  },
});
