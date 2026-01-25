import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export const passwordPattern =
  /^(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/;

export const paths = new Map<string, string>();

paths.set("/", "Dashboard");
paths.set("", "Dashboard");
paths.set("/company", "Company");
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
  instagram: any,
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

export const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AR: "Argentina",
  AM: "Armenia",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BH: "Bahrain",
  BD: "Bangladesh",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BR: "Brazil",
  BG: "Bulgaria",
  CA: "Canada",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  EE: "Estonia",
  ET: "Ethiopia",
  FI: "Finland",
  FR: "France",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GR: "Greece",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JP: "Japan",
  KE: "Kenya",
  KR: "South Korea",
  KW: "Kuwait",
  LV: "Latvia",
  LB: "Lebanon",
  LT: "Lithuania",
  LU: "Luxembourg",
  MY: "Malaysia",
  MX: "Mexico",
  MA: "Morocco",
  NL: "Netherlands",
  NZ: "New Zealand",
  NG: "Nigeria",
  NO: "Norway",
  PK: "Pakistan",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  QA: "Qatar",
  RO: "Romania",
  RU: "Russia",
  SA: "Saudi Arabia",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  ZA: "South Africa",
  ES: "Spain",
  SE: "Sweden",
  CH: "Switzerland",
  TW: "Taiwan",
  TH: "Thailand",
  TR: "Turkey",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
  UY: "Uruguay",
  VN: "Vietnam",
};
