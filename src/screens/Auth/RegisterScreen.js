import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, layouts } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import BackgroundLayout from '../../components/BackgroundLayout';
import { register } from '../../services/auth';
import StyledTextInput from '../../components/StyledTextInput';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (Object.values(formData).some(value => !value.trim())) return;
    
    try {
      setLoading(true);
      // Convert email to lowercase before sending
      const registrationData = {
        ...formData,
        email: formData.email.toLowerCase()
      };
      await register(
        registrationData.firstName,
        registrationData.lastName,
        registrationData.email,
        registrationData.password
      );
      navigation.replace('Login');
    } catch (err) {
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create Account</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add" size={64} color={colors.secondary} />
          </View>

          <StyledTextInput
            icon="person"
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
          />

          <StyledTextInput
            icon="person"
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
          />

          <StyledTextInput
            icon="mail"
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ 
              ...prev, 
              email: text.toLowerCase() // Convert to lowercase while typing
            }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <StyledTextInput
            icon="lock-closed"
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            secureTextEntry
          />

          <TouchableOpacity
            style={[
              styles.registerButton,
              (Object.values(formData).some(value => !value.trim()) || loading) && styles.registerButtonDisabled
            ]}
            onPress={handleRegister}
            disabled={Object.values(formData).some(value => !value.trim()) || loading}
          >
            <Ionicons name="person-add" size={24} color={colors.white} />
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>Already have an account?</Text>
            <Text style={styles.loginTextBold}>Login Here</Text>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.white}20`,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerText: {
    ...typography.header,
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    alignSelf: 'center',
  },
  registerButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  registerButtonDisabled: {
    backgroundColor: colors.mediumGray,
  },
  registerButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    ...typography.body,
    color: colors.darkGray,
  },
  loginTextBold: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
