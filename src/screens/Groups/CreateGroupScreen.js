// src/screens/Groups/CreateGroupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import api from '../../services/api';

export default function CreateGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [memberIds, setMemberIds] = useState(''); 
  // memberIds can be comma-separated userIds for simplicity.

  const handleCreateGroup = async () => {
    try {
      const members = memberIds.split(',').map(m => m.trim()).filter(m => m.length > 0);
      const res = await api.post('/groups/create', { groupName, memberIds: members });
      alert('Group created: ' + res.data.name);
      navigation.goBack();
    } catch (err) {
      alert('Error creating group: ' + err.message);
    }
  };

  return (
    <View style={{padding:20}}>
      <Text>Group Name:</Text>
      <TextInput style={{borderWidth:1, marginBottom:10}} value={groupName} onChangeText={setGroupName} />
      <Text>Member IDs (comma separated):</Text>
      <TextInput style={{borderWidth:1, marginBottom:10}} value={memberIds} onChangeText={setMemberIds} />
      <Button title="Create Group" onPress={handleCreateGroup} />
    </View>
  );
}
