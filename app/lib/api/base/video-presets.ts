import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

export type VideoPreset = {
  _id: string;
  label?: string;
  title?: string;
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
  const page = data.page || 1;
  const perPage = data.perPage || 12;

  const response = await instance.get(
    "/templates",
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
      params: {
        type: "video",
        page,
        limit: perPage,
      },
    },
  );

  const body: any = response.data;
  const templates =
    body?.templates ||
    body?.data?.templates ||
    body?.data?.data?.templates ||
    body?.data?.items ||
    [];

  const total =
    body?.total ??
    body?.data?.total ??
    body?.data?.pagination?.total ??
    body?.data?.data?.total ??
    0;

  const pages =
    body?.pages ??
    body?.data?.pages ??
    body?.data?.pagination?.pages ??
    body?.data?.data?.pages ??
    1;
  const totalPages = pages;

  const presets: VideoPreset[] = templates.map((t: any) => {
    const templateId = t?.templateId || t?.metadata?.templateId;
    const title = t?.title || t?.metadata?.title;

    const videoUrl = t?.metadata?.previewVideoUrl || t?.sourceS3Url || "";
    const thumbnailImageUrl =
      t?.thumbnailUrl || t?.metadata?.thumbnailImageUrl || "";
    const thumbnailVideoUrl =
      t?.metadata?.thumbnailVideoUrl || t?.metadata?.previewVideoUrl || videoUrl;

    return {
      _id: t?._id,
      templateId,
      title,
      label: title,
      videoUrl,
      thumbnailImageUrl,
      thumbnailVideoUrl,
      duration: t?.metadata?.duration,
      resolution: t?.metadata?.resolution,
      createdAt: t?.createdAt,
      updatedAt: t?.updatedAt,
    };
  });

  const normalized: ListVideoPresetsResponse = {
    data: {
      presets,
      pagination: {
        total,
        page,
        perPage,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  };

  return normalized;
}
