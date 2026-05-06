import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { DIET_OPTIONS } from '@/constants/onboardingOptions';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DietaryPreferenceScreen() {
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header step={1} />

        <View style={styles.section}>
          <AppText variant="sectionTitle">Dietary preference</AppText>
          <AppText variant="caption" style={styles.helperText}>
            We’ll use this to suggest the best recipes.
          </AppText>

          <View style={styles.grid}>
            {DIET_OPTIONS.map((option) => {
              const selected = selectedDiet === option.value;

              return (
                <Pressable
                  key={option.label}
                  onPress={() => setSelectedDiet(option.value)}
                  style={[styles.card, selected && styles.cardSelected]}
                >
                  <AppText style={styles.cardIcon}>{option.icon}</AppText>
                  <AppText variant="cardTitle" style={styles.cardLabel}>
                    {option.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Continue →"
            onPress={() =>
              router.push({
                pathname: '/(onboarding)/intolerances',
                params: { diet: selectedDiet ?? '' },
              })
            }
          />
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
  container: { flex: 1, backgroundColor: COLORS.porcelain },
  content: { padding: 24, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 16, marginBottom: 20 },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.royal_gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoIcon: { fontSize: 30 },
  title: { color: COLORS.blue_spruce, textAlign: 'center' },
  subtitle: { marginTop: 4, color: COLORS.mint_leaf, textAlign: 'center' },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.porcelain_shadow,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.royal_gold },
  stepText: { marginTop: 8, color: COLORS.mint_leaf },
  section: { marginTop: 24 },
  helperText: { marginTop: 6, color: COLORS.mint_leaf },
  grid: { marginTop: 18, flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: {
    width: '47%',
    minHeight: 98,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.porcelain_shadow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  cardSelected: {
    borderColor: COLORS.royal_gold,
    backgroundColor: COLORS.porcelain_shadow,
  },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardLabel: { color: COLORS.blue_spruce, textAlign: 'center' },
  footer: { marginTop: 32 },
});