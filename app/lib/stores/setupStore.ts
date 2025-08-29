import { create } from "zustand";
import { persist } from "zustand/middleware";

type BusinessDetails = {
  storeLogo?: string | null;
  storeName: string;
  description: string;
  storeUrl: string;
  industry: string;
  contactEmail?: string;
  contactPhone?: string;
  companyRole: string;
  teamSize: {
    min: number;
    max: number;
  };
  adSpendBudget: number;
  annualRevenue: number;
  complete?: boolean;
};

type PreferredSalesLocation = {
  localShippingLocations: string[];
  internationalShippingLocations: string[];
  complete: boolean;
};

type MarketingGoals = {
  brandAwareness: boolean;
  acquireNewCustomers: boolean;
  boostRepeatPurchases: boolean;
  complete: boolean;
};

const defaultBusinessDetails: BusinessDetails = {
  storeLogo: null,
  storeName: "",
  description: "",
  storeUrl: "",
  industry: "",
  contactEmail: "",
  contactPhone: "",
  companyRole: "",
  teamSize: {
    min: 1,
    max: 1,
  },
  adSpendBudget: 0,
  annualRevenue: 0,
  complete: false,
};

const defaultPreferredSalesLocation = {
  localShippingLocations: [],
  internationalShippingLocations: [],
  complete: false,
};

const defaultMarketingGoals = {
  brandAwareness: false,
  acquireNewCustomers: false,
  boostRepeatPurchases: false,
  complete: false,
};

type SetupState = {
  connectStore: {
    storeUrl: string;
    complete: boolean;
  };
  businessDetails: BusinessDetails;
  preferredSalesLocation: PreferredSalesLocation;
  marketingGoals: MarketingGoals;
};

type SetupActions = {
  storeConnectStore: (connectStore: { storeUrl: string }) => void;
  completeConnectStore: (complete: boolean) => void;
  reset: () => void;
  storeBusinessDetails: (businessDetails: BusinessDetails) => void;
  completeBusinessDetails: (complete: boolean) => void;
  storePreferredSalesLocation: (
    preferredSalesLocation: PreferredSalesLocation
  ) => void;
  completePreferredSalesLocation: (complete: boolean) => void;
  storeMarketingGoals: (marketingGoals: MarketingGoals) => void;
  completeMarketingGoals: (complete: boolean) => void;
};

export type SetupStore = SetupState & SetupActions;

export const useSetupStore = create<SetupStore>()(
  persist(
    (set, get) => ({
      connectStore: {
        storeUrl: "",
        complete: false,
      },
      businessDetails: defaultBusinessDetails,
      preferredSalesLocation: defaultPreferredSalesLocation,
      marketingGoals: defaultMarketingGoals,
      storeConnectStore: (connectStore) => {
        set({ connectStore: { ...get().connectStore, ...connectStore } });
        set({
          businessDetails: {
            ...get().businessDetails,
            storeUrl: connectStore.storeUrl,
          },
        });
      },
      completeConnectStore: (complete) => {
        set({ connectStore: { ...get().connectStore, complete } });
      },
      reset: () => {
        set({
          connectStore: {
            storeUrl: "",
            complete: false,
          },
        });
        set({ businessDetails: defaultBusinessDetails });
        set({ preferredSalesLocation: defaultPreferredSalesLocation });
        set({ marketingGoals: defaultMarketingGoals });
      },

      storeBusinessDetails: (businessDetails) => {
        if (get().connectStore.complete) {
          set({
            businessDetails: { ...get().businessDetails, ...businessDetails },
          });
        }
      },
      completeBusinessDetails: (complete) => {
        if (get().connectStore.complete) {
          set({ businessDetails: { ...get().businessDetails, complete } });
        }
      },
      storePreferredSalesLocation: (preferredSalesLocation) => {
        if (get().businessDetails.complete) {
          set({
            preferredSalesLocation: {
              ...get().preferredSalesLocation,
              ...preferredSalesLocation,
            },
          });
        }
      },
      completePreferredSalesLocation: (complete) => {
        if (get().businessDetails.complete) {
          set({
            preferredSalesLocation: {
              ...get().preferredSalesLocation,
              complete,
            },
          });
        }
      },
      storeMarketingGoals: (marketingGoals) => {
        if (get().preferredSalesLocation.complete) {
          set({
            marketingGoals: { ...get().marketingGoals, ...marketingGoals },
          });
        }
      },
      completeMarketingGoals: (complete) => {
        if (get().preferredSalesLocation.complete) {
          set({ marketingGoals: { ...get().marketingGoals, complete } });
        }
      },
    }),
    {
      name: "setup-storage",
    }
  )
);
