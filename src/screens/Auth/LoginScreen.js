import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, layouts } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import BackgroundLayout from '../../components/BackgroundLayout';
import { login } from '../../services/auth';
import StyledTextInput from '../../components/StyledTextInput';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    
    try {
      setLoading(true);
      // Convert email to lowercase before sending
      await login(email.toLowerCase(), password);
      navigation.replace('Home');
    } catch (err) {
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome Back</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Ionicons name="chatbubbles" size={80} color={colors.secondary} />
          </View>

          <StyledTextInput
            icon="mail"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())} // Convert to lowercase while typing
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <StyledTextInput
            icon="lock-closed"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[
              styles.loginButton,
              (!email.trim() || !password.trim() || loading) && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={!email.trim() || !password.trim() || loading}
          >
            <Ionicons name="log-in" size={24} color={colors.white} />
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>Don't have an account?</Text>
            <Text style={styles.registerTextBold}>Register Now</Text>
          </TouchableOpacity>
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
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    ...typography.header,
    fontSize: 28,
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginTop: 16,
  },
  loginButtonDisabled: {
    backgroundColor: colors.mediumGray,
  },
  loginButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  registerButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    ...typography.body,
    color: colors.darkGray,
  },
  registerTextBold: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
