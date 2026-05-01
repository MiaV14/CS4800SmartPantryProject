import { useAddItemDraft } from '@/context/AddItemDraftContext';
import {
  inferCategory,
  suggestTrackingMode,
} from '@/services/barcodeClassification';
import { lookupBarcode } from '@/services/barcodeLookupService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';

import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';
import BackButton from '@/components/ui/BackButton';
import { COLORS } from '@/constants/colors';


export default function BarcodeScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const { setDraft } = useAddItemDraft();

  const handleBarcodeScanned = async ({
    data,
  }: {
    data: string;
    type: string;
  }) => {
    if (hasScanned || isLookingUp) return;

    setHasScanned(true);
    setIsLookingUp(true);

    try {
      const result = await lookupBarcode(data);

      const inferredCategory = inferCategory(
        result.name,
        result.categoryText,
        result.brand
      );

      const suggestedTrackingMode = suggestTrackingMode(
        result.name,
        inferredCategory
      );

      setDraft({
        name: result.name,
        quantity:
          suggestedTrackingMode === 'fill'
            ? '100'
            : result.parsedQuantity ?? suggestedTrackingMode === 'count'
            ? '1'
            : '',
        unit:
          suggestedTrackingMode === 'fill'
            ? '%'
            : suggestedTrackingMode === 'count'
            ? 'ct'
            : result.parsedUnit ?? '',
        expirationDate: '',
        category: inferredCategory,
        storageLocation: '',
        trackingMode: suggestedTrackingMode,
      });

      router.back();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to process barcode.';

      Alert.alert('Barcode lookup failed', message, [
        {
          text: 'Scan Again',
          onPress: () => {
            setHasScanned(false);
            setIsLookingUp(false);
          },
        },
        {
          text: 'Go Back',
          onPress: () => router.back(),
        },
      ]);
      return;
    }

    setIsLookingUp(false);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <AppText variant="caption">Loading camera permission...</AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerOverlay}>
          <BackButton onPress={() => router.back()} />
        </View>

        <View style={styles.centerContent}>
          <AppText variant="sectionTitle">Camera access needed</AppText>
          <AppText variant="caption" style={styles.permissionText}>
            Allow camera access to scan product barcodes.
          </AppText>

          <AppButton
            title="Allow Camera"
            onPress={requestPermission}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerOverlay}>
        <BackButton onPress={() => router.back()} />
      </View>

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={hasScanned || isLookingUp ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
      />

      <View style={styles.footerOverlay}>
        <AppText variant="caption" style={styles.scanText}>
          {isLookingUp
            ? 'Looking up product...'
            : 'Align the barcode inside the camera view.'}
        </AppText>

        {hasScanned && !isLookingUp ? (
          <AppButton
            title="Scan Again"
            onPress={() => setHasScanned(false)}
            variant="secondary"
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blue_spruce,
  },
  camera: {
    flex: 1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
  },
  footerOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    backgroundColor: COLORS.honeydew,
  },
  permissionText: {
    textAlign: 'center',
    color: COLORS.input_text,
  },
  scanText: {
    color: COLORS.porcelain,
    textAlign: 'center',
  },
});