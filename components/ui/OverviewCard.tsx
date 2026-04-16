import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { StyleSheet, View } from 'react-native';

type OverviewCardProps = {
  label: string;
  count: number;
};

export default function OverviewCard({ label, count }: OverviewCardProps) {
  return (
    <View style={styles.card}>
      <AppText variant="overviewCount" style={styles.count}>
        {count}
      </AppText>

      <AppText variant="overviewLabel" style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.porcelain,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#BEE3CD',
  },
  count: {
    marginBottom: 0,
  },
  label: {
    textAlign: 'center',
  },
});