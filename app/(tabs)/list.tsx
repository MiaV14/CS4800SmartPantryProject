import { COLORS } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export default function ListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery List</Text>
      <Text style={styles.text}>Your shopping list items will go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.porcelain,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.blue_spruce,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: COLORS.input_text,
  },
});