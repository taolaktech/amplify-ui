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
    "/creatives",
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
