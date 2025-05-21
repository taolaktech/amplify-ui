import { create } from "zustand";

interface UIStore {
  isSidebarOpen: boolean;
  actions: {
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
  };
}

// use window.innerWidth (or document.documentElement.clientWidth) …
// guard with typeof window so it doesn’t blow up during SSR
const defaultSidebarOpen =
      typeof window !== "undefined" ? window.innerWidth > 1280 : false;

    console.log("defaultSidebarOpen from store: ", defaultSidebarOpen);


const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: defaultSidebarOpen,
  actions: {
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  },
}));

export default useUIStore;
