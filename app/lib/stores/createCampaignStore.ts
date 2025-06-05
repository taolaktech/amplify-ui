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
  actions: CreateCampaignActions;
}

interface CreateCampaignActions {
  storeAdsShow: (adsShow: { location: string[]; complete: boolean }) => void;
  storeProductSelection: (productSelection: {
    products: any[];
    complete: boolean;
  }) => void;
  reset: () => void;
}

export const useCreateCampaignStore = create<CreateCampaignState>()(
  persist(
    (set, get) => ({
      adsShow: {
        location: [],
        complete: false,
      },
      productSelection: {
        products: [],
        complete: false,
      },
      actions: {
        storeAdsShow: (adsShow) => {
          set({ adsShow: { ...get().adsShow, ...adsShow } });
        },
        storeProductSelection: (productSelection) => {
          set({
            productSelection: {
              ...get().productSelection,
              ...productSelection,
            },
          });
        },
        reset: () => {
          set({
            adsShow: {
              location: [],
              complete: false,
            },
            productSelection: {
              products: [],
              complete: false,
            },
          });
        },
      },
    }),
    {
      name: "create-campaign-storage",
    }
  )
);
