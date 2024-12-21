import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import api from '../../services/api';

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
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{padding:10}}>
        <Text style={{color:'red'}}>{error}</Text>
        <Button title="Retry" onPress={loadGroupDetails} />
      </View>
    );
  }

  if (!groupInfo) {
    return <View style={{padding:10}}><Text>Loading...</Text></View>;
  }

  return (
    <View style={{padding:10}}>
      <Text style={{fontSize:18, fontWeight:'bold', marginBottom:10}}>
        {groupInfo.groupName}
      </Text>
      <Text>Created: {new Date(groupInfo.createdAt).toLocaleString()}</Text>
      <Text>Last Updated: {new Date(groupInfo.updatedAt).toLocaleString()}</Text>
      <Text>Created By: {groupInfo.createdBy}</Text>
      
      <Text style={{marginTop:20, marginBottom:10, fontWeight:'bold'}}>
        Members ({groupInfo.members.length}):
      </Text>
      <FlatList 
        data={groupInfo.members}
        keyExtractor={(item) => item}
        renderItem={({item}) => (
          <Text style={{padding:5}}>{item}</Text>
        )}
      />
      <Button 
        title="Open Chat" 
        onPress={() => navigation.navigate('GroupChat', { 
          groupId: groupInfo.groupId, 
          groupName: groupInfo.groupName 
        })} 
      />
    </View>
  );
}
