import { create } from "zustand";

type MetaCreativeType = "image" | "video";

export type MetaUploadedCreative = {
  id: string;
  type: MetaCreativeType;
  productId: string;
  file: File;
  previewUrl: string;
  width?: number;
  height?: number;
  duration?: number;
  resolutionLabel?: string;
  createdAt: number;
};

type MetaCreativeUploadStore = {
  uploadsByProductId: Record<string, MetaUploadedCreative[]>;
  actions: {
    addUpload: (upload: MetaUploadedCreative) => void;
    removeUpload: (productId: string, uploadId: string) => void;
    clearProductUploads: (productId: string) => void;
  };
};

export const useMetaCreativeUploadStore = create<MetaCreativeUploadStore>(
  (set, get) => ({
    uploadsByProductId: {},
    actions: {
      addUpload: (upload) => {
        const current = get().uploadsByProductId[upload.productId] || [];
        set({
          uploadsByProductId: {
            ...get().uploadsByProductId,
            [upload.productId]: [upload, ...current],
          },
        });
      },
      removeUpload: (productId, uploadId) => {
        const current = get().uploadsByProductId[productId] || [];
        const next = current.filter((u) => u.id !== uploadId);
        set({
          uploadsByProductId: {
            ...get().uploadsByProductId,
            [productId]: next,
          },
        });
      },
      clearProductUploads: (productId) => {
        set({
          uploadsByProductId: {
            ...get().uploadsByProductId,
            [productId]: [],
          },
        });
      },
    },
  }),
);
