import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import api from '../../services/api';

export default function PendingFriendRequestsScreen() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/friends/pending');
      setPendingRequests(response.data);
    } catch (err) {
      alert('Error loading requests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (email) => {
    try {
      await api.post('/friends/accept', { email });
      alert('Friend request accepted');
      loadPendingRequests(); // Refresh the list
    } catch (err) {
      alert('Error accepting request: ' + err.message);
    }
  };

  useEffect(() => {
    loadPendingRequests();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item.email}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <Text style={styles.email}>{item.email}</Text>
              <Button 
                title="Accept" 
                onPress={() => handleAcceptRequest(item.email)}
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No pending friend requests</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  email: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  }
});
