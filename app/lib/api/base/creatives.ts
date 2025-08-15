import axiosInstance from "./axios";
export type GoogleCreativesProduct = {
  productName: string;
  productPrice: string;
  productDescription: string;
  productOccasion: string;
  productFeature: string[];
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
  // Implementation for generating Google creatives
  const { token, googleCreativesProduct } = data;
  const response = await axiosInstance.post("/creatives", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { ...googleCreativesProduct, channel: "GOOGLE" },
  });
}
