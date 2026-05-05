// APP _layout.tsx
import { AddItemDraftProvider } from '@/context/AddItemDraftContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { FoodItemsProvider } from '@/context/FoodItemsContext';
import { GroceryListProvider } from "@/context/GroceryListContext";
import { RecipeCollectionsProvider } from '@/context/RecipeCollectionsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

import {
  Poppins_400Regular,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';

import { OleoScriptSwashCaps_400Regular } from '@expo-google-fonts/oleo-script-swash-caps';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="storage/[storageId]" />
        <Stack.Screen name="scan" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    OleoScriptSwashCaps_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <FoodItemsProvider>
        <GroceryListProvider>
          <RecipeCollectionsProvider>
            <AddItemDraftProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <RootNavigator />
                <StatusBar style="auto" />
              </ThemeProvider>
            </AddItemDraftProvider>
          </RecipeCollectionsProvider>
        </GroceryListProvider>
      </FoodItemsProvider>
    </AuthProvider>
  );
}