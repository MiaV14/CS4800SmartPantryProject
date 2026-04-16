import AppText from '@/components/ui/AppText';
import { StyleSheet, View } from 'react-native';

type FormLabelProps = {
  label: string;
  required?: boolean;
};

export default function FormLabel({
  label,
  required = false,
}: FormLabelProps) {
  return (
    <View style={styles.row}>
      <AppText variant="inputLabel">{label}</AppText>

      {required ? (
        <AppText style={styles.required}>*</AppText>
      ) : (
        <AppText style={styles.optional}>(Optional)</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  required: {
    color: '#D72638',
    fontFamily: 'Poppins_500Medium',
  },
  optional: {
    color: '#889A8E',
    fontSize: 12,
  },
});