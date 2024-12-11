// src/screens/HomeScreen.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { logout } from '../services/auth';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Friends List" onPress={() => navigation.navigate('FriendsList')} />
      <Button title="Add Friend" onPress={() => navigation.navigate('AddFriend')} />
      <Button title="Groups" onPress={() => navigation.navigate('GroupList')} />
      <Button title="Logout" onPress={async () => { await logout(); navigation.replace('Login'); }} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: 20, flex:1, justifyContent:'center' }
});
