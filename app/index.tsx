import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Freshli.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFE8D5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 240,
    height: 100,
  },
});