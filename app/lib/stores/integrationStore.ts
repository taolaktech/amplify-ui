import { create } from "zustand";
import { persist } from "zustand/middleware";

type IntegrationState = {
  shopifyStore: boolean;
  google: boolean;
  instagram: boolean;
  facebook: boolean;
};

type IntegrationActions = {
  toggleShopifyStore: () => void;
  setShopifyStoreConnected: (value: boolean) => void;
  toggleGoogle: () => void;
  toggleInstagram: () => void;
  toggleFacebook: () => void;
  setInstagram: (value: boolean) => void;
  setFacebook: (value: boolean) => void;
  resetStore: () => void;
};

type IntegrationStore = IntegrationState & {
  actions: IntegrationActions;
};

const initialState: IntegrationState = {
  shopifyStore: false,
  google: false,
  instagram: false,
  facebook: false,
};

export const useIntegrationStore = create<IntegrationStore>()(
  persist(
    (set) => ({
      ...initialState,
      actions: {
        resetStore: () => set(() => initialState),
        toggleShopifyStore: () => {
          set((state) => ({
            shopifyStore: !state.shopifyStore,
          }));
        },
        setShopifyStoreConnected: (value: boolean) => {
          set(() => ({
            shopifyStore: value,
          }));
        },
        toggleGoogle: () => {
          set((state) => ({
            google: !state.google,
          }));
        },
        toggleInstagram: () => {
          set((state) => ({
            instagram: !state.instagram,
          }));
        },
        setInstagram: (value: boolean) => {
          set(() => ({
            instagram: value,
          }));
        },
        setFacebook: (value: boolean) => {
          console.log("setting fb:", value);
          set(() => ({
            facebook: value,
          }));
        },
        toggleFacebook: () => {
          set((state) => ({
            facebook: !state.facebook,
          }));
        },
      },
    }),
    {
      name: "integration-storage",
      partialize: (state) => ({
        shopifyStore: state.shopifyStore,
        google: state.google,
        instagram: state.instagram,
        facebook: state.facebook,
      }),
    }
  )
);
