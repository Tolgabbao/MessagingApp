import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { colors, typography, layouts } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import BackgroundLayout from '../../components/BackgroundLayout';
import api from '../../services/api';
import { NavigationProps, Group, ApiResponse, GroupDetails } from '../../types/global';

const GroupListScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<ApiResponse<Group[]>>('/groups');
      console.log('Groups response:', JSON.stringify(res.data, null, 2)); // Debug log
      setGroups(res.data.data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load groups');
      console.error('Error loading groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupPress = async (group: Group) => {
    try {
      const res = await api.get<ApiResponse<GroupDetails>>(`/groups/details/${group.groupId}`);
      console.log('Group details response:', JSON.stringify(res.data, null, 2));

      if (!res.data?.data) {
        throw new Error('No group details received');
      }

      // Navigate to GroupDetail with correct data structure
      navigation.navigate('GroupDetail', {
        groupId: group.groupId,
        groupDetails: res.data.data
      });
    } catch (err) {
      console.error('Error fetching group details:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadGroups);
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
          <TouchableOpacity style={styles.retryButton} onPress={loadGroups}>
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
          <Text style={styles.headerText}>My Groups</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <Ionicons name="add-circle" size={24} color={colors.white} />
            <Text style={styles.createButtonText}>New Group</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={groups}
          keyExtractor={(item: Group) => item.groupId}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => (
            <TouchableOpacity 
              style={styles.groupItem}
              onPress={() => handleGroupPress(item)}
            >
              <View style={styles.groupIcon}>
                <Text style={styles.groupInitial}>
                  {item.groupName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{item.groupName}</Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={colors.darkGray} 
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people" size={48} color={colors.mediumGray} />
              <Text style={styles.emptyText}>No groups yet</Text>
              <Text style={styles.emptySubText}>
                Create a group to start chatting with your friends
              </Text>
            </View>
          }
        />
      </View>
    </BackgroundLayout>
  );
};

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
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    padding: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: colors.white,
    marginLeft: 4,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  groupItem: {
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
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInitial: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  groupInfo: {
    flex: 1,
    marginLeft: 12,
  },
  groupName: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  memberCount: {
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
    marginRight: 16,
  },
});

export default GroupListScreen;
