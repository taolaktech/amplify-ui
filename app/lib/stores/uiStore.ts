import { create } from "zustand";

interface UIStore {
  products: Record<string, any[]>;
  isSidebarOpen: boolean;
  isOnboardingCompleted: boolean;
  isSubscriptionSuccess: boolean;
  actions: {
    setProducts: (key: string, products: any[]) => void;
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
  products: { 0: [] },
  isSidebarOpen: defaultSidebarOpen,
  isOnboardingCompleted: false,
  isSubscriptionSuccess: false,
  actions: {
    setProducts: (key: string, products: any[]) =>
      set((state) => ({ products: { ...state.products, [key]: products } })),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setOnboardingCompleted: (completed) =>
      set({ isOnboardingCompleted: completed }),
    setSubscriptionSuccess: (success) =>
      set({ isSubscriptionSuccess: success }),
  },
}));

export default useUIStore;
