import { create } from "zustand";

interface UIStore {
  products: any[];
  productCount: number;
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
    toggleSidebar: () => void;
    setOnboardingCompleted: (completed: boolean) => void;
    setSubscriptionSuccess: (success: boolean) => void;
  };
}

// use window.innerWidth (or document.documentElement.clientWidth) …
// guard with typeof window so it doesn’t blow up during SSR
const defaultSidebarOpen =
  typeof window !== "undefined" ? window.innerWidth > 1280 : false;

const useUIStore = create<UIStore>((set) => ({
  products: [],
  productCount: 0,
  currentPage: 1,
  startCursor: "",
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
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    toggleSidebar: () => {
      console.log("toggleSidebar");
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
    },
    setOnboardingCompleted: (completed) =>
      set({ isOnboardingCompleted: completed }),
    setSubscriptionSuccess: (success) =>
      set({ isSubscriptionSuccess: success }),
  },
}));

export default useUIStore;
