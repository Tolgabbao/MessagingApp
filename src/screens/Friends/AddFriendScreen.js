// src/screens/Friends/AddFriendScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import api from '../../services/api';

export default function AddFriendScreen() {
  const [email, setEmail] = useState('');

  const handleAddFriend = async () => {
    try {
      await api.post('/friends/add', { email });
      alert('Friend request sent.');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <View style={{padding:20}}>
      <Text>Enter friend email:</Text>
      <TextInput 
        style={{borderWidth:1, marginBottom:10, padding:5}}
        onChangeText={setEmail}
        value={email}
      />
      <Button title="Send Friend Request" onPress={handleAddFriend} />
    </View>
  );
}
