// src/screens/Groups/GroupDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import api from '../../services/api';

export default function GroupDetailScreen({ route, navigation }) {
  const { groupId } = route.params;
  const [groupInfo, setGroupInfo] = useState(null);
  const [members, setMembers] = useState([]);

  const loadGroupDetails = async () => {
    try {
      // Assuming a way to get group info. The given code only provides getGroupMembers
      // You might need an endpoint for group details. For now, let's assume group creation returns fields like name, creationTime in the object.
      // If not, you can store it locally or request from backend. We'll just load members and mock some info.
      
      const memberRes = await api.get(`/groups/${groupId}/members`);
      setMembers(memberRes.data);

      // If group object returned during creation includes creation time and name, 
      // you might store it in GroupList or have a separate endpoint. 
      // Let's assume we have an endpoint /groups/{groupId} to get details:
      // Not defined in the given code, but let's assume:
      const groupRes = await api.get(`/groups/${groupId}`);
      setGroupInfo(groupRes.data);
    } catch (err) {
      alert('Error loading group details: ' + err.message);
    }
  };

  useEffect(() => {
    loadGroupDetails();
  }, []);

  return (
    <View style={{padding:10}}>
      {groupInfo && (
        <>
          <Text>Group Name: {groupInfo.name}</Text>
          <Text>Creation Time: {new Date(groupInfo.creationTime).toString()}</Text>
          <Text>Members:</Text>
          <FlatList 
            data={members}
            keyExtractor={(item) => item}
            renderItem={({item}) => <Text>{item}</Text>}
          />
          <Button title="Open Chat" onPress={() => navigation.navigate('GroupChat', { groupId, groupName: groupInfo.name })} />
        </>
      )}
    </View>
  );
}
