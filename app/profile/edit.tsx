// app/profile/edit.tsx

import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';
import FilterChip from '@/components/ui/FilterChip';
import { COLORS } from '@/constants/colors';
import {
    AVATAR_OPTIONS,
    DIET_OPTIONS,
    INTOLERANCE_OPTIONS,
} from '@/constants/onboardingOptions';
import { useAuth } from '@/context/AuthContext';
import {
    updateProfilePreferences,
    uploadProfileImage,
} from '@/services/profileService';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
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

export default function EditProfileScreen() {
  const { user, profile, refreshProfile } = useAuth();

  const [selectedDiet, setSelectedDiet] = useState(profile?.diet ?? null);
  const [intolerances, setIntolerances] = useState<string[]>(
    profile?.intolerances ?? []
  );
  const [household, setHousehold] = useState(profile?.household_size ?? 1);

  const [selectedAvatar, setSelectedAvatar] = useState(
    profile?.avatar_url && !profile.avatar_url.startsWith('http')
      ? profile.avatar_url
      : AVATAR_OPTIONS[0]
  );

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const toggleIntolerance = (value: string) => {
    setIntolerances((curr) =>
      curr.includes(value)
        ? curr.filter((i) => i !== value)
        : [...curr, value]
    );
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Enable photo access.');
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

  const saveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

        const avatarUrl = imageUri
            ? await uploadProfileImage(user.id, imageUri)
            : profile?.avatar_url ?? selectedAvatar;

        await updateProfilePreferences(user.id, {
            diet: selectedDiet,
            intolerances,
            household_size: household,
            avatar_url: avatarUrl,
        });

      await refreshProfile();
      router.replace('/(tabs)/settings');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const isImageAvatar = imageUri || profile?.avatar_url?.startsWith('http');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="sectionTitle">Edit Profile</AppText>

        {/* Avatar */}
        <View style={styles.section}>
          <AppText variant="body">Profile Picture</AppText>

          <View style={styles.preview}>
            {isImageAvatar ? (
              <Image
                source={{ uri: imageUri || profile?.avatar_url! }}
                style={styles.image}
              />
            ) : (
              <AppText style={styles.emoji}>{selectedAvatar}</AppText>
            )}
          </View>

          <AppButton title="Upload Photo" variant="secondary" onPress={pickImage} />

          <View style={styles.avatarGrid}>
            {AVATAR_OPTIONS.map((a) => (
              <Pressable
                key={a}
                onPress={() => {
                  setSelectedAvatar(a);
                  setImageUri(null);
                }}
                style={[
                  styles.avatarBtn,
                  selectedAvatar === a && !imageUri && styles.selected,
                ]}
              >
                <AppText>{a}</AppText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Diet */}
        <View style={styles.section}>
          <AppText variant="body">Diet</AppText>

          <View style={styles.grid}>
            {DIET_OPTIONS.map((d) => (
              <Pressable
                key={d.label}
                onPress={() => setSelectedDiet(d.value)}
                style={[
                  styles.card,
                  selectedDiet === d.value && styles.selected,
                ]}
              >
                <AppText>{d.icon}</AppText>
                <AppText>{d.label}</AppText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Intolerances */}
        <View style={styles.section}>
          <AppText variant="body">Intolerances</AppText>

          <View style={styles.chips}>
            {INTOLERANCE_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                selected={intolerances.includes(opt.value)}
                onPress={() => toggleIntolerance(opt.value)}
              />
            ))}
          </View>
        </View>

        {/* Household */}
        <View style={styles.section}>
          <AppText variant="body">Household</AppText>

          <View style={styles.counterRow}>
            <Pressable
              onPress={() => setHousehold((h) => Math.max(1, h - 1))}
              style={styles.counterBtn}
            >
              <AppText>−</AppText>
            </Pressable>

            <AppText>{household}</AppText>

            <Pressable
              onPress={() => setHousehold((h) => Math.min(12, h + 1))}
              style={styles.counterBtn}
            >
              <AppText>+</AppText>
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            title={isSaving ? 'Saving...' : 'Save Changes'}
            onPress={saveProfile}
            disabled={isSaving}
          />

          {isSaving && <ActivityIndicator />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.porcelain },
  content: { padding: 20, gap: 20 },

  section: { gap: 10 },

  preview: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  emoji: {
    fontSize: 48,
  },

  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatarBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.porcelain_shadow,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.porcelain_shadow,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  counterBtn: {
    padding: 10,
    backgroundColor: COLORS.porcelain_shadow,
    borderRadius: 10,
  },

  selected: {
    borderWidth: 2,
    borderColor: COLORS.royal_gold,
  },

  footer: {
    marginTop: 20,
  },
});