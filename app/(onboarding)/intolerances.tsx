// app/(onboarding)/intolerances.tsx

import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';
import FilterChip from '@/components/ui/FilterChip';
import { COLORS } from '@/constants/colors';
import { INTOLERANCE_OPTIONS } from '@/constants/onboardingOptions';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IntolerancesScreen() {
  const { avatar, diet } = useLocalSearchParams<{
    avatar?: string;
    diet?: string;
  }>();

  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([]);

  const toggleIntolerance = (value: string) => {
    setSelectedIntolerances((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header step={2} />

        <View style={styles.section}>
          <AppText variant="sectionTitle">Allergies & intolerances</AppText>
          <AppText variant="caption" style={styles.helperText}>
            Select any restrictions that apply.
          </AppText>

          <View style={styles.chipList}>
            {INTOLERANCE_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={selectedIntolerances.includes(option.value)}
                onPress={() => toggleIntolerance(option.value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Continue →"
            onPress={() =>
              router.push({
                pathname: '/(onboarding)/household',
                params: {
                  diet: diet ?? '',
                  intolerances: selectedIntolerances.join(','),
                },
              })
            }
          />

          <AppButton
            title="← Back"
            variant="secondary"
            style={styles.backButton}
            onPress={() => router.back()}
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
  },
  helperText: {
    marginTop: 6,
    color: COLORS.mint_leaf,
  },
  chipList: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  footer: {
    marginTop: 32,
    gap: 12,
  },
  backButton: {
    marginTop: 4,
  },
});