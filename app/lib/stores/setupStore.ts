import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BusinessDetails {
  storeName: string;
  description: string;
  storeUrl: string;
  industry: string;
  companyRole: string;
  teamSize: {
    min: number;
    max: number;
  };
  adSpendBudget: number;
  annualRevenue: number;
  complete?: boolean;
}

const defaultBusinessDetails: BusinessDetails = {
  storeName: "",
  description: "",
  storeUrl: "",
  industry: "",
  companyRole: "",
  teamSize: {
    min: 1,
    max: 1,
  },
  adSpendBudget: 0,
  annualRevenue: 0,
  complete: false,
};
interface SetupState {
  connectStore: {
    storeUrl: string;
    complete: boolean;
  };
  businessDetails: BusinessDetails;
  preferredSalesLocation: boolean;
  marketingGoal: boolean;
}

interface SetupActions {
  storeConnectStore: (connectStore: { storeUrl: string }) => void;
  completeConnectStore: (complete: boolean) => void;
  reset: () => void;
  storeBusinessDetails: (businessDetails: BusinessDetails) => void;
  completeBusinessDetails: (complete: boolean) => void;
  storePreferredSalesLocation: (preferredSalesLocation: boolean) => void;
  storeMarketingGoal: (marketingGoal: boolean) => void;
}

export interface SetupStore extends SetupState, SetupActions {}

export const useSetupStore = create<SetupStore>()(
  persist(
    (set, get) => ({
      connectStore: {
        storeUrl: "",
        complete: false,
      },
      businessDetails: defaultBusinessDetails,
      preferredSalesLocation: false,
      marketingGoal: false,
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
        if (get().businessDetails) {
          set({ preferredSalesLocation });
        }
      },
      storeMarketingGoal: (marketingGoal) => {
        if (get().preferredSalesLocation) {
          set({ marketingGoal });
        }
      },
    }),
    {
      name: "setup-storage",
    }
  )
);
