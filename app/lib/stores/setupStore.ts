import { create } from "zustand";

interface SetupState {
  connectStore: boolean;
  businessDetails: boolean;
  preferredSalesLocation: boolean;
  marketingGoal: boolean;
}

interface SetupActions {
  storeConnectStore: (connectStore: boolean) => void;
  storeBusinessDetails: (businessDetails: boolean) => void;
  storePreferredSalesLocation: (preferredSalesLocation: boolean) => void;
  storeMarketingGoal: (marketingGoal: boolean) => void;
}

export interface SetupStore extends SetupState, SetupActions {}

export const useSetupStore = create<SetupStore>()((set, get) => ({
  connectStore: false,
  businessDetails: false,
  preferredSalesLocation: false,
  marketingGoal: false,
  storeConnectStore: (connectStore) => {
    set({ connectStore });
  },
  storeBusinessDetails: (businessDetails) => {
    if (get().connectStore) {
      set({ businessDetails });
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
}));
