import { create } from "zustand";

type CreativesStore = {
  Google: Record<string, any[]> | null;
  Instagram: Record<string, any[]> | null;
  Facebook: Record<string, any[]> | null;

  actions: {
    undo: (
      kind: "Google" | "Instagram" | "Facebook",
      productId: string
    ) => void;
    generate: (
      kind: "Google" | "Instagram" | "Facebook",
      productId: string,
      creative: any
    ) => void;
    generalUndo: (productId: string) => void;
    canUndo: (productId: string) => boolean;
  };
};

const useCreativesStore = create<CreativesStore>((set, get) => ({
  Google: {
    "1": [
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
  },
  Instagram: null,
  Facebook: null,
  actions: {
    undo: (kind: "Google" | "Instagram" | "Facebook", productId: string) => {
      const { Google, Instagram, Facebook } = get();
      if (kind === "Google") {
        Google?.[productId].pop();
        set({ Google });
      } else if (kind === "Instagram") {
        Instagram?.[productId].pop();
        set({ Instagram });
      } else if (kind === "Facebook") {
        Facebook?.[productId].pop();
        set({ Facebook });
      }
    },

    generalUndo: (productId: string) => {
      const { Google, Instagram, Facebook } = get();
      const allCreatives: any[] = [];
      if (Google?.[productId]) {
        allCreatives.push(Google[productId]);
      }
      if (Instagram?.[productId]) {
        allCreatives.push(Instagram[productId]);
      }
      if (Facebook?.[productId]) {
        allCreatives.push(Facebook[productId]);
      }

      allCreatives.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      const lastCreative = allCreatives[allCreatives.length - 1];
      if (!lastCreative) return;

      if (lastCreative.kind === "Google") {
        if (Google?.[productId] && Google?.[productId]?.length > 1)
          Google?.[productId].pop();
        set({ Google });
      } else if (lastCreative.kind === "Instagram") {
        if (Instagram?.[productId] && Instagram?.[productId]?.length > 1)
          Instagram?.[productId].pop();
        set({ Instagram });
      } else if (lastCreative.kind === "Facebook") {
        if (Facebook?.[productId] && Facebook?.[productId]?.length > 1)
          Facebook?.[productId].pop();
        set({ Facebook });
      }

      // if (Google?.[productId]?.length) {
      //   Google[productId].pop();
      //   set({ Google });
      // }
      // if (Instagram?.[productId]?.length) {
      //   Instagram[productId].pop();
      //   set({ Instagram });
      // }
      // if (Facebook?.[productId]?.length) {
      //   Facebook[productId].pop();
      //   set({ Facebook });
      // }
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
      kind: "Google" | "Instagram" | "Facebook",
      productId: string,
      creative: any
    ) => {
      const { Google, Instagram, Facebook } = get();
      if (kind === "Google") {
        const subGoogle = Google || {};
        if (!subGoogle[productId]) {
          subGoogle[productId] = [];
        }
        subGoogle[productId].push(creative);
        console.log("setting:", subGoogle);
        set({ Google: subGoogle });
      } else if (kind === "Instagram") {
        const subInstagram = Instagram || {};
        if (!subInstagram[productId]) {
          subInstagram[productId] = [];
        }
        subInstagram[productId].push(creative);
        set({ Instagram: subInstagram });
      } else if (kind === "Facebook") {
        const subFacebook = Facebook || {};
        if (!subFacebook[productId]) {
          subFacebook[productId] = [];
        }
        subFacebook[productId].push(creative);
        set({ Facebook: subFacebook });
      }
    },
  },
}));

export default useCreativesStore;
