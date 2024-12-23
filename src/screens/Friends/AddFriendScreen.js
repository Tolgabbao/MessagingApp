import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, layouts } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import BackgroundLayout from '../../components/BackgroundLayout';
import api from '../../services/api';

export default function AddFriendScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddFriend = async () => {
    if (!email.trim()) return;
    
    try {
      setLoading(true);
      await api.post('/friends/add', { email });
      navigation.goBack();
      // You might want to show a success message
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add New Friend</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add" size={64} color={colors.secondary} />
          </View>

          <Text style={styles.label}>Enter friend's email address:</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={24} color={colors.darkGray} />
            <TextInput 
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="example@email.com"
              placeholderTextColor={colors.mediumGray}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!email.trim() || loading) && styles.sendButtonDisabled
            ]}
            onPress={handleAddFriend}
            disabled={!email.trim() || loading}
          >
            <Ionicons name="paper-plane" size={20} color={colors.white} />
            <Text style={styles.sendButtonText}>
              {loading ? 'Sending...' : 'Send Friend Request'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.helpText}>
            Your friend will receive a notification to accept your request
          </Text>
        </View>
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    ...typography.header,
    color: colors.white,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  label: {
    ...typography.body,
    color: colors.primary,
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.mediumGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    width: '100%',
  },
  input: {
    ...typography.body,
    flex: 1,
    marginLeft: 12,
    color: colors.black,
  },
  sendButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  sendButtonDisabled: {
    backgroundColor: colors.mediumGray,
  },
  sendButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  helpText: {
    ...typography.caption,
    color: colors.darkGray,
    textAlign: 'center',
  },
});
