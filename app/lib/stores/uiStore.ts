import { create } from "zustand";

interface UIStore {
  isSidebarOpen: boolean;
  isOnboardingCompleted: boolean;
  actions: {
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    setOnboardingCompleted: (completed: boolean) => void;
  };
}

// use window.innerWidth (or document.documentElement.clientWidth) …
// guard with typeof window so it doesn’t blow up during SSR
const defaultSidebarOpen =
  typeof window !== "undefined" ? window.innerWidth > 1280 : false;

const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: defaultSidebarOpen,
  isOnboardingCompleted: false,
  actions: {
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setOnboardingCompleted: (completed) =>
      set({ isOnboardingCompleted: completed }),
  },
}));

export default useUIStore;
