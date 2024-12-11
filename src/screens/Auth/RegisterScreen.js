// src/screens/Auth/RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { register } from '../../services/auth';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  const handleRegister = async () => {
    try {
      await register(firstName, lastName, email, password);
      alert('User registered successfully. Please login.');
      navigation.navigate('Login');
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>First Name:</Text>
      <TextInput style={styles.input} onChangeText={setFirstName} value={firstName} />
      <Text>Last Name:</Text>
      <TextInput style={styles.input} onChangeText={setLastName} value={lastName} />
      <Text>Email:</Text>
      <TextInput style={styles.input} autoCapitalize="none" onChangeText={setEmail} value={email} />
      <Text>Password:</Text>
      <TextInput style={styles.input} secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: 20, flex:1, justifyContent:'center' },
  input: { borderWidth:1, marginBottom:10, padding:5 }
});
