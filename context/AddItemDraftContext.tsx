// We are creating the draft contxt for a scanned item

import React, { createContext, useContext, useMemo, useState } from 'react';

export type AddItemDraftValues = {
  name: string;
  quantity: string;
  unit: string;
  expirationDate: string;
  category: string;
  storageLocation: string;
  trackingMode: 'count' | 'amount' | 'fill';
};

type AddItemDraftContextType = {
  draft: AddItemDraftValues | null;
  setDraft: (values: AddItemDraftValues | null) => void;
  clearDraft: () => void;
};

const AddItemDraftContext = createContext<AddItemDraftContextType | undefined>(
  undefined
);

export function AddItemDraftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [draft, setDraftState] = useState<AddItemDraftValues | null>(null);

  const setDraft = (values: AddItemDraftValues | null) => {
    setDraftState(values);
  };

  const clearDraft = () => {
    setDraftState(null);
  };

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      clearDraft,
    }),
    [draft]
  );

  return (
    <AddItemDraftContext.Provider value={value}>
      {children}
    </AddItemDraftContext.Provider>
  );
}

export function useAddItemDraft() {
  const context = useContext(AddItemDraftContext);

  if (!context) {
    throw new Error('useAddItemDraft must be used within AddItemDraftProvider');
  }

  return context;
}