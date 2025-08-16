import { create } from "zustand";

type ToastStore = {
  active: boolean;
  toast: {
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null;
  setToast: (toast: ToastStore["toast"]) => void;
  closeToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  active: false,
  toast: null,
  setToast: (toast) => set({ toast, active: true }),
  closeToast: () => set({ active: false }),
}));
