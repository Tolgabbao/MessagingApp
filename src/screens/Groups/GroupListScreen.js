// src/screens/Groups/GroupListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import api from '../../services/api';

export default function GroupListScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/groups'); 
      setGroups(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load groups');
      console.error('Error loading groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadGroups);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{padding:10}}>
        <Text style={{color:'red'}}>{error}</Text>
        <Button title="Retry" onPress={loadGroups} />
      </View>
    );
  }

  return (
    <View style={{flex:1, padding:10}}>
      <Button title="Create Group" onPress={() => navigation.navigate('CreateGroup')} />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.groupId}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate('GroupDetail', { groupId: item.groupId })}>
            <Text style={{padding:10, borderBottomWidth:1}}>{item.groupName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
