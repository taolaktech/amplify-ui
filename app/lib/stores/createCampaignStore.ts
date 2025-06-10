import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CreateCampaignState {
  adsShow: {
    location: string[];
    complete: boolean;
  };
  productSelection: {
    products: any[];
    complete: boolean;
  };
  supportedAdPlatforms: SupportedAdPlatforms & { complete: boolean };
}

interface SupportedAdPlatforms {
  facebook: boolean;
  instagram: boolean;
  google: boolean;
}

interface CreateCampaignActions {
  storeAdsShow: (adsShow: { location: string[]; complete: boolean }) => void;
  storeProductSelection: (productSelection: {
    products: any[];
    complete: boolean;
  }) => void;
  toggleAdsPlatform: (platform: keyof SupportedAdPlatforms) => void;
  completeAdsPlatform: () => void;
  reset: () => void;
}

interface CreateCampaignStore extends CreateCampaignState {
  actions: CreateCampaignActions;
}

const initialState: CreateCampaignState = {
  adsShow: {
    location: [],
    complete: false,
  },
  productSelection: {
    products: [],
    complete: false,
  },
  supportedAdPlatforms: {
    facebook: false,
    instagram: false,
    google: true,
    complete: true,
  },
};

export const useCreateCampaignStore = create<CreateCampaignStore>()(
  persist(
    (set) => ({
      ...initialState,
      actions: {
        storeAdsShow: (adsShow) => {
          set((state) => ({
            adsShow: { ...state.adsShow, ...adsShow },
          }));
        },
        storeProductSelection: (productSelection) => {
          set((state) => ({
            productSelection: {
              ...state.productSelection,
              ...productSelection,
            },
          }));
        },
        toggleAdsPlatform: (platform: keyof SupportedAdPlatforms) => {
          set((state) => ({
            supportedAdPlatforms: {
              ...state.supportedAdPlatforms,
              [platform]: !state.supportedAdPlatforms[platform],
            },
          }));
        },
        completeAdsPlatform: () => {
          set((state) => ({
            supportedAdPlatforms: {
              ...state.supportedAdPlatforms,
              complete: true,
            },
          }));
        },
        reset: () => {
          set(initialState);
        },
      },
    }),
    {
      name: "create-campaign-storage",
      partialize: (state) => ({
        adsShow: state.adsShow,
        productSelection: state.productSelection,
      }),
    }
  )
);
