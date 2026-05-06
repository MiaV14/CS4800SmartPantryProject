import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { AVATAR_OPTIONS } from '@/constants/onboardingOptions';
import { useAuth } from '@/context/AuthContext';
import {
  completeOnboarding,
  uploadProfileImage,
} from '@/services/profileService';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';

import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfilePictureScreen() {
  const { user, refreshProfile } = useAuth();

  const { diet, intolerances, householdSize } = useLocalSearchParams<{
    diet?: string;
    intolerances?: string;
    householdSize?: string;
  }>();

  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const parsedIntolerances =
    intolerances && intolerances.length > 0 ? intolerances.split(',') : [];

  const parsedHouseholdSize = Number(householdSize ?? 1);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo access to choose a profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const finishOnboarding = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      const avatarUrl = imageUri
        ? await uploadProfileImage(user.id, imageUri)
        : selectedAvatar;

      await completeOnboarding(user.id, {
        diet: diet ? diet : null,
        intolerances: parsedIntolerances,
        household_size: Number.isNaN(parsedHouseholdSize) ? 1 : parsedHouseholdSize,
        avatar_url: avatarUrl,
      });

      await refreshProfile();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      Alert.alert('Something went wrong', 'We could not save your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header step={4} />

        <View style={styles.section}>
          <AppText variant="sectionTitle">Profile picture</AppText>
          <AppText variant="caption" style={styles.helperText}>
            Choose an avatar or upload a photo.
          </AppText>

          <View style={styles.previewWrapper}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.avatarPreview}>
                <AppText style={styles.avatarPreviewText}>{selectedAvatar}</AppText>
              </View>
            )}
          </View>

          <AppButton title="Upload Photo" variant="secondary" onPress={pickImage} />

          <View style={styles.avatarGrid}>
            {AVATAR_OPTIONS.map((avatar) => {
              const selected = !imageUri && selectedAvatar === avatar;

              return (
                <Pressable
                  key={avatar}
                  onPress={() => {
                    setSelectedAvatar(avatar);
                    setImageUri(null);
                  }}
                  style={[styles.avatarButton, selected && styles.avatarButtonSelected]}
                >
                  <AppText style={styles.avatarEmoji}>{avatar}</AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            title={isSaving ? 'Saving...' : "Let's Go!"}
            onPress={finishOnboarding}
            disabled={isSaving}
          />

          <AppButton
            title="← Back"
            variant="secondary"
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={isSaving}
          />

          {isSaving && (
            <ActivityIndicator
              size="small"
              color={COLORS.blue_spruce}
              style={styles.loader}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ step }: { step: number }) {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <AppText style={styles.logoIcon}>✨</AppText>
        </View>

        <AppText variant="sectionTitle" style={styles.title}>
          Set Up Profile
        </AppText>

        <AppText variant="caption" style={styles.subtitle}>
          Just a few quick questions
        </AppText>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${step * 25}%` }]} />
      </View>

      <AppText variant="caption" style={styles.stepText}>
        Step {step} of 4
      </AppText>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.porcelain,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.royal_gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoIcon: {
    fontSize: 30,
  },
  title: {
    color: COLORS.blue_spruce,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    color: COLORS.mint_leaf,
    textAlign: 'center',
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.porcelain_shadow,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.royal_gold,
  },
  stepText: {
    marginTop: 8,
    color: COLORS.mint_leaf,
  },
  section: {
    marginTop: 24,
    gap: 18,
  },
  helperText: {
    marginTop: -12,
    color: COLORS.mint_leaf,
  },
  previewWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  avatarPreview: {
    width: 112,
    height: 112,
    borderRadius: 36,
    backgroundColor: COLORS.porcelain_shadow,
    borderWidth: 2,
    borderColor: COLORS.royal_gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPreviewText: {
    fontSize: 52,
  },
  previewImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: COLORS.royal_gold,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginTop: 4,
  },
  avatarButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.porcelain_shadow,
    borderWidth: 2,
    borderColor: COLORS.porcelain_shadow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.royal_gold,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  footer: {
    marginTop: 32,
    gap: 12,
  },
  backButton: {
    marginTop: 4,
  },
  loader: {
    marginTop: 8,
  },
});