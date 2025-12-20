import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export const passwordPattern =
  /^(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/;

export const paths = new Map<string, string>();

paths.set("/", "Dashboard");
paths.set("", "Dashboard");
paths.set("/dashboard-v2", "Dashboard");
paths.set("/dashboard-v2/inspirations", "Inspirations");
paths.set("/dashboard-v2/campaigns", "Campaigns");
paths.set("/dashboard-v2/create-campaign/product-selection", "Create Campaign");
paths.set("/dashboard-v2/create-campaign/preview", "Campaign Snapshots");
paths.set("/company", "Company");
paths.set("/company/brand-assets", "Company");
paths.set("/company/store-details", "Company");
paths.set("/campaigns", "Campaigns");
paths.set("/settings", "Subscriptions");
paths.set("/settings/integrations", "Settings");
paths.set("/settings/subscriptions", "Subscriptions");

export const generateAvatar = (name: string) => {
  const avatar = createAvatar(initials, {
    seed: name,
    backgroundColor: ["F0E6FB"],
    textColor: ["6800d7"],
    scale: 100,
    radius: 50,
    fontSize: 35,
    fontWeight: 700,
  });
  return avatar;
};

export const normalize = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export const campaignStatus: { [key: string]: string } = {
  CREATING: "pending",
  ACTIVE: "active",
  PAUSED: "paused",
  DELETED: "archived",
  PENDING_REVIEW: "pending",
  DISAPPROVED: "archived",
  COMPLETED: "completed",
  ARCHIVED: "archived",
  UNSPECIFIED: "pending",
  READY_TO_LAUNCH: "pending",
  UNKNOWN: "pending",
  ENABLED: "active",
  REMOVED: "archived",
  PROCESSED: "pending",
  LIVE: "active",
};

export const isAllProductGenerated = (
  supportedAdPlatforms: any,
  products: any[],
  facebook: any,
  google: any,
  instagram: any
) => {
  return products.every((product) => {
    const { node } = product;

    if (supportedAdPlatforms.Facebook) {
      const fbCreatives = facebook?.[node.id] || [];
      if (
        fbCreatives.length === 0 ||
        !fbCreatives[fbCreatives.length - 1]?.creatives ||
        fbCreatives[fbCreatives.length - 1].creatives.length === 0
      )
        return false;
    }

    if (supportedAdPlatforms.Google) {
      const googleCreatives = google?.[node.id] || [];
      if (
        googleCreatives.length === 0 ||
        !googleCreatives[googleCreatives.length - 1]?.creatives ||
        googleCreatives[googleCreatives.length - 1].creatives.length === 0
      )
        return false;
    }
    if (supportedAdPlatforms.Instagram) {
      const instaCreatives = instagram?.[node.id] || [];
      if (
        instaCreatives.length === 0 ||
        !instaCreatives[instaCreatives.length - 1]?.creatives ||
        instaCreatives[instaCreatives.length - 1].creatives.length === 0
      )
        return false;
    }
    return true;
  });
};
