import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

export type AssetType = "image" | "video";

export type AssetStatus = "pending" | "completed" | "failed";

export type GenerationKind =
  | "video_copy_generation"
  | "image_copy_generation"
  | "google_ad_generation"
  | "image_ad_generation"
  | "video_generation_12s";

export type Asset = {
  _id: string;
  type: AssetType;
  status: AssetStatus;
  source?: string;
  mediaUrl?: string;
  url?: string;
  thumbnailUrl?: string;
  duration?: number;
  resolution?: string;
  promptUsed?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ListAssetsResponse = {
  status: "success";
  message: string;
  data: any[];
};

export async function listAssets(data: {
  token: string;
  productId?: string;
  type?: AssetType;
}) {
  const { token, productId, type } = data;
  const response = await instance.get<ListAssetsResponse>("/assets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      ...(productId && { productId }),
      ...(type && { type }),
    },
  });

  return response.data;
}

export type PreflightMultiGenerationDto = {
  items: Array<{ kind: GenerationKind; count: number }>;
};

export type PreflightMultiGenerationResponse = {
  status: "success";
  message: string;
  data: {
    canGenerate: boolean;
    tokensRequired: number;
  };
};

export async function preflightMultiGeneration(data: {
  token: string;
  dto: PreflightMultiGenerationDto;
}) {
  const response = await instance.post<PreflightMultiGenerationResponse>(
    "/assets/preflight-multi-generation",
    data.dto,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

  return response.data;
}

export type GenerateImageDto = {
  productName: string;
  imagePresetId?: string;
  productDescription: string;
  productImages: string[];
  productId: string;
  headline: string;
  bodyCopy: string;
  cta?: string;
  customPrompt?: string;
};

export type GenerateImageResponse = {
  status: "success";
  message: string;
  data: {
    assetId: string;
  };
};

export async function generateImageAsset(data: {
  token: string;
  dto: GenerateImageDto;
}) {
  const mockAssetId = process.env.NEXT_PUBLIC_MOCK_IMAGE_ASSET;
  if (process.env.NODE_ENV === "development" && mockAssetId) {
    return {
      status: "success",
      message: "Mocked image generation response",
      data: {
        assetId: mockAssetId,
      },
    } satisfies GenerateImageResponse;
  }

  const response = await instance.post<GenerateImageResponse>(
    "/assets/generate-image",
    data.dto,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

  return response.data;
}

export type GenerateVideoDto = {
  productName: string;
  videoPresetId?: string;
  productDescription: string;
  productImages: string[];
  productId: string;
  includeMusic: boolean;
  includeVoiceOver: boolean;
  cta?: string;
  customPrompt?: string;
};

export type GenerateVideoResponse = {
  status: "success";
  message: string;
  data: {
    assetId: string;
  };
};

export type GenerateCopyDto = {
  productName: string;
  productDescription: string;
  productCategory: string;
  productImages: string[];
  productId: string;
  mediaPresetId: string;
};

export type GenerateCopyResponse = {
  success: boolean;
  data: {
    assetId?: string;
    headline?: string;
    description?: string;
    cta?: string;
    caption: string;
    script?: string;
  };
};

export async function generateCopy(data: {
  token: string;
  dto: GenerateCopyDto;
}) {
  if (process.env.NODE_ENV === "development") {
    return {
      success: true,
      data: {
        assetId: "1234",
        headline: "Elevate your drip",
        description: "Sure to provide you with the excellence you need",
        cta: "Shop Now",
        caption: "Come shop with us with this new piece",
        script:
          "Sure to provide you with the excellence you need — discover our latest drop today.",
      },
    } satisfies GenerateCopyResponse;
  }
  const response = await instance.post<GenerateCopyResponse>(
    "/assets/generate-copy",
    data.dto,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

  return response.data;
}

export async function generateVideoAsset(data: {
  token: string;
  dto: GenerateVideoDto;
}) {
  const mockAssetId = process.env.NEXT_PUBLIC_MOCK_VIDEO_ASSET;
  if (process.env.NODE_ENV === "development" && mockAssetId) {
    return {
      status: "success",
      message: "Mocked video generation response",
      data: {
        assetId: mockAssetId,
      },
    } satisfies GenerateVideoResponse;
  }

  const response = await instance.post<GenerateVideoResponse>(
    "/assets/generate-video",
    data.dto,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

  return response.data;
}

export type RegenerateImageDto = {
  assetId: string;
  productName: string;
  productDescription: string;
  productImages: string[];
  productId: string;
  headline: string;
  bodyCopy: string;
  cta?: string;
  customPrompt?: string;
};

export type RegenerateImageResponse = {
  status: "success";
  message: string;
  data: {
    assetId: string;
  };
};

export async function regenerateImageAsset(data: {
  token: string;
  dto: RegenerateImageDto;
}) {
  const mockAssetId = process.env.NEXT_PUBLIC_MOCK_VIDEO_ASSET;
  if (process.env.NODE_ENV === "development" && mockAssetId) {
    return {
      status: "success",
      message: "Mocked video generation response",
      data: {
        assetId: mockAssetId,
      },
    } satisfies RegenerateImageResponse;
  }
  const response = await instance.post<RegenerateImageResponse>(
    "/assets/regenerate-image",
    data.dto,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

  return response.data;
}

export type GetAssetResponse = {
  status: "success";
  message: string;
  data: Asset;
};

export async function getAssetById(data: { token: string; assetId: string }) {
  const response = await instance.get<GetAssetResponse>(
    `/assets/${data.assetId}`,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

  return response.data;
}

export type SaveAssetDto = {
  type: AssetType;
  source: "generated" | "uploaded";
  url?: string;
  storageUrl?: string;
  thumbnailUrl?: string;
  productId: string;
  metadata?: Record<string, any>;
};

export type SaveAssetResponse = {
  assetId: string;
  status: "saved";
};

export async function saveAsset(data: { token: string; dto: SaveAssetDto }) {
  const response = await instance.post<SaveAssetResponse>(
    "/assets/save",
    data.dto,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

  return response.data;
}

export type UploadVideoResponse = {
  storageUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  resolution?: string;
};

export async function uploadVideo(data: { token: string; file: File }) {
  const formData = new FormData();
  formData.append("file", data.file);

  const response = await instance.post<UploadVideoResponse>(
    "/assets/upload/video",
    formData,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
