import React, { useState, useEffect } from 'react';
import { Modal, FlatList, StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, layouts } from '../../theme';
import BackgroundLayout from '../../components/BackgroundLayout';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps, User, ApiResponse } from '../../types/global';

interface Friend {
  id: string;
  name: string;
  email: string;
}

interface CreateGroupResponse {
  groupId: string;
  name: string;
}

const CreateGroupScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [groupName, setGroupName] = useState<string>('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showFriendSelector, setShowFriendSelector] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getUserId = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.sub);
      }
    } catch (err) {
      console.error('Error getting user ID:', err);
    }
  };

  useEffect(() => {
    getUserId();
    const fetchFriends = async () => {
      try {
        const res = await api.get<ApiResponse<User[]>>('/friends');
        const formattedFriends: Friend[] = res.data.data.map(friend => ({
          id: friend.userId,
          name: `${friend.firstName} ${friend.lastName}`,
          email: friend.email
        }));
        setFriends(formattedFriends);
      } catch (err: any) {
        console.log('Error fetching friends: ' + err?.message);
      }
    };

    fetchFriends();
  }, []);

interface FriendSelection {
    friendId: string;
}

const handleSelectFriend = ({ friendId }: FriendSelection): void => {
    setSelectedFriends((prevSelected: string[]): string[] => {
        if (prevSelected.includes(friendId)) {
            return prevSelected.filter((id: string): boolean => id !== friendId);
        } else {
            return [...prevSelected, friendId];
        }
    });
};

  const handleOpenFriendSelector = () => setShowFriendSelector(true);
  const handleCloseFriendSelector = () => setShowFriendSelector(false);

  const handleCreateGroup = async () => {
    try {
      // Ensure current user is included
      const memberIds = [...new Set([...selectedFriends, userId])];
      const res = await api.post('/groups/create', { groupName, memberIds });
      console.log('Group created: ' + res.data.name);
      navigation.goBack();
    } catch (err: any) {
      console.log('Error creating group: ' + err?.message);
    }
  };

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
          <Text style={styles.headerText}>Create New Group</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            placeholderTextColor={colors.darkGray}
          />

          <TouchableOpacity 
            style={styles.selectButton} 
            onPress={handleOpenFriendSelector}
          >
            <Ionicons name="people" size={24} color={colors.white} />
            <Text style={styles.selectButtonText}>Select Friends</Text>
          </TouchableOpacity>

          <Text style={styles.selectedHeader}>
            Selected Friends ({selectedFriends.length})
          </Text>

          <FlatList
            data={friends.filter(f => selectedFriends.includes(f.id))}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.selectedFriendItem}
                onPress={() => handleSelectFriend({ friendId: item.id })}
              >
                <Text style={styles.friendName}>{item.name}</Text>
                <Ionicons name="close-circle" size={24} color={colors.accent} />
              </TouchableOpacity>
            )}
            style={styles.selectedList}
          />

          <TouchableOpacity 
            style={[
              styles.createButton,
              (!groupName || selectedFriends.length === 0) && styles.createButtonDisabled
            ]}
            onPress={handleCreateGroup}
            disabled={!groupName || selectedFriends.length === 0}
          >
            <Text style={styles.createButtonText}>Create Group</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showFriendSelector} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={24} color={colors.darkGray} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.darkGray}
              />
            </View>

            <FlatList
              data={friends.filter(f => 
                f.name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              keyExtractor={(item) => item.id?.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.friendItem}
                  onPress={() => handleSelectFriend({ friendId: item.id })}
                >
                  <Text style={styles.friendName}>{item.name}</Text>
                  <Text style={styles.friendEmail}>{item.email}</Text>
                  {selectedFriends.includes(item.id) && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity 
              style={styles.doneButton}
              onPress={handleCloseFriendSelector}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    ...typography.header,
    color: colors.white,
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    ...typography.body,
    color: colors.primary,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.mediumGray,
    borderRadius: 8,
    padding: 12,
    ...typography.body,
  },
  selectButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  selectButtonText: {
    ...typography.body,
    color: colors.white,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  selectedHeader: {
    ...typography.body,
    color: colors.primary,
    marginTop: 24,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  selectedList: {
    maxHeight: 200,
  },
  selectedFriendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  createButton: {
    backgroundColor: colors.success,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonDisabled: {
    backgroundColor: colors.mediumGray,
  },
  createButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    ...typography.body,
  },
  friendItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendName: {
    ...typography.body,
    color: colors.primary,
    flex: 1,
  },
  friendEmail: {
    ...typography.caption,
    color: colors.darkGray,
    marginRight: 8,
  },
  doneButton: {
    backgroundColor: colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default CreateGroupScreen;
