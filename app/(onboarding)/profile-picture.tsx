import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
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

  const [fullName, setFullName] = useState('');
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

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }

    try {
      setIsSaving(true);

      const avatarUrl = imageUri
        ? await uploadProfileImage(user.id, imageUri)
        : selectedAvatar;

      await completeOnboarding(user.id, {
        full_name: trimmedName,
        diet: diet ? diet : null,
        intolerances: parsedIntolerances,
        household_size: Number.isNaN(parsedHouseholdSize)
          ? 1
          : parsedHouseholdSize,
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
      <ScrollView contentContainerStyle={styles.content}>
        <Header step={4} />

        {/* NAME INPUT */}
        <View style={styles.section}>
          <AppText variant="sectionTitle">Your Name</AppText>

          <AppInput
            label="Name"
            placeholder="Enter your name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* PROFILE IMAGE */}
        <View style={styles.section}>
          <AppText variant="sectionTitle">Profile picture</AppText>

          <View style={styles.previewWrapper}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.avatarPreview}>
                <AppText style={styles.avatarPreviewText}>
                  {selectedAvatar}
                </AppText>
              </View>
            )}
          </View>

          <AppButton title="Upload Photo" onPress={pickImage} variant="secondary" />

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
                  style={[
                    styles.avatarButton,
                    selected && styles.avatarButtonSelected,
                  ]}
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
            onPress={() => router.back()}
          />

          {isSaving && <ActivityIndicator style={{ marginTop: 8 }} />}
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
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${step * 25}%` }]} />
      </View>

      <AppText style={styles.stepText}>Step {step} of 4</AppText>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.porcelain },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 16 },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.royal_gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: { fontSize: 30 },
  title: { marginTop: 10 },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.porcelain_shadow,
    borderRadius: 999,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.royal_gold,
  },
  stepText: { marginTop: 6 },
  section: { marginTop: 24 },
  previewWrapper: { alignItems: 'center', marginVertical: 12 },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.porcelain_shadow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPreviewText: { fontSize: 40 },
  previewImage: { width: 100, height: 100, borderRadius: 50 },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },
  avatarButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: COLORS.porcelain_shadow,
  },
  avatarButtonSelected: {
    borderWidth: 2,
    borderColor: COLORS.royal_gold,
  },
  avatarEmoji: { fontSize: 24 },
  footer: { marginTop: 32, gap: 12 },
});