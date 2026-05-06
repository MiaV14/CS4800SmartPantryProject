import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { user, profile, logout } = useAuth();

  const avatarUrl = profile?.avatar_url;
  const isImageAvatar = avatarUrl?.startsWith('http');

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <AppText variant="sectionTitle" style={styles.title}>
          Settings
        </AppText>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {isImageAvatar ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <AppText style={styles.avatarEmoji}>{avatarUrl ?? '🏠'}</AppText>
            )}
          </View>

          <View style={styles.profileInfo}>
            <AppText variant="cardTitle" style={styles.profileName}>
              My Profile
            </AppText>
            <AppText variant="caption" style={styles.email}>
              {user?.email ?? 'No email'}
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            Preferences
          </AppText>

          <View style={styles.card}>
            <InfoRow label="Diet" value={profile?.diet || 'No preference'} />
            <InfoRow
              label="Intolerances"
              value={
                profile?.intolerances?.length
                  ? profile.intolerances.join(', ')
                  : 'None selected'
              }
            />
            <InfoRow
              label="Household"
              value={`${profile?.household_size ?? 1} ${
                profile?.household_size === 1 ? 'person' : 'people'
              }`}
            />
          </View>

          <AppButton
            title="Edit Profile"
            variant="accent"
            onPress={() => router.push('/profile/edit')}
          />
        </View>

        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            App
          </AppText>

          <View style={styles.card}>
            <InfoRow label="Freshli" value="Version 1.0.0" />
          </View>
        </View>

        <View style={styles.logoutWrapper}>
          <AppButton title="Log Out" onPress={handleLogout} variant="secondary" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="caption" style={styles.infoLabel}>
        {label}
      </AppText>
      <AppText variant="body" style={styles.infoValue}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.porcelain,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 22,
  },
  title: {
    color: COLORS.blue_spruce_shadow,
  },
  profileCard: {
    backgroundColor: COLORS.honeydew,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.blue_spruce_shadow,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: COLORS.porcelain,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 24,
  },
  avatarEmoji: {
    fontSize: 34,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: COLORS.blue_spruce_shadow,
  },
  email: {
    color: COLORS.mint_leaf,
    marginTop: 4,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    color: COLORS.blue_spruce_shadow,
  },
  card: {
    backgroundColor: COLORS.honeydew,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.blue_spruce_shadow,
  },
  infoRow: {
    gap: 3,
  },
  infoLabel: {
    color: COLORS.mint_leaf,
  },
  infoValue: {
    color: COLORS.blue_spruce_shadow,
  },
  logoutWrapper: {
    marginTop: 'auto',
  },
});