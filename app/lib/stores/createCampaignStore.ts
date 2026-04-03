import { ShopifyProduct } from "@/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useCreativesStore from "@/app/lib/stores/creativesStore";
import { useMetaCreativeUploadStore } from "@/app/lib/stores/metaCreativeUploadStore";
import type { LaunchCampaignPayload } from "@/app/lib/api/base/campaigns";

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
  attachedAssets: {
    assets: Array<{
      assetId: string;
      type: "image" | "video";
      url: string;
      thumbnailUrl?: string;
      title?: string;
      headline?: string;
      bodyCopy?: string;
      caption?: string;
    }>;
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
  facebookSettings: FacebookSettings;
  googleSettings: GoogleSettings;
  supportedAdPlatforms: SupportedAdPlatforms & { complete: boolean };
  campaignSnapshots: CampaignSnapshots & { complete: boolean };
  adStyle: {
    presetType?: "video" | "image";
    templateId: string | null;
    imageTemplateIds: string[];
    imagePresets?: Array<{
      id: string;
      label?: string;
      mediaUrl?: string;
      thumbnailUrl?: string;
    }>;
    imageAssetIdsByPresetId?: Record<string, string>;
    selectedImagePresetIds?: string[];
    imageCopyByPresetId?: Record<string, string>;
    imageCaptionsByPresetId?: Record<string, string>;
    videoAssetId?: string | null;
    videoCaption?: string;
    videoScript?: string;
    includeMusic?: boolean;
    includeVoiceOver?: boolean;
    videoPreset: {
      id: string;
      title: string;
      videoUrl: string;
      thumbnailImageUrl?: string;
      duration?: number;
    } | null;
    generationId: string | null;
    mode: "standard" | "pro";
    complete: boolean;
  };
};

export type CampaignSnapshots = {
  campaignName: string;
  campaignType: string;
  brandColor: string;
  accentColor: string;
  destinationUrl: string;
  googleDailyBudget: string;
  metaDailyBudget: string;
  campaignStartDate: string;
  campaignEndDate: string;
  campaignPayload?: LaunchCampaignPayload;
};

type SupportedAdPlatforms = {
  Facebook: boolean;
  Google: boolean;
};

type FacebookSettings = Record<SocialSettingsKey, boolean>;

type GoogleSettings = {
  staticPost: boolean;
};

type CreateCampaignActions = {
  storeAdsShow: (adsShow: { location: string[]; complete: boolean }) => void;
  attachAssetsToDraft: (
    assets: Array<{
      assetId: string;
      type: "image" | "video";
      url: string;
      thumbnailUrl?: string;
      title?: string;
      headline?: string;
      bodyCopy?: string;
      caption?: string;
    }>,
  ) => void;
  clearAttachedAssets: () => void;
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
  setAdsPlatform: (
    platform: keyof SupportedAdPlatforms,
    value: boolean,
  ) => void;
  completeAdsPlatform: () => void;
  storeCampaignSnapshots: (campaignSnapshots: Record<string, any>) => void;
  completeCampaignSnapshots: () => void;
  storeAdStyle: (adStyle: {
    presetType?: "video" | "image";
    templateId?: string | null;
    imageTemplateIds?: string[];
    imagePresets?: Array<{
      id: string;
      label?: string;
      mediaUrl?: string;
      thumbnailUrl?: string;
    }>;
    imageAssetIdsByPresetId?: Record<string, string>;
    selectedImagePresetIds?: string[];
    imageCopyByPresetId?: Record<string, string>;
    imageCaptionsByPresetId?: Record<string, string>;
    videoAssetId?: string | null;
    videoCaption?: string;
    videoScript?: string;
    includeMusic?: boolean;
    includeVoiceOver?: boolean;
    videoPreset?: {
      id: string;
      title: string;
      videoUrl: string;
      thumbnailImageUrl?: string;
      duration?: number;
    } | null;
    generationId?: string | null;
    mode?: "standard" | "pro";
    complete?: boolean;
  }) => void;
  getLocationCountries: () => string[];
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
  attachedAssets: {
    assets: [],
    complete: false,
  },
  productSelection: {
    products: [],
    complete: false,
  },
  supportedAdPlatforms: {
    Facebook: false,
    Google: true,
    complete: true,
  },

  fundCampaign: {
    amount: 50,
    cardDetails: null,
    complete: false,
  },
  campaignSnapshots: {
    campaignName: "",
    campaignType: "Product Launch",
    brandColor: "",
    accentColor: "",
    destinationUrl: "",
    googleDailyBudget: "5",
    metaDailyBudget: "5",
    campaignStartDate: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0],
    campaignEndDate: new Date(new Date().setDate(new Date().getDate() + 30))
      .toISOString()
      .split("T")[0],
    complete: false,
  },
  adStyle: {
    presetType: "video",
    templateId: null,
    imageTemplateIds: [],
    imagePresets: [],
    imageAssetIdsByPresetId: {},
    selectedImagePresetIds: [],
    imageCopyByPresetId: {},
    imageCaptionsByPresetId: {},
    videoAssetId: null,
    videoCaption: "",
    videoScript: "",
    includeMusic: true,
    includeVoiceOver: true,
    videoPreset: null,
    generationId: null,
    mode: "standard",
    complete: false,
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
        attachAssetsToDraft: (assets) => {
          set((state) => {
            const byId = new Map(
              state.attachedAssets.assets.map((a) => [a.assetId, a]),
            );
            for (const a of assets) {
              byId.set(a.assetId, a);
            }
            return {
              attachedAssets: {
                assets: Array.from(byId.values()),
                complete: true,
              },
            };
          });
        },
        clearAttachedAssets: () => {
          set(() => ({ attachedAssets: { assets: [], complete: false } }));
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
            console.log({ locations });
            const country = location;
            if (!countries.includes(country)) {
              countries.push(country);
            }
          });
          return countries;
        },
        toggleFacebookSettings: (setting: keyof FacebookSettings) => {
          const settingValue = get().facebookSettings[setting];
          if (
            settingValue &&
            Object.values(get().facebookSettings).filter(Boolean).length === 1
          ) {
            // Prevent disabling the last enabled setting
            return;
          }
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
          const prevPrimaryId =
            get().productSelection.products?.[0]?.node?.id || null;
          const nextPrimaryId =
            productSelection.products?.[0]?.node?.id || null;

          if (
            prevPrimaryId &&
            nextPrimaryId &&
            prevPrimaryId !== nextPrimaryId
          ) {
            useCreativesStore.getState().actions.resetStore();
            useMetaCreativeUploadStore
              .getState()
              .actions.clearProductUploads(prevPrimaryId);
            const existingAdsShow = get().adsShow;
            set(() => ({
              ...initialState,
              adsShow: existingAdsShow,
              productSelection: {
                ...initialState.productSelection,
                ...productSelection,
              },
            }));
            return;
          }

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
        setAdsPlatform: (
          platform: keyof SupportedAdPlatforms,
          value: boolean,
        ) => {
          set((state) => ({
            supportedAdPlatforms: {
              ...state.supportedAdPlatforms,
              [platform]: value,
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
        storeCampaignSnapshots: (campaignSnapshots: Record<string, any>) => {
          console.log("Storing campaign snapshots:", campaignSnapshots);
          set((state) => ({
            campaignSnapshots: {
              ...state.campaignSnapshots,
              ...campaignSnapshots,
            },
          }));
        },
        storeAdStyle: (adStyle) => {
          set((state) => ({
            adStyle: {
              ...state.adStyle,
              ...adStyle,
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
        attachedAssets: state.attachedAssets,
        productSelection: state.productSelection,
        campaignSnapshots: state.campaignSnapshots,
        adStyle: state.adStyle,
        fundCampaign: state.fundCampaign,
        supportedAdPlatforms: state.supportedAdPlatforms,
        facebookSettings: state.facebookSettings,
        googleSettings: state.googleSettings,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Error rehydrating campaign store", error);
          return;
        }

        // if (state) {
        //   // Mutate the state object directly
        //   state.adsShow.complete = false;
        //   state.productSelection.complete = false;
        //   state.fundCampaign.complete = false;
        //   state.campaignSnapshots.complete = false;
        //   state.supportedAdPlatforms.complete = false;
        // }
      },
    },
  ),
);
