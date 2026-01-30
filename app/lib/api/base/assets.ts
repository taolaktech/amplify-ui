import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

export type AssetType = "image" | "video";

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
