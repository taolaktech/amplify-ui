import {
  CampaignPlatformsTitle,
  type LaunchCampaignPayload,
} from "./api/base/campaigns";
import type { Platform, ShopifyProduct } from "@/type";

type CreativesHistoryEntry = {
  creatives: any[];
  createdAt: Date | string;
  generatorId: string;
  kind: Platform;
};

type CreativesStoreShape = {
  Google: Record<string, CreativesHistoryEntry[]> | null;
  Facebook: Record<string, CreativesHistoryEntry[]> | null;
};

type AttachedAsset = {
  assetId: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  headline?: string;
  bodyCopy?: string;
  caption?: string;
};

export function buildLaunchCampaignPayload(args: {
  businessId: string;
  campaignName: string;
  campaignType: string;
  brandColor: string;
  accentColor: string;
  tone: string;
  startDateIso: string;
  endDateIso: string;
  totalBudget: number;
  products: ShopifyProduct[];
  locations: string[];
  supportedAdPlatforms: Record<string, any>;
  creativesStore: CreativesStoreShape;
  attachedAssets?: AttachedAsset[];
}): LaunchCampaignPayload {
  const {
    businessId,
    campaignName,
    campaignType,
    brandColor,
    accentColor,
    tone,
    startDateIso,
    endDateIso,
    totalBudget,
    products,
    locations,
    supportedAdPlatforms,
    creativesStore,
    attachedAssets,
  } = args;

  const campaignPlatforms: CampaignPlatformsTitle[] = [];
  if (supportedAdPlatforms?.Facebook) {
    campaignPlatforms.push(CampaignPlatformsTitle.FACEBOOK);
  }
  if (supportedAdPlatforms?.Instagram) {
    campaignPlatforms.push(CampaignPlatformsTitle.INSTAGRAM);
  }
  if (supportedAdPlatforms?.Google) {
    campaignPlatforms.push(CampaignPlatformsTitle.GOOGLE);
  }

  const productsPayload = products.map((product) => {
    const creatives: Array<{ channel: string; id?: string; data: any[] }> = [];

    const productId = product.node.id;

    if (supportedAdPlatforms?.Facebook) {
      const history = creativesStore.Facebook?.[productId] || [];
      const formatCreatives = history[history.length - 1]?.creatives || [];

      let metaData: string[] = [];
      let metaCreativeId: string | undefined;

      if (formatCreatives.length > 0) {
        metaData = formatCreatives.map((creative: any) =>
          JSON.stringify({
            url: creative?.url ?? creative?.mediaUrl ?? creative?.imageUrl,
            bodyText: creative?.bodyText ?? creative?.caption ?? creative?.text,
            caption: creative?.caption ?? creative?.bodyText,
            title: creative?.title ?? creative?.headline,
            description: creative?.description,
            productUrl: creative?.productUrl,
            key: creative?.key,
            id: creative?.id,
          }),
        );
        metaCreativeId = formatCreatives[0]?.id;
      } else if (Array.isArray(attachedAssets) && attachedAssets.length > 0) {
        const productTitle = product.node.title || "";
        const productDescription =
          product.node.description || product.node.title || "";
        const productLink = product.node.onlineStorePreviewUrl || "";

        metaData = attachedAssets.map((asset) =>
          JSON.stringify({
            url: asset.url,
            bodyText: asset.bodyCopy || productDescription,
            caption: asset.caption || "",
            title: asset.headline || productTitle,
            description: asset.bodyCopy || productDescription,
            productUrl: productLink,
            id: asset.assetId,
          }),
        );
        metaCreativeId = attachedAssets[0]?.assetId;
      }

      if (metaData.length > 0) {
        creatives.push({
          channel: "facebook",
          id: metaCreativeId,
          data: metaData,
        });

        if (supportedAdPlatforms?.Instagram) {
          creatives.push({
            channel: "instagram",
            id: metaCreativeId,
            data: metaData,
          });
        }
      }
    }

    if (supportedAdPlatforms?.Google && creativesStore.Google?.[productId]) {
      const history = creativesStore.Google?.[productId] || [];
      const formatCreatives = history[history.length - 1]?.creatives || [];

      const creativesData = formatCreatives?.map((creative: any) =>
        JSON.stringify(creative),
      );
      creatives.push({
        channel: "google",
        data: creativesData || [],
      });
    }

    return {
      shopifyId: product.node.id,
      title: product.node.title,
      price: parseFloat(product.node.priceRangeV2.minVariantPrice.amount),
      description: product.node.description || product.node.title || "N/A",
      occasion: product.node.occasion || "General",
      features: [
        ...(product.node?.tags || []),
        product.node?.category?.name || "N/A",
        product.node?.productType || "N/A",
        product.node?.handle || "N/A",
      ],
      category: product.node.productType || "General",
      imageLinks: [product.node.media.edges[0]?.node.preview.image.url || ""],
      productLink: product.node.onlineStorePreviewUrl || "",
      creatives,
    };
  });

  return {
    businessId,
    name: campaignName || "Campaign",
    type: campaignType || "Product Launch",
    platforms: campaignPlatforms,
    brandColor,
    accentColor,
    tone,
    startDate: new Date(startDateIso).toISOString(),
    endDate: new Date(endDateIso).toISOString(),
    totalBudget,
    products: productsPayload,
    location: locations
      .map((location) => {
        const splitted = location.split(",").map((part) => part.trim());
        return splitted[splitted.length - 1] || "";
      })
      .filter((country) => Boolean(country))
      .map((country) => ({ country })),
  };
}
