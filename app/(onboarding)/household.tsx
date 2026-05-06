// app/(onboarding)/household.tsx

import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HouseholdScreen() {
  const { avatar, diet, intolerances } = useLocalSearchParams<{
    avatar?: string;
    diet?: string;
    intolerances?: string;
  }>();

  const [householdSize, setHouseholdSize] = useState(1);

  const decrease = () => {
    setHouseholdSize((current) => Math.max(1, current - 1));
  };

  const increase = () => {
    setHouseholdSize((current) => Math.min(12, current + 1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header step={3} />

        <View style={styles.section}>
          <AppText variant="sectionTitle">Household size</AppText>
          <AppText variant="caption" style={styles.helperText}>
            We’ll use this to estimate recipe servings.
          </AppText>

          <View style={styles.counterRow}>
            <Pressable onPress={decrease} style={styles.counterButton}>
              <AppText style={styles.counterButtonText}>−</AppText>
            </Pressable>

            <View style={styles.counterValueBox}>
              <AppText style={styles.counterValue}>{householdSize}</AppText>
              <AppText variant="caption" style={styles.counterLabel}>
                {householdSize === 1 ? '1 person' : `${householdSize} people`}
              </AppText>
            </View>

            <Pressable onPress={increase} style={styles.counterButton}>
              <AppText style={styles.counterButtonText}>+</AppText>
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Continue →"
            onPress={() =>
              router.push({
                pathname: '/(onboarding)/profile-picture',
                params: {
                  diet: diet ?? '',
                  intolerances: intolerances ?? '',
                  householdSize: String(householdSize),
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
  counterRow: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
  },
  counterButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.porcelain_shadow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 30,
    color: COLORS.blue_spruce,
    fontFamily: 'Montserrat_700Bold',
  },
  counterValueBox: {
    alignItems: 'center',
    minWidth: 72,
  },
  counterValue: {
    fontSize: 48,
    color: COLORS.blue_spruce,
    fontFamily: 'Montserrat_700Bold',
  },
  counterLabel: {
    color: COLORS.mint_leaf,
    marginTop: 2,
  },
  footer: {
    marginTop: 42,
    gap: 12,
  },
  backButton: {
    marginTop: 4,
  },
});