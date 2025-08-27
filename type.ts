export type ImprovementCategory =
  | "GENERAL_EXPERIENCE"
  | "REPORT_BUG"
  | "FEATURE_REQUEST"
  | "SOMETHING_FELT_OFF";

  // handle, product type, tags
export type ShopifyProduct = {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    category: {
       fullName: string;
       id: string;
       name: string;
    };
    onlineStorePreviewUrl: string;
    tags: string[];
    productType: string;
    occasion?: string;
    brandName?: string;
    hasOnlyDefaultVariant: boolean;
    media: {
      edges: Array<{
        node: {
          id: string;
          mediaContentType: string;
          preview: {
            image: {
              url: string;
              alt: string;
            };
          };
        };
      }>;
    };
    priceRangeV2: {
      maxVariantPrice: {
        amount: string;
        currencyCode: string;
      };
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    variants: Array<{
      id: string;
      title: string;
      price: number;
      sku: string;
    }>;
  };
};
