import React, { ReactNode } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';

type AuthScreenShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthScreenShell({
  title,
  subtitle,
  children,
  footer,
}: AuthScreenShellProps) {
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
            {title}
          </AppText>

          <AppText variant="body" style={styles.subtitle}>
            {subtitle}
          </AppText>

          {children}
        </View>

        <View style={styles.footer}>{footer}</View>
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
  footer: {
    marginTop: 28,
    alignItems: 'center',
  },
});