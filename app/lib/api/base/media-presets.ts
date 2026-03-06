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
  tags?: string[];
  creativeDirections?: string[];
  niches?: string[];
}) {
  const page = args.page || 1;
  const perPage = args.perPage || 20;

  const response = await instance.post<ListMediaPresetsResponse>(
    "/media-presets/search",
    {
      type: args.type,
      page,
      perPage,
      ...(args.tags && args.tags.length > 0 ? { tags: args.tags } : {}),
      ...(args.creativeDirections && args.creativeDirections.length > 0
        ? { creativeDirections: args.creativeDirections }
        : {}),
      ...(args.niches && args.niches.length > 0 ? { niches: args.niches } : {}),
    },
    {
      headers: {
        Authorization: `Bearer ${args.token}`,
      },
    },
  );

  return response.data;
}
