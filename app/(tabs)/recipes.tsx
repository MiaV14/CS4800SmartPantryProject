import { COLORS } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export default function RecipesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <Text style={styles.text}>
        Recipe ideas based on your fridge items will go here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
    padding: 20,
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