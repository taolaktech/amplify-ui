import { Platform } from "@/type";
import { create } from "zustand";

type Creatives = {
  generatorId: string;
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
    generate: (
      kind: Platform,
      productId: string,
      creative: any,
      generatorId: string
    ) => void;
    generalUndo: (productId: string) => void;
    canUndo: (productId: string) => boolean;
    resetStore: () => void;
  };
};

const useCreativesStore = create<CreativesStore>((set, get) => ({
  Google: null,
  Instagram: null,
  Facebook: null,
  actions: {
    resetStore: () =>
      set(() => ({ Google: null, Instagram: null, Facebook: null })),
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

    generate: (
      kind: Platform,
      productId: string,
      creatives: any,
      generatorId: string
    ) => {
      const { Google, Instagram, Facebook } = get();
      if (kind === "GOOGLE ADS") {
        const subGoogle = Google || {};
        if (!subGoogle[productId]) {
          subGoogle[productId] = [];
        }
        subGoogle[productId].push({
          creatives: creatives,
          generatorId: generatorId,
          kind: "GOOGLE ADS",
          createdAt: new Date(),
        });
        set({ Google: subGoogle });
      } else if (kind === "INSTAGRAM") {
        const subInstagram = Instagram || {};

        if (!subInstagram[productId]) {
          subInstagram[productId] = [];
        }

        const foundCreative = subInstagram[productId].find(
          (c) => c.generatorId === generatorId
        );
        if (
          foundCreative &&
          foundCreative.creatives?.length === creatives.length &&
          creatives.length > 0
        ) {
          return;
        } else if (!foundCreative && (!creatives || creatives.length === 0)) {
          subInstagram[productId].push({
            creatives: [],
            kind: "INSTAGRAM",
            createdAt: new Date(),
            generatorId: generatorId,
          });
        } else if (
          foundCreative &&
          foundCreative.creatives?.length !== creatives.length
        ) {
          subInstagram[productId] = subInstagram[productId].map((c) =>
            c.generatorId === generatorId
              ? {
                  creatives: creatives,
                  kind: "INSTAGRAM",
                  createdAt: new Date(),
                  generatorId: generatorId,
                }
              : c
          );
        }

        set({ Instagram: subInstagram });
        return;
      } else if (kind === "FACEBOOK") {
        const subFacebook = Facebook || {};

        if (!subFacebook[productId]) {
          subFacebook[productId] = [];
        }

        const foundCreative = subFacebook[productId].find(
          (c) => c.generatorId === generatorId
        );
        if (
          foundCreative &&
          foundCreative.creatives?.length === creatives.length &&
          creatives.length > 0
        ) {
          return;
        } else if (!foundCreative && (!creatives || creatives.length === 0)) {
          subFacebook[productId].push({
            creatives: [],
            kind: "FACEBOOK",
            createdAt: new Date(),
            generatorId: generatorId,
          });
        } else if (
          foundCreative &&
          foundCreative.creatives?.length !== creatives.length
        ) {
          subFacebook[productId] = subFacebook[productId].map((c) =>
            c.generatorId === generatorId
              ? {
                  creatives: creatives,
                  kind: "FACEBOOK",
                  createdAt: new Date(),
                  generatorId: generatorId,
                }
              : c
          );
        }

        set({ Facebook: subFacebook });
        return;
      }
    },
  },
}));

export default useCreativesStore;
