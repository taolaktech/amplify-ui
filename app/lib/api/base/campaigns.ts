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
      ...(page !== undefined && { page }),
      perPage: 10,
      ...(sortBy && { sortBy }),
      ...(type && { type }),
      ...(status && { status }),
      ...(platforms && { platforms }),
    },
  });
  return response.data;
}
