import { create } from "zustand";

type BrandAssetStore = {
  primaryLogo: string | null;
  secondaryLogo: string | null;
  primaryColor: string;
  secondaryColor: string;
  toneOfVoice: string | null;
  primaryFont: string | null;
  secondaryFont: string | null;
  brandGuide: string | null;
  brandGuideName: string | null;
  brandGuideFile: File | null;
  actions: {
    setBrandAssets: (assets: Partial<BrandAssetStore>) => void;
    setPrimaryLogo: (logo: string | null) => void;
    setSecondaryLogo: (logo: string | null) => void;
    setBrandGuideFile: (file: File | null) => void;
    setBrandGuideName: (name: string | null) => void;
    setPrimaryColor: (color: string) => void;
    setSecondaryColor: (color: string) => void;
    setToneOfVoice: (tone: string | null) => void;
    setPrimaryFont: (font: string | null) => void;
    setSecondaryFont: (font: string | null) => void;
    setBrandGuide: (guide: string | null) => void;
  };
};

const useBrandAssetStore = create<BrandAssetStore>((set) => ({
  primaryLogo: null,
  secondaryLogo: null,
  primaryColor: "#000000",
  secondaryColor: "#FFFFFF",
  toneOfVoice: null,
  primaryFont: null,
  secondaryFont: null,
  brandGuide: null,
  brandGuideName: null,
  brandGuideFile: null,
  actions: {
    setBrandAssets: (assets: Partial<BrandAssetStore>) =>
      set((state) => ({ ...state, ...assets })),
    setBrandGuideName: (name: string | null) => set({ brandGuideName: name }),
    setBrandGuideFile: (file: File | null) => set({ brandGuideFile: file }),
    setPrimaryLogo: (logo: string | null) => set({ primaryLogo: logo }),
    setSecondaryLogo: (logo: string | null) => set({ secondaryLogo: logo }),
    setPrimaryColor: (color: string) => set({ primaryColor: color }),
    setSecondaryColor: (color: string) => set({ secondaryColor: color }),
    setToneOfVoice: (tone: string | null) => set({ toneOfVoice: tone }),
    setPrimaryFont: (font: string | null) => set({ primaryFont: font }),
    setSecondaryFont: (font: string | null) => set({ secondaryFont: font }),
    setBrandGuide: (guide: string | null) => set({ brandGuide: guide }),
  },
}));

export default useBrandAssetStore;
