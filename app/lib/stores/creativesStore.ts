import { Platform } from "@/type";
import { create } from "zustand";

type Creatives = {
  creatives: any[];
  createdAt: Date;
  kind: Platform;
};

type CreativesStore = {
  Google: Record<string, Creatives[]> | null;
  Instagram: Record<string, Creatives[]> | null;
  Facebook: Record<string, Creatives[]> | null;

  actions: {
    undo: (kind: Platform, productId: string) => void;
    generate: (kind: Platform, productId: string, creative: any) => void;
    generalUndo: (productId: string) => void;
    canUndo: (productId: string) => boolean;
  };
};

const useCreativesStore = create<CreativesStore>((set, get) => ({
  Google: {
    "1": [
      {
        creatives: [
          {
            headline: "Amplify Creatives",
            description: "Generating Creatives for you",
          },
          {
            headline: "Amplify Creatives",
            description: "Generating Creatives for you",
          },
          {
            headline: "Amplify Creatives",
            description: "Generating Creatives for you",
          },
          {
            headline: "Amplify Creatives",
            description: "Generating Creatives for you",
          },
        ],
        createdAt: new Date(),
        kind: "GOOGLE ADS",
      },
    ],
  },
  Instagram: null,
  Facebook: null,
  actions: {
    undo: (kind: Platform, productId: string) => {
      const { Google, Instagram, Facebook } = get();
      if (
        kind === "GOOGLE ADS" &&
        Google?.[productId] &&
        Google?.[productId].length
      ) {
        Google?.[productId].pop();
        set({ Google });
      } else if (
        kind === "INSTAGRAM" &&
        Instagram?.[productId] &&
        Instagram?.[productId].length
      ) {
        Instagram?.[productId].pop();
        set({ Instagram });
      } else if (
        kind === "FACEBOOK" &&
        Facebook?.[productId] &&
        Facebook?.[productId].length
      ) {
        Facebook?.[productId].pop();
        set({ Facebook });
      }
    },

    generalUndo: (productId: string) => {
      const { Google, Instagram, Facebook } = get();
      const allCreatives: Creatives[] = [];
      if (Google?.[productId]) {
        allCreatives.push(...Google[productId]);
      }
      if (Instagram?.[productId]) {
        allCreatives.push(...Instagram[productId]);
      }
      if (Facebook?.[productId]) {
        allCreatives.push(...Facebook[productId]);
      }

      allCreatives.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const lastCreative = allCreatives[0];
      if (!lastCreative) return;

      if (lastCreative.kind === "GOOGLE ADS") {
        if (Google?.[productId] && Google?.[productId]?.length > 1)
          Google?.[productId].pop();
        set({ Google });
      } else if (lastCreative.kind === "INSTAGRAM") {
        if (Instagram?.[productId] && Instagram?.[productId]?.length > 1)
          Instagram?.[productId].pop();
        set({ Instagram });
      } else if (lastCreative.kind === "FACEBOOK") {
        if (Facebook?.[productId] && Facebook?.[productId]?.length > 1)
          Facebook?.[productId].pop();
        set({ Facebook });
      }
    },

    canUndo: (productId: string) => {
      const { Google, Instagram, Facebook } = get();
      return !!(
        (Google?.[productId]?.length || 0) > 1 ||
        (Instagram?.[productId]?.length || 0) > 1 ||
        (Facebook?.[productId]?.length || 0) > 1
      );
    },

    generate: (kind: Platform, productId: string, creatives: any) => {
      const { Google, Instagram, Facebook } = get();
      console.log("Generating creatives for", { kind, productId, creatives });
      if (kind === "GOOGLE ADS") {
        const subGoogle = Google || {};
        if (!subGoogle[productId]) {
          subGoogle[productId] = [];
        }
        subGoogle[productId].push({
          creatives: creatives,
          kind: "GOOGLE ADS",
          createdAt: new Date(),
        });
        set({ Google: subGoogle });
      } else if (kind === "INSTAGRAM") {
        const subInstagram = Instagram || {};
        if (!subInstagram[productId]) {
          subInstagram[productId] = [];
        }
        subInstagram[productId].push({
          creatives: creatives,
          kind: "INSTAGRAM",
          createdAt: new Date(),
        });
        set({ Instagram: subInstagram });
      } else if (kind === "FACEBOOK") {
        const subFacebook = Facebook || {};
        if (!subFacebook[productId]) {
          subFacebook[productId] = [];
        }
        subFacebook[productId].push({
          creatives: creatives,
          kind: "FACEBOOK",
          createdAt: new Date(),
        });
        set({ Facebook: subFacebook });
      }
    },
  },
}));

export default useCreativesStore;
