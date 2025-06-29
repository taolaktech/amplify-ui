import axiosInstance from "./axios";
// import axios from "axios";

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
  const response = await axiosInstance.post(
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
  const response = await axiosInstance.get("/business-details", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const handleGetMe = async (token: string) => {
  const response = await axiosInstance.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const handleGetShopifyAccount = async (token: string) => {
  const response = await axiosInstance.get("/shopify/connected-account", {
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
  const response = await axiosInstance.post(
    "/business-details",
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
  const response = await axiosInstance.post(
    "/business-details/set-shipping-locations",
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
  const response = await axiosInstance.post(
    "/business-details/set-goals",
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
  const response = await axiosInstance.post(
    "/business-details/cities",
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
  first: number;
  after?: string;
}) => {
  const response = await axiosInstance.get("/shopify/products", {
    params: {
      first: data.first,
      after: data.after || null,
    },
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
  console.log("response", response.data);
  return response.data;
};
