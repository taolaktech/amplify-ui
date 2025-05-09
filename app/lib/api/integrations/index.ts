import axios from "./axios";

export enum IntegrationErrorCode {
  E_SHOPIFY_ACCOUNT_ALREADY_EXISTS = "E_SHOPIFY_ACCOUNT_ALREADY_EXISTS",
  INTERNAL_SERVER_ERROR = "E_INTERNAL_SERVER_ERROR",
  SHOPIFY_ACCOUNT_NOT_FOUND = "E_SHOPIFY_ACCOUNT_NOT_FOUND",
}

export interface BusinessDetails {
  companyName: string;
  description: string;
  website: string;
  industry: string;
  companyRole: string;
  teamSize: {
    min: number;
    max: number;
  };
  estimatedMonthlyBudget: number;
  estimatedAnnualRevenue: number;
}

export const handleShopifyAuth = async (data: {
  shop: string;
  token: string;
}) => {
  const response = await axios.post(
    "/shopify/auth/url",
    { shop: data.shop },
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const handleRetrieveStoreDetails = async (token: string) => {
  const response = await axios.get("/business-details", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const handleGetShopifyAccount = async (token: string) => {
  const response = await axios.get("/shopify/connected-account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const handlePostBusinessDetails = async (data: {
  businessDetails: BusinessDetails;
  token: string;
}) => {
  const response = await axios.post("/business-details", data.businessDetails, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
  return response.data;
};
