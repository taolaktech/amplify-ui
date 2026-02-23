import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

export type MediaPresetType = "image" | "video";

export type MediaPreset = {
  _id: string;
  label?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  type: MediaPresetType;
  duration?: number;
  resolution?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type ListMediaPresetsResponse = {
  data: {
    presets: MediaPreset[];
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

export async function listMediaPresets(args: {
  token: string;
  type: MediaPresetType;
  page?: number;
  perPage?: number;
  tags?: string;
}) {
  const page = args.page || 1;
  const perPage = args.perPage || 20;

  const response = await instance.get<ListMediaPresetsResponse>(
    "/media-presets",
    {
      headers: {
        Authorization: `Bearer ${args.token}`,
      },
      params: {
        type: args.type,
        page,
        perPage,
        ...(args.tags ? { tags: args.tags } : {}),
      },
    },
  );

  return response.data;
}
