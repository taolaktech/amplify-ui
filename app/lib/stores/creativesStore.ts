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
  Facebook: null,
  actions: {
    resetStore: () =>
      set(() => ({ Google: null, Facebook: null })),
    undo: (kind: Platform, productId: string) => {
      const { Google, Facebook } = get();
      if (
        kind === "GOOGLE ADS" &&
        Google?.[productId] &&
        Google?.[productId].length
      ) {
        Google?.[productId].pop();
        set({ Google });
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
      const { Google, Facebook } = get();
      const allCreatives: Creatives[] = [];
      if (Google?.[productId]) {
        allCreatives.push(...Google[productId]);
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
      } else if (lastCreative.kind === "FACEBOOK") {
        if (Facebook?.[productId] && Facebook?.[productId]?.length > 1)
          Facebook?.[productId].pop();
        set({ Facebook });
      }
    },

    canUndo: (productId: string) => {
      const { Google, Facebook } = get();
      return !!(
        (Google?.[productId]?.length || 0) > 1 ||
        (Facebook?.[productId]?.length || 0) > 1
      );
    },

    generate: (
      kind: Platform,
      productId: string,
      creatives: any,
      generatorId: string
    ) => {
      const { Google, Facebook } = get();
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
