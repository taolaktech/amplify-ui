import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

export type VideoPreset = {
  _id: string;
  label?: string;
  templateId?: string;
  videoUrl: string;
  thumbnailImageUrl: string;
  thumbnailVideoUrl: string;
  duration?: number;
  resolution?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ListVideoPresetsResponse = {
  data: {
    presets: VideoPreset[];
    pagination: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};

export async function listVideoPresets(data: {
  token: string;
  page?: number;
  perPage?: number;
}) {
  const response = await instance.get<ListVideoPresetsResponse>(
    "/video-presets",
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
      params: {
        page: data.page || 1,
        perPage: data.perPage || 12,
      },
    },
  );

  return response.data;
}
