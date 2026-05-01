


// THIS IS A PLACEHOLDER, NOTHIGN HERE YET




import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';
import BackButton from '@/components/ui/BackButton';
import { COLORS } from '@/constants/colors';

export default function ReceiptScanScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={styles.content}>
        <AppText variant="sectionTitle">Scan Receipt</AppText>
        <AppText variant="caption" style={styles.text}>
          Receipt scanner screen placeholder.
        </AppText>

        <AppButton
          title="Go Back"
          onPress={() => router.back()}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  text: {
    textAlign: 'center',
    color: COLORS.input_text,
  },
});