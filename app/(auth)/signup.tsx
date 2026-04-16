import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';

import AuthScreenShell from '@/components/auth/AuthScreenShell';
import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import AppText from '@/components/ui/AppText';
import PasswordInput from '@/components/ui/PasswordInput';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

export default function SignUpScreen() {
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await signup(trimmedEmail, password);
      router.replace('/(tabs)');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.';
      Alert.alert('Sign up failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell
      title="Sign Up"
      subtitle="Start your food saving journey today!"
      footer={
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <AppText variant="body" style={styles.footerText}>
            Already have an account?{' '}
            <AppText variant="body" style={styles.footerLink}>
              Log In
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

      <PasswordInput
        label="Password"
        required
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
      />

      <PasswordInput
        label="Confirm Password"
        required
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Re-enter your password"
      />

      <AppButton
        title={submitting ? 'Signing Up...' : 'Sign Up'}
        onPress={handleSignup}
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