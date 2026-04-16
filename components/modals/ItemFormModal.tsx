import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import BottomSheetModal from '@/components/modals/BottomSheetModal';
import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import AppSelect from '@/components/ui/AppSelect';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';

type PickerType = 'unit' | 'category' | 'storage' | null;

export type ItemFormValues = {
  name: string;
  quantity: string;
  unit: string;
  expirationDate: string;
  category: string;
  storageLocation: string;
};

type ItemFormModalProps = {
  visible: boolean;
  mode: 'add' | 'edit';
  initialValues: ItemFormValues;
  onClose: () => void;
  onSubmit: (values: ItemFormValues) => void;
  hideStorageField?: boolean;
  lockedStorageLocation?: string;
  onDelete?: () => void;
};

const UNIT_OPTIONS = [
  'count',
  'oz',
  'lb',
  'g',
  'kg',
  'tsp',
  'tbsp',
  'cup',
  'ml',
  'l',
];

const CATEGORY_OPTIONS = [
  'Produce',
  'Meat',
  'Seafood',
  'Dairy',
  'Grain',
  'Seasoning',
  'Frozen',
  'Condiment',
  'Snack',
  'Beverage',
  'Other',
];

const STORAGE_OPTIONS = [
  'Fridge - Main',
  'Fridge - Freezer',
  'Pantry',
  'Seasonings',
];

function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${month}/${day}/${year}`;
}

export default function ItemFormModal({
  visible,
  mode,
  initialValues,
  onClose,
  onSubmit,
  hideStorageField = false,
  lockedStorageLocation,
  onDelete,
}: ItemFormModalProps) {
  const [itemName, setItemName] = useState(initialValues.name);
  const [quantity, setQuantity] = useState(initialValues.quantity);
  const [unit, setUnit] = useState(initialValues.unit);
  const [expirationDate, setExpirationDate] = useState(
    initialValues.expirationDate
  );
  const [category, setCategory] = useState(initialValues.category);
  const [storageLocation, setStorageLocation] = useState(
    lockedStorageLocation ?? initialValues.storageLocation
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerType>(null);

  useEffect(() => {
    if (visible) {
      setItemName(initialValues.name);
      setQuantity(initialValues.quantity);
      setUnit(initialValues.unit);
      setExpirationDate(initialValues.expirationDate);
      setCategory(initialValues.category);
      setStorageLocation(lockedStorageLocation ?? initialValues.storageLocation);
    }
  }, [visible, initialValues, lockedStorageLocation]);

  const pickerTitle = useMemo(() => {
    if (activePicker === 'unit') return 'Select Unit';
    if (activePicker === 'category') return 'Select Category';
    if (activePicker === 'storage') return 'Select Storage Location';
    return '';
  }, [activePicker]);

  const pickerOptions = useMemo(() => {
    if (activePicker === 'unit') return UNIT_OPTIONS;
    if (activePicker === 'category') return CATEGORY_OPTIONS;
    if (activePicker === 'storage') return STORAGE_OPTIONS;
    return [];
  }, [activePicker]);

  const handleQuantityChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    setQuantity(cleaned);
  };

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setExpirationDate(formatDate(selectedDate));
    }
  };

  const handleSelectOption = (option: string) => {
    if (activePicker === 'unit') {
      setUnit(option);
    } else if (activePicker === 'category') {
      setCategory(option);
    } else if (activePicker === 'storage') {
      setStorageLocation(option);
    }

    setActivePicker(null);
  };

  const handleSubmit = () => {
    const resolvedStorageLocation =
      lockedStorageLocation ?? storageLocation;

    if (!itemName.trim()) {
      Alert.alert('Missing field', 'Please enter an item name.');
      return;
    }

    if (!quantity.trim()) {
      Alert.alert('Missing field', 'Please enter a quantity.');
      return;
    }

    if (!expirationDate.trim()) {
      Alert.alert('Missing field', 'Please choose an expiration date.');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Missing field', 'Please choose a category.');
      return;
    }

    if (!resolvedStorageLocation.trim()) {
      Alert.alert('Missing field', 'Please choose a storage location.');
      return;
    }

    onSubmit({
      name: itemName,
      quantity,
      unit,
      expirationDate,
      category,
      storageLocation: resolvedStorageLocation,
    });
  };

  return (
    <>
      <BottomSheetModal visible={visible} onClose={onClose}>
        <View style={styles.modalContent}>
          <AppText variant="sectionTitle" style={styles.modalTitle}>
            {mode === 'add' ? 'Add Item' : 'Edit Item'}
          </AppText>

          <View style={styles.formGroup}>
            <AppInput
              label="Name"
              placeholder="Enter item name"
              value={itemName}
              onChangeText={setItemName}
              required
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <AppInput
                  label="Quantity"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                  required
                />
              </View>

              <View style={styles.halfWidth}>
                <AppSelect
                  label="Unit"
                  placeholder="Select unit"
                  value={unit}
                  onPress={() => setActivePicker('unit')}
                />
              </View>
            </View>

            <AppSelect
              label="Expiration Date"
              placeholder="MM/DD/YYYY"
              value={expirationDate}
              onPress={() => setShowDatePicker(true)}
              required
            />

            <AppSelect
              label="Category"
              placeholder="Select category"
              value={category}
              onPress={() => setActivePicker('category')}
              required
            />

            {!hideStorageField ? (
              <AppSelect
                label="Storage Location"
                placeholder="Select location"
                value={storageLocation}
                onPress={() => setActivePicker('storage')}
                required
              />
            ) : (
              <AppText variant="caption">
                This item will be added to {lockedStorageLocation}.
              </AppText>
            )}

            <AppText variant="caption">
              Unit is optional. Expiration date can be estimated.
            </AppText>
          </View>

          <View style={styles.formButtonRow}>
            <View style={styles.formButton}>
              <AppButton
                title="Cancel"
                onPress={onClose}
                variant="secondary"
              />
            </View>

            <View style={styles.formButton}>
              <AppButton
                title={mode === 'add' ? 'Add' : 'Save'}
                onPress={handleSubmit}
                variant="primary"
              />
            </View>
          </View>

          {mode === 'edit' && onDelete ? (
            <AppButton
              title="Delete Item"
              onPress={onDelete}
              style={styles.deleteButton}
              textStyle={styles.deleteText}
            />
          ) : null}
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        visible={activePicker !== null}
        onClose={() => setActivePicker(null)}
      >
        <View style={styles.modalContent}>
          <AppText variant="sectionTitle" style={styles.modalTitle}>
            {pickerTitle}
          </AppText>

          <View style={styles.optionList}>
            {pickerOptions.map((option) => (
              <AppButton
                key={option}
                title={option}
                onPress={() => handleSelectOption(option)}
                variant="secondary"
              />
            ))}
          </View>
        </View>
      </BottomSheetModal>

      {showDatePicker ? (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    gap: 12,
    paddingBottom: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  formGroup: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  formButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
  },
  optionList: {
    gap: 10,
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: COLORS.vibrant_coral,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.flag_red,
  },
  deleteText: {
    color: 'white',
    fontFamily: 'Poppins_500Medium',
  },
});