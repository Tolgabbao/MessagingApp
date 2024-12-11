// src/screens/Groups/GroupListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList } from 'react-native';
import api from '../../services/api';

export default function GroupListScreen({ navigation }) {
  const [groups, setGroups] = useState([]);

  const loadGroups = async () => {
    try {
      // Assuming an endpoint for listing groups user belongs to is /groups (not defined above, but can be implemented)
      // If not implemented, create or adjust accordingly. For now let's assume:
      // The backend would need a /groups endpoint that returns groups the user is part of.
      const res = await api.get('/groups'); 
      setGroups(res.data);
    } catch (err) {
      alert('Error loading groups: ' + err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadGroups);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex:1, padding:10}}>
      <Button title="Create Group" onPress={() => navigation.navigate('CreateGroup')} />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}>
            <Text style={{padding:10, borderBottomWidth:1}}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
