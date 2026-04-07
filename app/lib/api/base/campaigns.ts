import {
  CampaignPlatforms,
  CampaignSortBy,
  CampaignStatus,
  CampaignType,
} from "../../stores/campaignsStore";

import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export default async function getCampaigns(data: {
  token: string;
  page?: number;
  sortBy?: CampaignSortBy;
  type?: CampaignType;
  status?: CampaignStatus;
  platforms?: CampaignPlatforms;
}) {
  const { token, page, sortBy, type, status, platforms } = data;
  const response = await instance.get("/campaign", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: page || 1,
      perPage: 10,
      sortBy: sortBy || "createdAt:desc",
      ...(type && { type }),
      ...(status && { status }),
      ...(platforms && { platforms }),
    },
  });
  return response.data;
}

type CampaignProductCreative = {
  channel: string;
  data: any[]; // URLs or text
  id?: string;
};

export enum CampaignPlatformsTitle {
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  GOOGLE = "GOOGLE",
}

type CampaignProduct = {
  shopifyId: string;
  title: string;
  price: number;
  description: string;
  audience?: string;
  occasion?: string;
  features: string[];
  category: string;
  imageLinks: string[];
  productLink: string;
  creatives: CampaignProductCreative[];
};

export type LaunchCampaignPayload = {
  businessId: string;
  type: string;
  name: string;
  platforms: CampaignPlatformsTitle[];
  brandColor?: string;
  accentColor?: string;
  tone: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  totalBudget?: number;
  googleDailyBudget?: number;
  facebookDailyBudget?: number;
  products: CampaignProduct[];
  location: {
    country: string;
  }[];
};

export async function launchCampaign(data: {
  campaignPayload: LaunchCampaignPayload;
  token: string;
  // amount: number;
  // paymentMethodId: string;
  // idempotencyKey: string;
}) {
  const { token, campaignPayload } = data;

  const response = await instance.post(`/campaign`, campaignPayload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
