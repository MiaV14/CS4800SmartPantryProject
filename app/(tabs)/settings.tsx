import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <AppText variant="sectionTitle" style={styles.title}>
          Settings
        </AppText>

        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            Account
          </AppText>

          <View style={styles.card}>
            <AppText variant="body">Logged in as</AppText>
            <AppText variant="body" style={styles.email}>
              {user?.email ?? 'No email'}
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            Preferences
          </AppText>

          <View style={styles.card}>
            <AppText variant="body">Notifications</AppText>
            <AppText variant="caption">Coming soon</AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            App
          </AppText>

          <View style={styles.card}>
            <AppText variant="body">Freshli</AppText>
            <AppText variant="caption">Version 1.0.0</AppText>
          </View>
        </View>

        <View style={styles.logoutWrapper}>
          <AppButton
            title="Log Out"
            onPress={handleLogout}
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.porcelain_shadow,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  title: {
    color: COLORS.blue_spruce_shadow,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    color: COLORS.blue_spruce_shadow,
  },
  card: {
    backgroundColor: COLORS.honeydew,
    borderRadius: 16,
    padding: 16,
    gap: 4,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.blue_spruce_shadow,
  },
  email: {
    marginTop: 2,
  },
  logoutWrapper: {
    marginTop: 'auto',
  },
});