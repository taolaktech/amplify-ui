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
  Google: {
    "1": [
      {
        generatorId: "gen-123",
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
    resetStore: () =>
      set(() => ({ Google: null, Instagram: null, Facebook: null })),
    undo: (kind: Platform, productId: string) => {
      const { Google, Instagram, Facebook } = get();
      if (
        kind === "GOOGLE ADS" &&
        Google?.[productId] &&
        Google?.[productId].length
      ) {
        const nextGoogle = { ...(Google || {}) };
        nextGoogle[productId] = [...(nextGoogle[productId] || [])];
        nextGoogle[productId].pop();
        set({ Google: nextGoogle });
      } else if (
        kind === "INSTAGRAM" &&
        Instagram?.[productId] &&
        Instagram?.[productId].length
      ) {
        const nextInstagram = { ...(Instagram || {}) };
        nextInstagram[productId] = [...(nextInstagram[productId] || [])];
        nextInstagram[productId].pop();
        set({ Instagram: nextInstagram });
      } else if (
        kind === "FACEBOOK" &&
        Facebook?.[productId] &&
        Facebook?.[productId].length
      ) {
        const nextFacebook = { ...(Facebook || {}) };
        nextFacebook[productId] = [...(nextFacebook[productId] || [])];
        nextFacebook[productId].pop();
        set({ Facebook: nextFacebook });
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
        if (Google?.[productId] && Google?.[productId]?.length > 1) {
          const nextGoogle = { ...(Google || {}) };
          nextGoogle[productId] = [...(nextGoogle[productId] || [])];
          nextGoogle[productId].pop();
          set({ Google: nextGoogle });
        }
      } else if (lastCreative.kind === "INSTAGRAM") {
        if (Instagram?.[productId] && Instagram?.[productId]?.length > 1) {
          const nextInstagram = { ...(Instagram || {}) };
          nextInstagram[productId] = [...(nextInstagram[productId] || [])];
          nextInstagram[productId].pop();
          set({ Instagram: nextInstagram });
        }
      } else if (lastCreative.kind === "FACEBOOK") {
        if (Facebook?.[productId] && Facebook?.[productId]?.length > 1) {
          const nextFacebook = { ...(Facebook || {}) };
          nextFacebook[productId] = [...(nextFacebook[productId] || [])];
          nextFacebook[productId].pop();
          set({ Facebook: nextFacebook });
        }
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
        const subGoogle = { ...(Google || {}) };
        const nextArr = [...(subGoogle[productId] || [])];
        nextArr.push({
          creatives: creatives,
          generatorId: generatorId,
          kind: "GOOGLE ADS",
          createdAt: new Date(),
        });
        subGoogle[productId] = nextArr;
        set({ Google: subGoogle });
      } else if (kind === "INSTAGRAM") {
        const subInstagram = { ...(Instagram || {}) };
        const prevArr = [...(subInstagram[productId] || [])];
        const foundCreative = prevArr.find(
          (c) => c.generatorId === generatorId
        );
        if (
          foundCreative &&
          foundCreative.creatives?.length === creatives.length &&
          creatives.length > 0
        ) {
          return;
        } else if (!foundCreative && (!creatives || creatives.length === 0)) {
          prevArr.push({
            creatives: [],
            kind: "INSTAGRAM",
            createdAt: new Date(),
            generatorId: generatorId,
          });
        } else if (
          foundCreative &&
          foundCreative.creatives?.length !== creatives.length
        ) {
          subInstagram[productId] = prevArr.map((c) =>
            c.generatorId === generatorId
              ? {
                  creatives: creatives,
                  kind: "INSTAGRAM",
                  createdAt: new Date(),
                  generatorId: generatorId,
                }
              : c
          );
          set({ Instagram: subInstagram });
          return;
        }
        if (!subInstagram[productId]) {
          subInstagram[productId] = prevArr;
        }
        set({ Instagram: subInstagram });
        return;
      } else if (kind === "FACEBOOK") {
        const subFacebook = { ...(Facebook || {}) };
        const prevArr = [...(subFacebook[productId] || [])];
        const foundCreative = prevArr.find(
          (c) => c.generatorId === generatorId
        );
        if (
          foundCreative &&
          foundCreative.creatives?.length === creatives.length &&
          creatives.length > 0
        ) {
          return;
        } else if (!foundCreative && (!creatives || creatives.length === 0)) {
          prevArr.push({
            creatives: [],
            kind: "FACEBOOK",
            createdAt: new Date(),
            generatorId: generatorId,
          });
        } else if (
          foundCreative &&
          foundCreative.creatives?.length !== creatives.length
        ) {
          subFacebook[productId] = prevArr.map((c) =>
            c.generatorId === generatorId
              ? {
                  creatives: creatives,
                  kind: "FACEBOOK",
                  createdAt: new Date(),
                  generatorId: generatorId,
                }
              : c
          );
          set({ Facebook: subFacebook });
          return;
        }
        if (!subFacebook[productId]) {
          subFacebook[productId] = prevArr;
        }
        set({ Facebook: subFacebook });
        return;
      }
    },
  },
}));

export default useCreativesStore;
