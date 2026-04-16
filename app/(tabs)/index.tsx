import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppText from '@/components/ui/AppText';
import OverviewCard from '@/components/ui/OverviewCard';
import SearchBar from '@/components/ui/SearchBar';
import StorageCard from '@/components/ui/StorageCard';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useFoodItems } from '@/context/FoodItemsContext';
import { getExpiryStatus } from '@/utils/expiry';

const STORAGE_CONFIG = [
  {
    id: 'fridge-main',
    name: 'Fridge - Main',
  },
  {
    id: 'fridge-freezer',
    name: 'Fridge - Freezer',
  },
  {
    id: 'pantry',
    name: 'Pantry',
  },
  {
    id: 'seasonings',
    name: 'Seasonings',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { items } = useFoodItems();
  const { user, logout } = useAuth();

  const storageSummaries = useMemo(() => {
    return STORAGE_CONFIG.map((storage) => {
      const storageItems = items.filter((item) => item.storageId === storage.id);

      const expiringCount = storageItems.filter(
        (item) => getExpiryStatus(item.expirationDate) === 'expiring'
      ).length;

      return {
        ...storage,
        itemCount: storageItems.length,
        expiringCount,
      };
    });
  }, [items]);

  const totalItemCount = useMemo(() => items.length, [items]);

  const expiringSoonCount = useMemo(() => {
    return items.filter(
      (item) => getExpiryStatus(item.expirationDate) === 'expiring'
    ).length;
  }, [items]);

  const expiredCount = useMemo(() => {
    return items.filter(
      (item) => getExpiryStatus(item.expirationDate) === 'expired'
    ).length;
  }, [items]);

  const firstName = useMemo(() => {
    if (!user?.email) return 'User';
    return user.email.split('@')[0];
  }, [user]);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <View style={styles.searchWrapper}>
          <SearchBar placeholder="Search items" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <AppText variant="heroGreeting" style={styles.bannerGreeting}>
            Good morning, {firstName}!
          </AppText>

          <AppText variant="heroTitle">What’s for Breakfast?</AppText>
        </View>

        <View style={styles.overviewSection}>
          <AppText variant="sectionTitle">Overview</AppText>

          <View style={styles.overviewRow}>
            <OverviewCard label="Total" count={totalItemCount} />
            <OverviewCard label="Expiring Soon" count={expiringSoonCount} />
            <OverviewCard label="Expired" count={expiredCount} />
          </View>
        </View>

        <View style={styles.storageSection}>
          <AppText variant="sectionTitle">Storage</AppText>

          <View style={styles.storageContainer}>
            {storageSummaries.map((storage) => (
              <StorageCard
                key={storage.id}
                name={storage.name}
                itemCount={storage.itemCount}
                expiringCount={storage.expiringCount}
                onPress={() =>
                  router.push({
                    pathname: '/storage/[storageId]',
                    params: { storageId: storage.id },
                  })
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 10,
  },
  searchWrapper: {
    width: '100%',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.mint_leaf,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.blue_spruce,
  },
  logoutText: {
    color: COLORS.blue_spruce,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
    paddingBottom: 24,
  },
  banner: {
    backgroundColor: COLORS.mint_leaf,
    borderRadius: 18,
    padding: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.blue_spruce,
  },
  bannerGreeting: {
    marginBottom: 6,
  },
  overviewSection: {
    gap: 8,
  },
  storageSection: {
    gap: 8,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 8,
  },
  storageContainer: {
    gap: 8,
  },
});