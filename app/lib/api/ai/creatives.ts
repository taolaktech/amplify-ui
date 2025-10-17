import axiosInstance from "./axios";
export type GoogleCreativesProduct = {
  productName: string;
  productPrice: string;
  productDescription: string;
  productOccasion: string;
  productFeatures: string[];
  tone: string;
  productCategory: string;
  brandName: string;
  productImage: string;
  productLink: string;
  campaignType: string;
};

export async function generateGoogleCreatives(data: {
  token: string;
  googleCreativesProduct: GoogleCreativesProduct;
}) {
  const { token, googleCreativesProduct } = data;

  const response = await axiosInstance.post(
    "/generate-google-creatives",
    {
      ...googleCreativesProduct,
      channel: "GOOGLE",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export type MediaCreativesProduct = {
  productName: string;
  productDescription: string;
  channel: "FACEBOOK" | "INSTAGRAM";
  productFeatures: string[];
  tone: string;
  productCategory: string;
  brandName: string;
  productImages: string[];
  campaignType: string;
  type: "IMAGE" | "VIDEO";
  brandColor: string;
  brandAccent: string;
  siteUrl: string;
};

export async function generateMediaCreatives(data: {
  token: string;
  product: MediaCreativesProduct;
}) {
  const { token, product } = data;

  const response = await axiosInstance.post(
    "/generate-media-creatives",
    {
      ...product,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getCreativeSet(data: {
  token: string;
  creativeSetId: string;
}) {
  const { token, creativeSetId } = data;
  const response = await axiosInstance.get(`/creatives/${creativeSetId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
