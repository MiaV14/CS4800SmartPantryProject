import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

export default function SignUpScreen() {
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async () => {
    try {
      setSubmitting(true);
      await signup(email, password);
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/images/mdi_leaf.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <AppText variant="authTitle" style={styles.title}>
            Sign Up
          </AppText>

          <AppText variant="body" style={styles.subtitle}>
            Start your food saving journey today!
          </AppText>

          <View style={styles.inputGroup}>
            <AppText variant="body" style={styles.label}>
              E-mail
            </AppText>
            <AppInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <AppText variant="body" style={styles.label}>
              Password
            </AppText>
            <AppInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          <AppButton
            title={submitting ? 'Signing Up...' : 'Sign Up'}
            onPress={handleSignup}
            disabled={submitting}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>

        <View style={styles.footer}>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <AppText variant="body" style={styles.footerText}>
              Already have an account?{' '}
              <AppText variant="body" style={styles.footerLink}>
                Log In
              </AppText>
            </AppText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.porcelain_shadow,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.porcelain_shadow,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 78,
    height: 78,
  },
  card: {
    backgroundColor: COLORS.honeydew,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 28,
    borderWidth: 2,
    borderColor: COLORS.blue_spruce_shadow,
    gap: 14,
  },
  title: {
    textAlign: 'center',
    color: COLORS.blue_spruce_shadow,
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.blue_spruce_shadow,
    marginBottom: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: COLORS.blue_spruce_shadow,
  },
  button: {
    marginTop: 18,
  },
  buttonText: {
    color: COLORS.honeydew,
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.blue_spruce_shadow,
  },
  footerLink: {
    color: COLORS.blue_spruce_shadow,
  },
});