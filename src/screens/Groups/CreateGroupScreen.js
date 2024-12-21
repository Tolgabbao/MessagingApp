import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, TextInput as RNTextInput } from 'react-native';

export default function CreateGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showFriendSelector, setShowFriendSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.sub);
    } catch (err) {
      console.error('Error getting user ID:', err);
    }
  };

  useEffect(() => {
    getUserId();
    const fetchFriends = async () => {
      try {
        const res = await api.get('/friends');
        // Map the API response to the required format
        const formattedFriends = res.data.map(friend => ({
          id: friend.userId,
          name: `${friend.firstName} ${friend.lastName}`,
          email: friend.email
        }));
        setFriends(formattedFriends);
      } catch (err) {
        alert('Error fetching friends: ' + err.message);
      }
    };

    fetchFriends();
  }, []);

  const handleSelectFriend = (friendId) => {
    setSelectedFriends((prevSelected) => {
      if (prevSelected.includes(friendId)) {
        return prevSelected.filter(id => id !== friendId);
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
      alert('Group created: ' + res.data.name);
      navigation.goBack();
    } catch (err) {
      alert('Error creating group: ' + err.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>Group Name:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        value={groupName}
        onChangeText={setGroupName}
      />
      <Button title="Select Friends" onPress={handleOpenFriendSelector} />

      <Modal visible={showFriendSelector} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <RNTextInput
            placeholder="Search friends..."
            style={{ borderWidth: 1, marginBottom: 10 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={friends.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: selectedFriends.includes(item.id) ? '#d3d3d3' : '#fff',
                  borderBottomWidth: 1,
                }}
                onPress={() => handleSelectFriend(item.id)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Done" onPress={handleCloseFriendSelector} />
        </View>
      </Modal>

      <FlatList
        // Show only selected friends
        data={friends.filter(f => selectedFriends.includes(f.id))}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: selectedFriends.includes(item.id) ? '#d3d3d3' : '#fff',
              borderBottomWidth: 1,
            }}
            onPress={() => handleSelectFriend(item.id)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Create Group" onPress={handleCreateGroup} />
    </View>
  );
}