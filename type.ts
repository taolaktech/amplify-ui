export type ImprovementCategory =
  | "GENERAL_EXPERIENCE"
  | "REPORT_BUG"
  | "FEATURE_REQUEST"
  | "SOMETHING_FELT_OFF";

export type ShopifyProduct = {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    onlineStorePreviewUrl: string;
    tags: string[];
    productType: string;
    hasOnlyDefaultVariant: boolean;
    media: {
      edges: Array<{
        node: {
          id: string;
          mediaContentType: string;
          preview: {
            image: {
              src: string;
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
