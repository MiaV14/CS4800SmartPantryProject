type OpenFoodFactsProductResponse = {
  status?: number;
  status_verbose?: string;
  product?: {
    product_name?: string;
    brands?: string;
    quantity?: string;
    image_url?: string;
    categories?: string;
  };
};

export type BarcodeLookupResult = {
  barcode: string;
  name: string;
  brand?: string;
  quantityText?: string;
  imageUrl?: string;
  categoryText?: string;
  parsedQuantity?: string;
  parsedUnit?: string;
};

function normalizeUnit(rawUnit: string): string {
  const normalized = rawUnit.trim().toLowerCase();

  if (
    normalized === 'count' ||
    normalized === 'ct' ||
    normalized === 'pack' ||
    normalized === 'packs' ||
    normalized === 'bottle' ||
    normalized === 'bottles' ||
    normalized === 'can' ||
    normalized === 'cans' ||
    normalized === 'piece' ||
    normalized === 'pieces'
  ) {
    return 'ct';
  }

  if (normalized === 'fl oz' || normalized === 'fluid ounce' || normalized === 'fluid ounces') {
    return 'fl oz';
  }

  if (normalized === 'oz') return 'oz';
  if (normalized === 'ml') return 'mL';
  if (normalized === 'l') return 'L';
  if (normalized === 'g') return 'g';
  if (normalized === 'kg') return 'kg';
  if (normalized === 'lb' || normalized === 'lbs') return 'lb';

  return rawUnit.trim();
}

function parseQuantityText(quantityText?: string): {
  parsedQuantity?: string;
  parsedUnit?: string;
} {
  if (!quantityText) {
    return {};
  }

  const cleaned = quantityText.trim();

  if (!cleaned) {
    return {};
  }

  // For Multipack formats like:
  // "5 x 2.7 FL OZ (80 ml)"
  // "12x355 mL"
  // "4 X 100 g"
  const multipackMatch = cleaned.match(/^(\d+(?:[.,]\d+)?)\s*[xX]\s*(.+)$/);

  if (multipackMatch) {
    const packCount = multipackMatch[1].replace(',', '.');

    return {
      parsedQuantity: packCount,
      parsedUnit: 'ct',
    };
  }

  // Count-style formats like:
  // "8 count"
  // "6 bottles"
  // "12 cans"
  const countMatch = cleaned.match(
    /^(\d+(?:[.,]\d+)?)\s*(count|ct|pack|packs|bottle|bottles|can|cans|piece|pieces)$/i
  );

  if (countMatch) {
    return {
      parsedQuantity: countMatch[1].replace(',', '.'),
      parsedUnit: 'ct',
    };
  }

  // Standard formats like:
  // "12 oz"
  // "355 mL"
  // "1 L"
  const standardMatch = cleaned.match(/^(\d+(?:[.,]\d+)?)\s*([a-zA-Z ]+)$/);

  if (standardMatch) {
    return {
      parsedQuantity: standardMatch[1].replace(',', '.'),
      parsedUnit: normalizeUnit(standardMatch[2]),
    };
  }

  return {};
}

export async function lookupBarcode(
  barcode: string
): Promise<BarcodeLookupResult> {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
  );

  if (!response.ok) {
    throw new Error('Failed to look up barcode.');
  }

  const data = (await response.json()) as OpenFoodFactsProductResponse;

  if (data.status !== 1 || !data.product?.product_name) {
    throw new Error('Product not found.');
  }

  const quantityText = data.product.quantity;
  const parsed = parseQuantityText(quantityText);

  return {
    barcode,
    name: data.product.product_name,
    brand: data.product.brands,
    quantityText,
    imageUrl: data.product.image_url,
    categoryText: data.product.categories,
    parsedQuantity: parsed.parsedQuantity,
    parsedUnit: parsed.parsedUnit,
  };
}