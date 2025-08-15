import axiosInstanceBase from "./axios";
// import axios from "axios";

export enum IntegrationErrorCode {
  E_SHOPIFY_ACCOUNT_ALREADY_EXISTS = "E_SHOPIFY_ACCOUNT_ALREADY_EXISTS",
  INTERNAL_SERVER_ERROR = "E_INTERNAL_SERVER_ERROR",
  SHOPIFY_ACCOUNT_NOT_FOUND = "E_SHOPIFY_ACCOUNT_NOT_FOUND",
}

export type BusinessDetails = {
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
};

export const handleShopifyAuth = async (data: {
  shop: string;
  token: string;
  redirect: string;
}) => {
  const response = await axiosInstanceBase.post(
    "/shopify/auth/url",
    { shop: data.shop, redirect: data.redirect },
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const handleRetrieveStoreDetails = async (token: string) => {
  const response = await axiosInstanceBase.get("/business", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const handleGetMe = async (token: string) => {
  const response = await axiosInstanceBase.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const handleGetShopifyAccount = async (token: string) => {
  const response = await axiosInstanceBase.get("/shopify/connected-account", {
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
  const response = await axiosInstanceBase.post(
    "/business/details",
    data.businessDetails,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const postPreferredSalesLocation = async (data: {
  data: {
    localShippingLocations: {
      shorthand: string;
      country: string;
      city: string;
      state: string;
    }[];
    internationalShippingLocations: string[];
  };
  token: string;
}) => {
  console.log("data", data);
  const response = await axiosInstanceBase.post(
    "/business/set-shipping-locations",
    data.data,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const postMarketingGoals = async (data: {
  data: {
    brandAwareness: boolean;
    acquireNewCustomers: boolean;
    boostRepeatPurchases: boolean;
  };
  token: string;
}) => {
  const response = await axiosInstanceBase.post(
    "/business/set-goals",
    data.data,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const handleGetCities = async (data: {
  input: string;
  token: string;
}) => {
  if (!data.token) {
    console.log("token:", data.token);
    return;
  }
  const response = await axiosInstanceBase.post(
    "/business/cities",
    {
      input: data.input,
    },
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const getProducts = async (data: {
  token: string;
  last?: number;
  after?: string;
  before?: string;
}) => {
  const response = await axiosInstanceBase.get("/shopify/products", {
    params: {
      ...(!data.after && !data.before ? { first: 12 } : {}),
      ...(data.after && !data.before ? { after: data.after, first: 12 } : {}),
      ...(data.before && !data.after ? { before: data.before, last: 12 } : {}),
    },
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
  console.log("token", data.token);
  console.log("response", response.data);
  return response.data;
};
