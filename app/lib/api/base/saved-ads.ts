import instance from "./axios";

export type SavedAdCopy = {
  headline?: string;
  bodyCopy?: string;
  cta?: string;
  caption?: string;
  script?: string;
  brandName?: string;
  websiteUrl?: string;
  productId?: string;
};

export type SavedAdPopulatedAsset = {
  _id: string;
  type?: "image" | "video";
  mediaUrl?: string;
};

export type SavedAdItem = {
  _id: string;
  assetId: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  productId?: string;
  headline?: string;
  bodyCopy?: string;
  cta?: string;
  caption?: string;
  script?: string;
  brandName?: string;
  websiteUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SavedAdsPagination = {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export async function listSavedAds(args: {
  token: string;
  page?: number;
  perPage?: number;
  productIds?: string[];
  type?: "image" | "video";
  tags?: string[];
  from?: string;
  to?: string;
}) {
  const page = args.page || 1;
  const perPage = args.perPage || 12;

  const response = await instance.get<{
    status: "success";
    message: string;
    data: { items: SavedAdItem[]; pagination: SavedAdsPagination };
  }>("/saved-ads", {
    headers: {
      Authorization: `Bearer ${args.token}`,
    },
    params: {
      page,
      perPage,
      ...(Array.isArray(args.productIds) && args.productIds.length > 0
        ? { productIds: args.productIds }
        : {}),
      ...(typeof args.type === "string" ? { type: args.type } : {}),
      ...(Array.isArray(args.tags) && args.tags.length > 0
        ? { tags: args.tags }
        : {}),
      ...(typeof args.from === "string" && args.from.trim().length > 0
        ? { from: args.from }
        : {}),
      ...(typeof args.to === "string" && args.to.trim().length > 0
        ? { to: args.to }
        : {}),
    },
  });

  return response.data;
}

export async function createSavedAd(args: {
  token: string;
  dto: { assetId: string } & SavedAdCopy;
}) {
  const response = await instance.post<{
    status: "success";
    message: string;
    data: SavedAdItem;
  }>("/saved-ads", args.dto, {
    headers: {
      Authorization: `Bearer ${args.token}`,
    },
  });

  return response.data;
}

export async function deleteSavedAd(args: { token: string; id: string }) {
  const response = await instance.delete<{
    status: "success";
    message: string;
    data: SavedAdItem;
  }>(`/saved-ads/${args.id}`, {
    headers: {
      Authorization: `Bearer ${args.token}`,
    },
  });

  return response.data;
}
