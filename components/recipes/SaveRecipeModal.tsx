import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import BottomSheetModal from '@/components/modals/BottomSheetModal';
import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { useRecipeCollections } from '@/context/RecipeCollectionsContext';
import { SaveRecipeInput } from '@/types/recipes';

type SaveRecipeModalProps = {
  visible: boolean;
  recipe: SaveRecipeInput | null;
  onClose: () => void;
};

export default function SaveRecipeModal({
  visible,
  recipe,
  onClose,
}: SaveRecipeModalProps) {
  const { collections, addCollection, saveRecipe, getCollectionCount } =
    useRecipeCollections();

  const [newCollectionName, setNewCollectionName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (collectionId: string) => {
    if (!recipe) return;

    try {
      setIsSaving(true);
      await saveRecipe(collectionId, recipe);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCollection = async () => {
    const trimmedName = newCollectionName.trim();
    if (!trimmedName) return;

    try {
      setIsSaving(true);
      await addCollection(trimmedName);
      setNewCollectionName('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <AppText variant="sectionTitle">Save Recipe</AppText>

        {recipe ? (
          <AppText variant="caption" style={styles.subtitle}>
            Choose a collection for {recipe.title}
          </AppText>
        ) : null}

        <ScrollView
          style={styles.collectionList}
          contentContainerStyle={styles.collectionContent}
          showsVerticalScrollIndicator={false}
        >
          {collections.map((collection) => (
            <Pressable
              key={collection.id}
              style={styles.collectionRow}
              onPress={() => handleSave(collection.id)}
              disabled={isSaving}
            >
              <View>
                <AppText variant="cardTitle" style={styles.collectionName}>
                  {collection.name}
                </AppText>

                <AppText variant="caption" style={styles.collectionCount}>
                  {getCollectionCount(collection.id)} saved
                </AppText>
              </View>

              <AppText variant="caption" style={styles.saveText}>
                Save
              </AppText>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.createSection}>
          <AppInput
            label="New Collection"
            placeholder="Favorites, To Try, Meal Prep..."
            value={newCollectionName}
            onChangeText={setNewCollectionName}
          />

          <AppButton
            title="Create Collection"
            variant="secondary"
            onPress={handleCreateCollection}
            disabled={isSaving || !newCollectionName.trim()}
          />
        </View>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    maxHeight: 560,
  },
  subtitle: {
    color: COLORS.input_text,
  },
  collectionList: {
    maxHeight: 260,
  },
  collectionContent: {
    gap: 10,
  },
  collectionRow: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
  },
  collectionName: {
    color: COLORS.blue_spruce_shadow,
  },
  collectionCount: {
    color: COLORS.input_text,
    marginTop: 2,
  },
  saveText: {
    color: COLORS.mint_leaf,
  },
  createSection: {
    gap: 10,
  },
});