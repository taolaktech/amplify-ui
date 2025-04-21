import { create } from "zustand";

interface SetupState {
  connectStore: boolean;
  businessDetails: boolean;
  preferredSalesLocation: boolean;
  businessGoal: boolean;
}

interface SetupActions {
  storeConnectStore: (connectStore: boolean) => void;
  storeBusinessDetails: (businessDetails: boolean) => void;
  storePreferredSalesLocation: (preferredSalesLocation: boolean) => void;
  storeBusinessGoal: (businessGoal: boolean) => void;
}

export interface SetupStore extends SetupState, SetupActions {}

export const useSetupStore = create<SetupStore>()((set, get) => ({
  connectStore: false,
  businessDetails: false,
  preferredSalesLocation: false,
  businessGoal: false,
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
  storeBusinessGoal: (businessGoal) => {
    if (get().preferredSalesLocation) {
      set({ businessGoal });
    }
  },
}));
