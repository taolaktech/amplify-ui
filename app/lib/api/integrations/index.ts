import axios from "axios";
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

const INTEGRATION_HOST = process.env.NEXT_PUBLIC_API_INTEGRATION_HOST;
export const facebookAuth = async (data: { token: string }) => {
  const response = await axios.get(
    `${INTEGRATION_HOST}/facebook-auth?platforms=facebook`,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  console.log("facebook auth response:", response);
  return response.data;
};

export const instagramAuth = async (data: { token: string }) => {
  const response = await axios.get(
    `${INTEGRATION_HOST}/facebook-auth?platforms=instagram`,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const facebookCallback = async (data: {
  code: string;
  state: string;
  token: string;
}) => {
  const response = await axios.get(
    `${INTEGRATION_HOST}/facebook-auth/callback`,
    {
      params: {
        code: data.code,
        state: data.state,
      },
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const getAdPagesForAdAccount = async (data: {
  adAccountId: string;
  token: string;
}) => {
  const response = await axios.get(
    `${INTEGRATION_HOST}/facebook-auth/ad-accounts/${data.adAccountId}/pages`,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const testAdPagesForAdAccount = async (data: {
  adAccountId: string;
  token: string;
}) => {
  await sleep(2000); // 2s delay
  console.log(data);

  return {
    success: true,
    data: [
      {
        _id: "68b0c75f03d4f2edcfad28bd",
        userId: "680690b4b7fe560e4582cf2f",
        pageId: "712111348642385",
        pageName: "Amplify AI",
        pageCategory: "Software Company",
        isPrimaryPage: true,
        createdAt: "2025-08-28T21:17:19.056Z",
        updatedAt: "2025-12-04T12:05:25.430Z",
        __v: 0,
        connectedInstagramAccountId: "17841476275533415",
      },
    ],
    message: "Pages retrieved successfully",
  };
};

export const selectFacebookPrimaryAdAccount = async (data: {
  adAccountId: string;
  pageId: string;
  metaPixelId?: string | null;
  instagramAccountId?: string | null;
  token: string;
}) => {
  const response = await axios.post(
    `${INTEGRATION_HOST}/facebook-auth/ad-accounts/primary/select`,
    {
      adAccountId: data.adAccountId,
      pageId: data.pageId,
      metaPixelId: data.metaPixelId || null,
      ...(data.instagramAccountId
        ? { instagramAccountId: data.instagramAccountId }
        : {}),
    },
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
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
  return response.data;
};
