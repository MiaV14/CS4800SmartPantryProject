// (tabs) _index.tsx

import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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

const STORAGE_NAME_BY_ID: Record<string, string> = {
  'fridge-main': 'Fridge - Main',
  'fridge-freezer': 'Fridge - Freezer',
  pantry: 'Pantry',
  seasonings: 'Seasonings',
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export default function HomeScreen() {
  const router = useRouter();
  const { items, isLoading } = useFoodItems();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredItems = useMemo(() => {
    const query = normalize(searchQuery);

    if (!query) return [];

    return items.filter((item) => {
      const storageName = STORAGE_NAME_BY_ID[item.storageId] ?? item.storageId;

      const searchableText = [
        item.name,
        item.category,
        storageName,
        item.storageId,
      ]
        .filter(Boolean)
        .map((value) => normalize(String(value)))
        .join(' ');

      return searchableText.includes(query);
    });
  }, [items, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <View style={styles.searchWrapper}>
          <SearchBar
            placeholder="Search items"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={COLORS.blue_spruce} />
          <AppText variant="caption" style={styles.loadingText}>
            Loading pantry...
          </AppText>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isSearching ? (
            <View style={styles.resultsSection}>
              <AppText variant="sectionTitle">Matching Items</AppText>

              {filteredItems.length > 0 ? (
                <View style={styles.resultsList}>
                  {filteredItems.map((item) => {
                    const status = getExpiryStatus(item.expirationDate);
                    const storageName =
                      STORAGE_NAME_BY_ID[item.storageId] ?? item.storageId;

                    return (
                      <Pressable
                        key={item.id}
                        style={styles.resultCard}
                        onPress={() =>
                          router.push({
                            pathname: '/storage/[storageId]',
                            params: { storageId: item.storageId },
                          })
                        }
                      >
                        <View style={styles.resultTopRow}>
                          <AppText variant="cardTitle" style={styles.resultTitle}>
                            {item.name}
                          </AppText>

                          <View
                            style={[
                              styles.statusPill,
                              status === 'expired'
                                ? styles.expiredPill
                                : status === 'expiring'
                                ? styles.expiringPill
                                : styles.freshPill,
                            ]}
                          >
                            <AppText
                              variant="caption"
                              style={[
                                styles.statusText,
                                status === 'expired'
                                  ? styles.expiredText
                                  : status === 'expiring'
                                  ? styles.expiringText
                                  : styles.freshText,
                              ]}
                            >
                              {status === 'expired'
                                ? 'Expired'
                                : status === 'expiring'
                                ? 'Expiring'
                                : 'Fresh'}
                            </AppText>
                          </View>
                        </View>

                        <AppText variant="caption" style={styles.resultMeta}>
                          {item.quantity} {item.unit} • {item.category || 'Other'} •{' '}
                          {storageName}
                        </AppText>

                        <AppText variant="caption" style={styles.resultMeta}>
                          Expires: {item.expirationDate || 'No date'}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.emptySearchState}>
                  <AppText variant="cardTitle">No matching items found</AppText>
                  <AppText variant="caption" style={styles.emptySearchText}>
                    Try searching by item name, category, or storage location.
                  </AppText>
                </View>
              )}
            </View>
          ) : (
            <>
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
            </>
          )}
        </ScrollView>
      )}
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
  },
  searchWrapper: {
    width: '100%',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  loadingText: {
    color: COLORS.input_text,
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
  resultsSection: {
    gap: 12,
  },
  resultsList: {
    gap: 10,
  },
  resultCard: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 18,
    padding: 14,
    gap: 6,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
  },
  resultTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  resultTitle: {
    flex: 1,
    color: COLORS.blue_spruce_shadow,
  },
  resultMeta: {
    color: COLORS.input_text,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  statusText: {
    fontSize: 12,
  },
  freshPill: {
    backgroundColor: COLORS.porcelain,
    borderColor: COLORS.mint_leaf,
  },
  freshText: {
    color: COLORS.mint_leaf,
  },
  expiringPill: {
    backgroundColor: COLORS.royal_gold,
    borderColor: COLORS.royal_gold_shadow,
  },
  expiringText: {
    color: COLORS.royal_gold_shadow,
  },
  expiredPill: {
    backgroundColor: COLORS.vibrant_coral,
    borderColor: COLORS.flag_red,
  },
  expiredText: {
    color: COLORS.porcelain,
  },
  emptySearchState: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 18,
    padding: 18,
    gap: 6,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
  },
  emptySearchText: {
    color: COLORS.input_text,
  },
});