import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';

import AuthScreenShell from '@/components/auth/AuthScreenShell';
import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(trimmedEmail, password);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.';
      Alert.alert('Login failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell
      title="Welcome Back!"
      subtitle="Start your food saving journey today!"
      footer={
        <Pressable onPress={() => router.push('/(auth)/signup')}>
          <AppText variant="body" style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <AppText variant="body" style={styles.footerLink}>
              Sign Up
            </AppText>
          </AppText>
        </Pressable>
      }
    >
      <AppInput
        label="E-mail"
        required
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <AppInput
        label="Password"
        required
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />

      <AppButton
        title={submitting ? 'Logging In...' : 'Log In'}
        onPress={handleLogin}
        disabled={submitting}
        style={styles.button}
        textStyle={styles.buttonText}
      />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 18,
  },
  buttonText: {
    color: COLORS.honeydew,
  },
  footerText: {
    color: COLORS.blue_spruce_shadow,
  },
  footerLink: {
    color: COLORS.blue_spruce_shadow,
    fontWeight: '700',
  },
});