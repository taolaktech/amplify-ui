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
  campaignSnapshots: CampaignSnapshots & { complete: boolean };
}

interface CampaignSnapshots {
  campaignType: string;
  brandColor: string;
  accentColor: string;
  campaignStartDate: string;
  campaignEndDate: string;
}

interface SupportedAdPlatforms {
  Facebook: boolean;
  Instagram: boolean;
  Google: boolean;
}

interface CreateCampaignActions {
  storeAdsShow: (adsShow: { location: string[]; complete: boolean }) => void;
  storeProductSelection: (productSelection: {
    products: any[];
    complete: boolean;
  }) => void;
  toggleAdsPlatform: (platform: keyof SupportedAdPlatforms) => void;
  completeAdsPlatform: () => void;
  storeCampaignSnapshots: (campaignSnapshots: CampaignSnapshots) => void;
  completeCampaignSnapshots: () => void;
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
    Facebook: false,
    Instagram: false,
    Google: true,
    complete: true,
  },
  campaignSnapshots: {
    campaignType: "",
    brandColor: "",
    accentColor: "",
    campaignStartDate: "",
    campaignEndDate: "",
    complete: false,
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
        storeCampaignSnapshots: (campaignSnapshots) => {
          set((state) => ({
            campaignSnapshots: {
              ...state.campaignSnapshots,
              ...campaignSnapshots,
            },
          }));
        },
        completeCampaignSnapshots: () => {
          set((state) => ({
            campaignSnapshots: {
              ...state.campaignSnapshots,
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
        campaignSnapshots: state.campaignSnapshots,
      }),
    }
  )
);
