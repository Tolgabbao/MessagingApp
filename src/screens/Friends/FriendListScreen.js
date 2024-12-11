// src/screens/Friends/FriendsListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import api from '../../services/api';

export default function FriendsListScreen({ navigation }) {
  const [friends, setFriends] = useState([]);

  const loadFriends = async () => {
    try {
      const res = await api.get('/friends');
      setFriends(res.data);
    } catch (err) {
      alert('Error loading friends: ' + err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFriends);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex:1, padding:10}}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { friendId: item.userId, friendName: item.firstName + ' ' + item.lastName })}>
            <Text style={{padding:10, borderBottomWidth:1}}>{item.firstName} {item.lastName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
