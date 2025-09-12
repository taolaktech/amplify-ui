import { ShopifyProduct } from "@/type";
import { create } from "zustand";

type UIStore = {
  products: ShopifyProduct[];
  productCount: number;
  totalProgressStep: number;
  currentProgressStep: number;
  startCursor: string;
  endCursor: string;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isSidebarOpen: boolean;
  isOnboardingCompleted: boolean;
  isSubscriptionSuccess: boolean;
  actions: {
    setProducts: (
      products: any[],
      productCount: number,
      startCursor: string,
      endCursor: string,
      hasNextPage: boolean,
      hasPreviousPage: boolean,
      currentPage: number
    ) => void;
    setSidebarOpen: (open: boolean) => void;
    setProgressStep: (current: number, total?: number) => void;
    toggleSidebar: () => void;
    setOnboardingCompleted: (completed: boolean) => void;
    setSubscriptionSuccess: (success: boolean) => void;
  };
};

// use window.innerWidth (or document.documentElement.clientWidth) …
// guard with typeof window so it doesn’t blow up during SSR
const defaultSidebarOpen =
  typeof window !== "undefined" ? window.innerWidth > 1280 : false;

const useUIStore = create<UIStore>((set) => ({
  products: [],
  productCount: 0,
  currentPage: 1,
  startCursor: "",
  totalProgressStep: 6,
  currentProgressStep: 1,
  endCursor: "",
  hasNextPage: false,
  hasPreviousPage: false,
  isSidebarOpen: defaultSidebarOpen,
  isOnboardingCompleted: false,
  isSubscriptionSuccess: false,
  actions: {
    setProducts: (
      products: any[],
      productCount: number,
      startCursor: string,
      endCursor: string,
      hasNextPage: boolean,
      hasPreviousPage: boolean,
      currentPage: number
    ) =>
      set(() => ({
        products: products,
        productCount: productCount,
        startCursor: startCursor,
        endCursor: endCursor,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        currentPage: currentPage,
      })),
    setProgressStep: (current, total = 6) =>
      set({ currentProgressStep: current, totalProgressStep: total }),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    toggleSidebar: () => {
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
    },
    setOnboardingCompleted: (completed) =>
      set({ isOnboardingCompleted: completed }),
    setSubscriptionSuccess: (success) =>
      set({ isSubscriptionSuccess: success }),
  },
}));

export default useUIStore;
