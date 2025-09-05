import { ShopifyProduct } from "@/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type cardDetails = {
  last4Numbers: string;
  cardBrand: string;
  id: string;
};

type CreateCampaignState = {
  adsShow: {
    location: string[];
    complete: boolean;
  };
  productSelection: {
    products: ShopifyProduct[];
    complete: boolean;
  };
  fundCampaign: {
    amount: number;
    cardDetails: cardDetails | null;
    complete: boolean;
  };
  instagramSettings: InstagramSettings;
  facebookSettings: FacebookSettings;
  googleSettings: GoogleSettings;
  supportedAdPlatforms: SupportedAdPlatforms & { complete: boolean };
  campaignSnapshots: CampaignSnapshots & { complete: boolean };
};

type CampaignSnapshots = {
  campaignType: string;
  brandColor: string;
  accentColor: string;
  campaignStartDate: string;
  campaignEndDate: string;
};

type SupportedAdPlatforms = {
  Facebook: boolean;
  Instagram: boolean;
  Google: boolean;
};

type InstagramSettings = Record<SocialSettingsKey, boolean>;

type FacebookSettings = Record<SocialSettingsKey, boolean>;

type GoogleSettings = {
  staticPost: boolean;
};

type CreateCampaignActions = {
  storeAdsShow: (adsShow: { location: string[]; complete: boolean }) => void;
  storeProductSelection: (productSelection: {
    products: ShopifyProduct[];
    complete: boolean;
  }) => void;
  storeFundCampaign: (fundCampaign: {
    amount?: number;
    cardDetails?: cardDetails | null;
    complete?: boolean;
  }) => void;
  storeSelectedPaymentMethod: (paymentMethod: cardDetails | null) => void;
  toggleAdsPlatform: (platform: keyof SupportedAdPlatforms) => void;
  completeAdsPlatform: () => void;
  storeCampaignSnapshots: (campaignSnapshots: CampaignSnapshots) => void;
  completeCampaignSnapshots: () => void;
  getLocationCountries: () => string[];
  toggleInstagramSettings: (setting: SocialSettingsKey) => void;
  toggleFacebookSettings: (setting: SocialSettingsKey) => void;
  reset: () => void;
};

type CreateCampaignStore = CreateCampaignState & {
  actions: CreateCampaignActions;
};

export type SocialSettingsKey = "staticPost" | "carouselPost" | "storyPost";

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

  fundCampaign: {
    amount: 50,
    cardDetails: null,
    complete: false,
  },
  campaignSnapshots: {
    campaignType: "Product Launch",
    brandColor: "",
    accentColor: "",
    campaignStartDate: new Date().toISOString().split("T")[0],
    campaignEndDate: new Date(new Date().setDate(new Date().getDate() + 30))
      .toISOString()
      .split("T")[0],
    complete: false,
  },
  instagramSettings: {
    staticPost: true,
    carouselPost: true,
    storyPost: true,
  },
  facebookSettings: {
    staticPost: true,
    carouselPost: true,
    storyPost: true,
  },
  googleSettings: {
    staticPost: true,
  },
};

export const useCreateCampaignStore = create<CreateCampaignStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      actions: {
        storeAdsShow: (adsShow) => {
          set((state) => ({
            adsShow: { ...state.adsShow, ...adsShow },
          }));
        },
        storeSelectedPaymentMethod: (paymentMethod) => {
          set((state) => ({
            fundCampaign: {
              ...state.fundCampaign,
              cardDetails: paymentMethod,
            },
          }));
        },
        getLocationCountries: () => {
          const countries: string[] = [];
          const locations = get().adsShow.location;
          locations.forEach((location) => {
            const country = location.trim().split(",")[2]?.trim();
            if (!countries.includes(country)) {
              countries.push(country);
            }
          });
          return countries;
        },
        toggleInstagramSettings: (setting: SocialSettingsKey) => {
          set((state) => ({
            instagramSettings: {
              ...state.instagramSettings,
              [setting]: !state.instagramSettings[setting],
            },
          }));
        },
        toggleFacebookSettings: (setting: keyof FacebookSettings) => {
          set((state) => ({
            facebookSettings: {
              ...state.facebookSettings,
              [setting]: !state.facebookSettings[setting],
            },
          }));
        },

        storeFundCampaign: (fundCampaign) => {
          set((state) => ({
            fundCampaign: { ...state.fundCampaign, ...fundCampaign },
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
        fundCampaign: state.fundCampaign,
        supportedAdPlatforms: state.supportedAdPlatforms,
        instagramSettings: state.instagramSettings,
        facebookSettings: state.facebookSettings,
        googleSettings: state.googleSettings,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Error rehydrating campaign store", error);
          return;
        }

        if (state) {
          // Mutate the state object directly
          state.adsShow.complete = false;
          state.productSelection.complete = false;
          state.fundCampaign.complete = false;
          state.campaignSnapshots.complete = false;
          state.supportedAdPlatforms.complete = false;
        }
      },
    }
  )
);
