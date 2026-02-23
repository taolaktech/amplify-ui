"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/app/ui/Button";
import SelectInput from "@/app/ui/form/SelectInput";
import type { ShopifyProduct } from "@/type";

type Platform = "Instagram" | "Facebook" | "Google";
type Format = "Static" | "Carousel";

type TemplateTheme =
  | "Testimonials"
  | "Product Demo"
  | "Before / After"
  | "Lifestyle Routine"
  | "Unboxing"
  | "Problem → Solution"
  | "Comparison"
  | "Offers & Urgency"
  | "Luxury Macro"
  | "Viral / Fast Cuts";

type QuickTagType = "season" | "occasion" | "context" | "commercial";

type QuickTag = {
  id: string;
  label: string;
  type: QuickTagType;
};

type ImageAdTemplate = {
  id: string;
  name: string;
  theme: TemplateTheme;
  benefit: string;
  previewImageUrl?: string;
  niches: string[];
  platforms: Platform[];
  format: Format;
  tags: string[];
  performanceScore: number;
};

type ThemeDef = {
  name: TemplateTheme;
  benefit: string;
  baseScore: number;
};

const THEMES: ThemeDef[] = [
  {
    name: "Testimonials",
    benefit: "Build trust fast with social proof and outcomes.",
    baseScore: 95,
  },
  {
    name: "Product Demo",
    benefit: "Show the product in action and reduce uncertainty.",
    baseScore: 92,
  },
  {
    name: "Before / After",
    benefit: "Make the transformation obvious at a glance.",
    baseScore: 88,
  },
  {
    name: "Lifestyle Routine",
    benefit: "Help customers picture it in their daily life.",
    baseScore: 86,
  },
  {
    name: "Unboxing",
    benefit: "Highlight packaging, quality, and first impressions.",
    baseScore: 84,
  },
  {
    name: "Problem → Solution",
    benefit: "Hook with a pain point, then reveal the fix.",
    baseScore: 90,
  },
  {
    name: "Comparison",
    benefit: "Differentiate with clear side-by-side value.",
    baseScore: 82,
  },
  {
    name: "Offers & Urgency",
    benefit: "Drive action with limited-time incentives.",
    baseScore: 80,
  },
  {
    name: "Luxury Macro",
    benefit: "Elevate perceived value with premium visuals.",
    baseScore: 78,
  },
  {
    name: "Viral / Fast Cuts",
    benefit: "High energy patterns that stop the scroll.",
    baseScore: 76,
  },
];

const ALL_NICHES = [
  "Fashion & Apparel",
  "Beauty & Skincare",
  "Health & Wellness",
  "Home & Living",
  "Jewelry & Accessories",
  "Electronics & Gadgets",
  "Fitness & Sports",
  "Food & Beverage",
  "Baby, Kids & Parenting",
  "Pet Supplies",
  "Automotive",
  "Travel & Outdoor",
  "Digital Products & Services",
  "Gifts & Occasions",
];

const STORAGE_KEY = "image-ad-templates.browser.v1";
const GOOGLE_DRIVE_PLACEHOLDER_IMAGE_1 =
  "https://drive.google.com/uc?export=view&id=1rdi7OIxbdwRoIQQLISZDr05p4AzHZ22Q";
const GOOGLE_DRIVE_PLACEHOLDER_IMAGE_2 =
  "https://drive.google.com/uc?export=view&id=1t0gvTksQbrcg73rxHa2Wevy5ftlP_Y7C";
const GOOGLE_DRIVE_PLACEHOLDER_IMAGE_3 =
  "https://drive.google.com/uc?export=view&id=1wly64UFTRd14DgCzZhXhYi5BqDbiBO-4";
const SHOPIFY_CDN_PLACEHOLDER_IMAGE_1 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/2ab9b50390284b3a7d8670f47c3ed801.jpg?v=1770232578";
const SHOPIFY_FASHION_PLACEHOLDER_IMAGE_1 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/dce5f77d7fc1ef8a863aaabe105731c7.jpg?v=1770233060";
const SHOPIFY_FASHION_PLACEHOLDER_IMAGE_2 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/7fc5ce1d71b05b8241824b26d238f5aa_f8c76a6b-99a9-423b-bfbc-e9f4da4594fb.jpg?v=1770233060";
const SHOPIFY_FASHION_PLACEHOLDER_IMAGE_3 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/c0cfc93c765c252dd50589cc1ec4f284.jpg?v=1770233060";
const SHOPIFY_FASHION_PLACEHOLDER_IMAGE_4 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/cc362828495d9d158853c945b8dba0a6.jpg?v=1770233060";
const SHOPIFY_FASHION_PLACEHOLDER_IMAGE_5 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/ac23dea135aad18b36333d2fc4038df5.jpg?v=1770233060";
const SHOPIFY_FASHION_PLACEHOLDER_IMAGE_6 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/d7a5b7da65e4e6964444069415ba0ff4.jpg?v=1770233059";
const SHOPIFY_FASHION_PLACEHOLDER_IMAGE_7 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/26b33c8b00cf95023c04d22d5d715060.jpg?v=1770233059";
const SHOPIFY_FASHION_PLACEHOLDER_IMAGE_8 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/595849f2d20440378c9bfe7b67354b79.jpg?v=1770233059";
const SHOPIFY_FASHION_PLACEHOLDER_IMAGE_9 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/834f9c6853c283a36a0c6960c2ab5166.jpg?v=1770233059";
const SHOPIFY_FASHION_PLACEHOLDER_IMAGE_10 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/7fc5ce1d71b05b8241824b26d238f5aa.jpg?v=1770232578";
const SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_1 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/60125d188440549ff663720c15bf3fbb.jpg?v=1770233328";
const SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_2 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/4065b2eeae0794b6e6476652db98bf92.jpg?v=1770233327";
const SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_3 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/246b0d77e662281a4d70189dbd2ad48d.jpg?v=1770233327";
const SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_4 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/283afceda1dc1d0a7c6bea51473b2ab2.jpg?v=1770233327";
const SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_5 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/68a8998bc86a93337ea5f501c93625ec.jpg?v=1770233327";
const SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_6 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/d32350a2e945416a77c5ca518108599f.jpg?v=1770233327";
const SHOPIFY_HOME_PLACEHOLDER_IMAGE_1 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/04cd75e078966ce3a7d801432c414992.jpg?v=1770233656";
const SHOPIFY_HOME_PLACEHOLDER_IMAGE_2 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/47c26d3c6c6689333be73200bdf93361.jpg?v=1770233656";
const SHOPIFY_HOME_PLACEHOLDER_IMAGE_3 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/2b5193ac6e6d261616355dd5cae154dc.jpg?v=1770233655";
const SHOPIFY_WELLNESS_PLACEHOLDER_IMAGE_1 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/c84891e928638807de0f0b86a9bc1851.jpg?v=1770233898";
const SHOPIFY_WELLNESS_PLACEHOLDER_IMAGE_2 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/6f3251ff73e6638a4f44fdb6dce4bff5.jpg?v=1770233898";
const SHOPIFY_WELLNESS_PLACEHOLDER_IMAGE_3 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/6f067cf572f724adb5b517a298f3455f_ccb9b3bd-adf5-431e-a7f5-6cd9e84cb021.jpg?v=1770233898";
const SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_1 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/2ad8fda32a8690d8662b5921a050769b.jpg?v=1770233936";
const SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_2 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/b481169ff64445a7a071ecc1cb580a40.jpg?v=1770233936";
const SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_3 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/b926a591e8fd90341b44c03f6441f8eb.jpg?v=1770233936";
const SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_4 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/1c983c4c4050e5ec723aeb30def24324.jpg?v=1770233936";
const SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_5 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/4d57e0e6f155d394d35aefad7b2d867d.jpg?v=1770233936";
const SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_6 =
  "https://cdn.shopify.com/s/files/1/0719/6884/9967/files/4b94d6bf85697d43a9f024afd60bff00.jpg?v=1770233936";
const SHOPIFY_CDN_PREFIX = "https://cdn.shopify.com/";

function isShopifyCdnUrl(url?: string) {
  return Boolean(url && url.startsWith(SHOPIFY_CDN_PREFIX));
}

const PLACEHOLDER_PREVIEW_IMAGES = [
  SHOPIFY_CDN_PLACEHOLDER_IMAGE_1,
  SHOPIFY_FASHION_PLACEHOLDER_IMAGE_1,
  SHOPIFY_FASHION_PLACEHOLDER_IMAGE_2,
  SHOPIFY_FASHION_PLACEHOLDER_IMAGE_3,
  SHOPIFY_FASHION_PLACEHOLDER_IMAGE_4,
  SHOPIFY_FASHION_PLACEHOLDER_IMAGE_5,
  SHOPIFY_FASHION_PLACEHOLDER_IMAGE_6,
  SHOPIFY_FASHION_PLACEHOLDER_IMAGE_7,
  SHOPIFY_FASHION_PLACEHOLDER_IMAGE_8,
  SHOPIFY_FASHION_PLACEHOLDER_IMAGE_9,
  SHOPIFY_FASHION_PLACEHOLDER_IMAGE_10,
  SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_1,
  SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_2,
  SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_3,
  SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_4,
  SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_5,
  SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_6,
  SHOPIFY_HOME_PLACEHOLDER_IMAGE_1,
  SHOPIFY_HOME_PLACEHOLDER_IMAGE_2,
  SHOPIFY_HOME_PLACEHOLDER_IMAGE_3,
  SHOPIFY_WELLNESS_PLACEHOLDER_IMAGE_1,
  SHOPIFY_WELLNESS_PLACEHOLDER_IMAGE_2,
  SHOPIFY_WELLNESS_PLACEHOLDER_IMAGE_3,
  SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_1,
  SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_2,
  SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_3,
  SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_4,
  SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_5,
  SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_6,
];

function slugify(input: string) {
  return (input || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .trim();
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  try {
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function seasonTagFromDate(date = new Date()): string | null {
  const m = date.getMonth() + 1;
  if ([12, 1, 2].includes(m)) return "Winter";
  if ([3, 4, 5].includes(m)) return "Spring";
  if ([6, 7, 8].includes(m)) return "Summer";
  if ([9, 10, 11].includes(m)) return "Fall";
  return null;
}

function derivePrimaryNiche(product?: ShopifyProduct["node"] | null) {
  const haystack =
    `${product?.productType || ""} ${product?.category?.name || ""} ${
      product?.title || ""
    } ${(product?.tags || []).join(" ")}`.toLowerCase();

  const rules: Array<{ niche: string; keywords: string[] }> = [
    {
      niche: "Fashion & Apparel",
      keywords: [
        "fashion",
        "apparel",
        "clothing",
        "shirt",
        "pants",
        "dress",
        "hoodie",
        "jacket",
        "shoes",
        "sneaker",
      ],
    },
    {
      niche: "Beauty & Skincare",
      keywords: [
        "beauty",
        "skincare",
        "skin",
        "cleanser",
        "serum",
        "lotion",
        "moistur",
        "makeup",
      ],
    },
    {
      niche: "Health & Wellness",
      keywords: [
        "health",
        "wellness",
        "supplement",
        "vitamin",
        "sleep",
        "energy",
        "immune",
      ],
    },
    {
      niche: "Home & Living",
      keywords: ["home", "living", "kitchen", "decor", "furniture", "bedding"],
    },
    {
      niche: "Jewelry & Accessories",
      keywords: [
        "jewelry",
        "necklace",
        "ring",
        "bracelet",
        "earring",
        "accessory",
        "handbag",
        "bag",
      ],
    },
    {
      niche: "Electronics & Gadgets",
      keywords: [
        "electronic",
        "gadget",
        "phone",
        "laptop",
        "headphone",
        "camera",
        "charger",
      ],
    },
    {
      niche: "Fitness & Sports",
      keywords: ["fitness", "workout", "gym", "sport", "athletic", "training"],
    },
    {
      niche: "Food & Beverage",
      keywords: ["food", "beverage", "coffee", "tea", "snack", "protein"],
    },
    {
      niche: "Baby, Kids & Parenting",
      keywords: ["baby", "kids", "kid", "toddler", "parent"],
    },
    {
      niche: "Pet Supplies",
      keywords: ["pet", "dog", "cat", "puppy", "kitten"],
    },
    {
      niche: "Automotive",
      keywords: ["automotive", "vehicle", "car", "auto"],
    },
    {
      niche: "Travel & Outdoor",
      keywords: ["travel", "outdoor", "hiking", "camp", "camping"],
    },
    {
      niche: "Digital Products & Services",
      keywords: ["digital", "software", "subscription", "course", "ebook", "service"],
    },
    {
      niche: "Gifts & Occasions",
      keywords: ["gift", "gifting", "holiday", "birthday", "wedding"],
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((k) => haystack.includes(k))) return rule.niche;
  }

  return null;
}

function generateQuickTags(product?: ShopifyProduct["node"] | null): QuickTag[] {
  const tags = product?.tags || [];
  const title = product?.title || "";
  const desc = product?.description || "";
  const lower = `${title} ${desc} ${tags.join(" ")}`.toLowerCase();

  const season = seasonTagFromDate();

  const out: QuickTag[] = [];

  if (season) {
    out.push({ id: `season-${season.toLowerCase()}`, label: season, type: "season" });
  }

  const isGiftable =
    lower.includes("gift") ||
    lower.includes("gifting") ||
    lower.includes("present") ||
    lower.includes("holiday");
  if (isGiftable) {
    out.push({ id: "occasion-giftable", label: "Giftable", type: "occasion" });
  }

  const isNew = lower.includes("new") || lower.includes("launch");
  if (isNew) {
    out.push({ id: "occasion-new-arrival", label: "New arrival", type: "occasion" });
  }

  const isBundle = lower.includes("bundle") || lower.includes("pack") || lower.includes("set");
  if (isBundle) {
    out.push({ id: "commercial-bundle", label: "Bundle", type: "commercial" });
  }

  const isLimited =
    lower.includes("limited") ||
    lower.includes("today") ||
    lower.includes("sale") ||
    lower.includes("discount");
  if (isLimited) {
    out.push({ id: "commercial-limited-time", label: "Limited time", type: "commercial" });
  }

  const isOutdoor =
    lower.includes("outdoor") || lower.includes("hiking") || lower.includes("camp");
  if (isOutdoor) {
    out.push({ id: "context-outdoor", label: "Outdoor", type: "context" });
  }

  const isMorning = lower.includes("morning") || lower.includes("routine");
  if (isMorning) {
    out.push({ id: "context-morning", label: "Morning routine", type: "context" });
  }

  return out;
}

function tagTypeFromLabel(label: string): QuickTagType {
  const v = (label || "").toLowerCase();
  if (["winter", "spring", "summer", "fall"].includes(v)) return "season";
  if (["giftable", "new arrival"].includes(v)) return "occasion";
  if (["bundle", "limited time"].includes(v)) return "commercial";
  return "context";
}

function tagVariantClasses(tag: QuickTag, idx: number) {
  const palette = [
    {
      bg: "bg-[#F3EFF6]",
      border: "border-[#DCC8F0]",
      text: "text-primary",
    },
    {
      bg: "bg-[#EEF8FF]",
      border: "border-[#C9E8FF]",
      text: "text-[#0060A6]",
    },
    {
      bg: "bg-[#ECFDF3]",
      border: "border-[#B7F0CE]",
      text: "text-[#0F6A3F]",
    },
    {
      bg: "bg-[#FFF7ED]",
      border: "border-[#FFD8AE]",
      text: "text-[#8A3B00]",
    },
    {
      bg: "bg-[#FEF2F2]",
      border: "border-[#FECACA]",
      text: "text-[#991B1B]",
    },
  ];

  const byType: Record<QuickTagType, number> = {
    season: 1,
    occasion: 2,
    commercial: 3,
    context: 4,
  };

  const pick = palette[(byType[tag.type] + idx) % palette.length];
  return `${pick.bg} ${pick.border} ${pick.text}`;
}

function seededTemplates(primaryNiche: string | null): ImageAdTemplate[] {
  const commonNiches = unique(
    [
      primaryNiche,
      "Beauty & Skincare",
      "Fashion & Apparel",
      "Home & Living",
      "Fitness & Sports",
      "Health & Wellness",
    ].filter(Boolean) as string[],
  );
  const nicheA = commonNiches[0] || "Beauty & Skincare";
  const nicheB = commonNiches[1] || "Home & Living";

  const templates: ImageAdTemplate[] = [
    {
      id: "img-testimonial-1",
      name: "Real results testimonial",
      theme: "Testimonials",
      benefit: "Build trust fast with social proof and outcomes.",
      niches: [nicheA, nicheB],
      platforms: ["Instagram", "Facebook"],
      format: "Carousel",
      tags: ["Giftable", "New arrival", "Limited time"],
      performanceScore: 92,
    },
    {
      id: "img-demo-1",
      name: "3-step product demo",
      theme: "Product Demo",
      benefit: "Show the product in action and reduce uncertainty.",
      niches: [nicheA],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Carousel",
      tags: ["Morning routine", "Outdoor"],
      performanceScore: 90,
    },
    {
      id: "img-beforeafter-1",
      name: "Before vs after transformation",
      theme: "Before / After",
      benefit: "Make the transformation obvious at a glance.",
      niches: [nicheA],
      platforms: ["Instagram", "Facebook"],
      format: "Carousel",
      tags: ["Summer", "Winter"],
      performanceScore: 89,
    },
    {
      id: "img-lifestyle-1",
      name: "Lifestyle routine story",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      niches: [nicheB, nicheA],
      platforms: ["Instagram"],
      format: "Static",
      tags: ["Morning routine"],
      performanceScore: 86,
    },
    {
      id: "img-unboxing-1",
      name: "Unboxing highlights",
      theme: "Unboxing",
      benefit: "Highlight packaging, quality, and first impressions.",
      niches: [nicheB, "Electronics & Gadgets"],
      platforms: ["Instagram", "Facebook"],
      format: "Carousel",
      tags: ["New arrival"],
      performanceScore: 84,
    },
    {
      id: "img-problemsolution-1",
      name: "Problem → solution hook",
      theme: "Problem → Solution",
      benefit: "Hook with a pain point, then reveal the fix.",
      niches: [nicheA, "Health & Wellness"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 91,
    },
    {
      id: "img-comparison-1",
      name: "Comparison grid",
      theme: "Comparison",
      benefit: "Differentiate with clear side-by-side value.",
      niches: [nicheB, nicheA],
      platforms: ["Facebook", "Google"],
      format: "Static",
      tags: ["Bundle"],
      performanceScore: 82,
    },
    {
      id: "img-offer-1",
      name: "Offer + urgency banner",
      theme: "Offers & Urgency",
      benefit: "Drive action with limited-time incentives.",
      niches: [nicheB, nicheA],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Limited time", "Bundle"],
      performanceScore: 80,
    },
    {
      id: "img-luxury-1",
      name: "Luxury macro focus",
      theme: "Luxury Macro",
      benefit: "Elevate perceived value with premium visuals.",
      niches: ["Jewelry & Accessories", "Beauty & Skincare"],
      platforms: ["Instagram"],
      format: "Static",
      tags: ["Giftable"],
      performanceScore: 78,
    },
    {
      id: "img-viral-1",
      name: "Fast cuts collage",
      theme: "Viral / Fast Cuts",
      benefit: "High energy patterns that stop the scroll.",
      niches: ["Fashion & Apparel", "Fitness & Sports"],
      platforms: ["Instagram"],
      format: "Carousel",
      tags: ["Summer"],
      performanceScore: 76,
    },
    {
      id: "img-ph-skincare-clear-skin",
      name: "Clear skin hero (clean, bright)",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: "/ad-presets/placeholders/skincare-cetaphil.jpg",
      niches: ["Beauty & Skincare", "Health & Wellness"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Morning routine"],
      performanceScore: 92,
    },
    {
      id: "img-ph-acne-no-chance",
      name: "Acne hook (problem → solution)",
      theme: "Problem → Solution",
      benefit: "Hook with a pain point, then reveal the fix.",
      previewImageUrl: "/ad-presets/placeholders/skincare-acne.jpg",
      niches: ["Beauty & Skincare", "Health & Wellness"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 93,
    },
    {
      id: "img-ph-hair-thicker",
      name: "Thicker hair claim (transformation)",
      theme: "Before / After",
      benefit: "Make the transformation obvious at a glance.",
      previewImageUrl: "/ad-presets/placeholders/wellness-hims-hair.jpg",
      niches: ["Health & Wellness", "Beauty & Skincare"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 90,
    },
    {
      id: "img-ph-vitamin-c-true-false",
      name: "Ingredient proof (true/false)",
      theme: "Comparison",
      benefit: "Differentiate with clear side-by-side value.",
      previewImageUrl: "/ad-presets/placeholders/skincare-vitamin-c.jpg",
      niches: ["Beauty & Skincare"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Bundle"],
      performanceScore: 88,
    },
    {
      id: "img-ph-ag1-energy-call",
      name: "Energy call screen (scroll stopper)",
      theme: "Viral / Fast Cuts",
      benefit: "High energy patterns that stop the scroll.",
      previewImageUrl: "/ad-presets/placeholders/supplements-ag1.jpg",
      niches: ["Health & Wellness", "Fitness & Sports"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 86,
    },
    {
      id: "img-ph-fashion-classic-winter",
      name: "Classic winter pieces",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: "/ad-presets/placeholders/fashion-classic-winter.jpg",
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Winter"],
      performanceScore: 88,
    },
    {
      id: "img-ph-fashion-winter-picks",
      name: "Winter fashion picks",
      theme: "Comparison",
      benefit: "Differentiate with clear side-by-side value.",
      previewImageUrl: "/ad-presets/placeholders/fashion-winter-picks.jpg",
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Winter", "Bundle"],
      performanceScore: 87,
    },
    {
      id: "img-ph-home-ikea-virgil",
      name: "Statement product hero (minimal)",
      theme: "Luxury Macro",
      benefit: "Elevate perceived value with premium visuals.",
      previewImageUrl: GOOGLE_DRIVE_PLACEHOLDER_IMAGE_1,
      niches: ["Home & Living"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 85,
    },
    {
      id: "img-ph-drive-placeholder-2",
      name: "Drive placeholder (portrait 2)",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: GOOGLE_DRIVE_PLACEHOLDER_IMAGE_2,
      niches: ["Fashion & Apparel", "Beauty & Skincare", "Home & Living"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 84,
    },
    {
      id: "img-ph-drive-placeholder-3",
      name: "Drive placeholder (portrait 3)",
      theme: "Luxury Macro",
      benefit: "Elevate perceived value with premium visuals.",
      previewImageUrl: GOOGLE_DRIVE_PLACEHOLDER_IMAGE_3,
      niches: ["Fashion & Apparel", "Beauty & Skincare", "Home & Living"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Giftable"],
      performanceScore: 84,
    },
    {
      id: "img-ph-shopify-placeholder-1",
      name: "Shopify CDN placeholder (portrait 1)",
      theme: "Product Demo",
      benefit: "Show the product in action and reduce uncertainty.",
      previewImageUrl: SHOPIFY_CDN_PLACEHOLDER_IMAGE_1,
      niches: ["Fashion & Apparel", "Beauty & Skincare", "Home & Living"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 84,
    },
    {
      id: "img-ph-fashion-shopify-1",
      name: "Fashion product hero (Shopify 1)",
      theme: "Luxury Macro",
      benefit: "Elevate perceived value with premium visuals.",
      previewImageUrl: SHOPIFY_FASHION_PLACEHOLDER_IMAGE_1,
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 86,
    },
    {
      id: "img-ph-fashion-shopify-2",
      name: "Lookbook scene (Shopify 2)",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: SHOPIFY_FASHION_PLACEHOLDER_IMAGE_2,
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Spring"],
      performanceScore: 85,
    },
    {
      id: "img-ph-fashion-shopify-3",
      name: "Outfit details (Shopify 3)",
      theme: "Product Demo",
      benefit: "Show the product in action and reduce uncertainty.",
      previewImageUrl: SHOPIFY_FASHION_PLACEHOLDER_IMAGE_3,
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Bundle"],
      performanceScore: 85,
    },
    {
      id: "img-ph-fashion-shopify-4",
      name: "Premium close-up (Shopify 4)",
      theme: "Luxury Macro",
      benefit: "Elevate perceived value with premium visuals.",
      previewImageUrl: SHOPIFY_FASHION_PLACEHOLDER_IMAGE_4,
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Giftable"],
      performanceScore: 86,
    },
    {
      id: "img-ph-fashion-shopify-5",
      name: "Try-on moment (Shopify 5)",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: SHOPIFY_FASHION_PLACEHOLDER_IMAGE_5,
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 85,
    },
    {
      id: "img-ph-fashion-shopify-6",
      name: "Collection grid vibe (Shopify 6)",
      theme: "Comparison",
      benefit: "Differentiate with clear side-by-side value.",
      previewImageUrl: SHOPIFY_FASHION_PLACEHOLDER_IMAGE_6,
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Bundle"],
      performanceScore: 84,
    },
    {
      id: "img-ph-fashion-shopify-7",
      name: "Streetwear angle (Shopify 7)",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: SHOPIFY_FASHION_PLACEHOLDER_IMAGE_7,
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Summer"],
      performanceScore: 85,
    },
    {
      id: "img-ph-fashion-shopify-8",
      name: "Offer spotlight (Shopify 8)",
      theme: "Offers & Urgency",
      benefit: "Drive action with limited-time incentives.",
      previewImageUrl: SHOPIFY_FASHION_PLACEHOLDER_IMAGE_8,
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 86,
    },
    {
      id: "img-ph-fashion-shopify-9",
      name: "Minimal hero shot (Shopify 9)",
      theme: "Product Demo",
      benefit: "Show the product in action and reduce uncertainty.",
      previewImageUrl: SHOPIFY_FASHION_PLACEHOLDER_IMAGE_9,
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 85,
    },
    {
      id: "img-ph-fashion-shopify-10",
      name: "Editorial portrait (Shopify 10)",
      theme: "Testimonials",
      benefit: "Build trust fast with social proof and outcomes.",
      previewImageUrl: SHOPIFY_FASHION_PLACEHOLDER_IMAGE_10,
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 84,
    },
    {
      id: "img-ph-beauty-shopify-1",
      name: "Skincare hero (Shopify 1)",
      theme: "Luxury Macro",
      benefit: "Elevate perceived value with premium visuals.",
      previewImageUrl: SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_1,
      niches: ["Beauty & Skincare"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 86,
    },
    {
      id: "img-ph-beauty-shopify-2",
      name: "Routine scene (Shopify 2)",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_2,
      niches: ["Beauty & Skincare"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Morning routine"],
      performanceScore: 85,
    },
    {
      id: "img-ph-beauty-shopify-3",
      name: "Problem → solution (Shopify 3)",
      theme: "Problem → Solution",
      benefit: "Hook with a pain point, then reveal the fix.",
      previewImageUrl: SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_3,
      niches: ["Beauty & Skincare"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 86,
    },
    {
      id: "img-ph-beauty-shopify-4",
      name: "Before / after framing (Shopify 4)",
      theme: "Before / After",
      benefit: "Make the transformation obvious at a glance.",
      previewImageUrl: SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_4,
      niches: ["Beauty & Skincare"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 85,
    },
    {
      id: "img-ph-beauty-shopify-5",
      name: "Ingredient proof (Shopify 5)",
      theme: "Comparison",
      benefit: "Differentiate with clear side-by-side value.",
      previewImageUrl: SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_5,
      niches: ["Beauty & Skincare"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Bundle"],
      performanceScore: 85,
    },
    {
      id: "img-ph-beauty-shopify-6",
      name: "Offer spotlight (Shopify 6)",
      theme: "Offers & Urgency",
      benefit: "Drive action with limited-time incentives.",
      previewImageUrl: SHOPIFY_BEAUTY_PLACEHOLDER_IMAGE_6,
      niches: ["Beauty & Skincare"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 86,
    },
    {
      id: "img-ph-home-shopify-1",
      name: "Home hero (Shopify 1)",
      theme: "Luxury Macro",
      benefit: "Elevate perceived value with premium visuals.",
      previewImageUrl: SHOPIFY_HOME_PLACEHOLDER_IMAGE_1,
      niches: ["Home & Living"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 85,
    },
    {
      id: "img-ph-home-shopify-2",
      name: "Home lifestyle scene (Shopify 2)",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: SHOPIFY_HOME_PLACEHOLDER_IMAGE_2,
      niches: ["Home & Living"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Spring"],
      performanceScore: 84,
    },
    {
      id: "img-ph-home-shopify-3",
      name: "Home product demo (Shopify 3)",
      theme: "Product Demo",
      benefit: "Show the product in action and reduce uncertainty.",
      previewImageUrl: SHOPIFY_HOME_PLACEHOLDER_IMAGE_3,
      niches: ["Home & Living"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Bundle"],
      performanceScore: 84,
    },
    {
      id: "img-ph-wellness-shopify-1",
      name: "Wellness hero (Shopify 1)",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: SHOPIFY_WELLNESS_PLACEHOLDER_IMAGE_1,
      niches: ["Health & Wellness"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Morning routine"],
      performanceScore: 85,
    },
    {
      id: "img-ph-wellness-shopify-2",
      name: "Wellness claim (Shopify 2)",
      theme: "Before / After",
      benefit: "Make the transformation obvious at a glance.",
      previewImageUrl: SHOPIFY_WELLNESS_PLACEHOLDER_IMAGE_2,
      niches: ["Health & Wellness"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 85,
    },
    {
      id: "img-ph-wellness-shopify-3",
      name: "Offer + urgency (Shopify 3)",
      theme: "Offers & Urgency",
      benefit: "Drive action with limited-time incentives.",
      previewImageUrl: SHOPIFY_WELLNESS_PLACEHOLDER_IMAGE_3,
      niches: ["Health & Wellness"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 85,
    },
    {
      id: "img-ph-jewelry-shopify-1",
      name: "Jewelry hero (Shopify 1)",
      theme: "Luxury Macro",
      benefit: "Elevate perceived value with premium visuals.",
      previewImageUrl: SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_1,
      niches: ["Jewelry & Accessories"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Giftable"],
      performanceScore: 86,
    },
    {
      id: "img-ph-jewelry-shopify-2",
      name: "Jewelry close-up (Shopify 2)",
      theme: "Luxury Macro",
      benefit: "Elevate perceived value with premium visuals.",
      previewImageUrl: SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_2,
      niches: ["Jewelry & Accessories"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Giftable"],
      performanceScore: 86,
    },
    {
      id: "img-ph-jewelry-shopify-3",
      name: "Jewelry collection (Shopify 3)",
      theme: "Comparison",
      benefit: "Differentiate with clear side-by-side value.",
      previewImageUrl: SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_3,
      niches: ["Jewelry & Accessories"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Bundle"],
      performanceScore: 84,
    },
    {
      id: "img-ph-jewelry-shopify-4",
      name: "Jewelry portrait (Shopify 4)",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_4,
      niches: ["Jewelry & Accessories"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 84,
    },
    {
      id: "img-ph-jewelry-shopify-5",
      name: "Jewelry offer (Shopify 5)",
      theme: "Offers & Urgency",
      benefit: "Drive action with limited-time incentives.",
      previewImageUrl: SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_5,
      niches: ["Jewelry & Accessories"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 85,
    },
    {
      id: "img-ph-jewelry-shopify-6",
      name: "Jewelry details (Shopify 6)",
      theme: "Product Demo",
      benefit: "Show the product in action and reduce uncertainty.",
      previewImageUrl: SHOPIFY_JEWELRY_PLACEHOLDER_IMAGE_6,
      niches: ["Jewelry & Accessories"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["New arrival"],
      performanceScore: 84,
    },
    {
      id: "img-ph-fashion-summer-collection",
      name: "Summer collection lookbook",
      theme: "Lifestyle Routine",
      benefit: "Help customers picture it in their daily life.",
      previewImageUrl: "/ad-presets/placeholders/fashion-summer-collection.jpg",
      niches: ["Fashion & Apparel", "Travel & Outdoor"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Summer", "New arrival"],
      performanceScore: 86,
    },
    {
      id: "img-ph-fashion-black-friday-sale",
      name: "Black Friday offer",
      theme: "Offers & Urgency",
      benefit: "Drive action with limited-time incentives.",
      previewImageUrl: "/ad-presets/placeholders/fashion-black-friday-sale.jpg",
      niches: ["Fashion & Apparel", "Gifts & Occasions"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 90,
    },
    {
      id: "img-ph-fashion-new-minimal",
      name: "New minimal collection",
      theme: "Luxury Macro",
      benefit: "Elevate perceived value with premium visuals.",
      previewImageUrl: "/ad-presets/placeholders/fashion-new-minimal.jpg",
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Spring", "New arrival"],
      performanceScore: 86,
    },
    {
      id: "img-ph-fashion-payday-sale",
      name: "Payday sale",
      theme: "Offers & Urgency",
      benefit: "Drive action with limited-time incentives.",
      previewImageUrl: "/ad-presets/placeholders/fashion-payday-sale.jpg",
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 88,
    },
    {
      id: "img-ph-fashion-black-friday-suits",
      name: "Black Friday (suits)",
      theme: "Offers & Urgency",
      benefit: "Drive action with limited-time incentives.",
      previewImageUrl: "/ad-presets/placeholders/fashion-black-friday-suits.jpg",
      niches: ["Fashion & Apparel", "Gifts & Occasions"],
      platforms: ["Instagram", "Facebook", "Google"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 90,
    },
    {
      id: "img-ph-fashion-friends-family-event",
      name: "Friends & family event",
      theme: "Testimonials",
      benefit: "Build trust fast with social proof and outcomes.",
      previewImageUrl: "/ad-presets/placeholders/fashion-friends-family-event.jpg",
      niches: ["Fashion & Apparel", "Gifts & Occasions"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Limited time"],
      performanceScore: 87,
    },
    {
      id: "img-ph-fashion-linen-shirt",
      name: "How to wear (styling guide)",
      theme: "Product Demo",
      benefit: "Show the product in action and reduce uncertainty.",
      previewImageUrl: "/ad-presets/placeholders/fashion-linen-shirt.jpg",
      niches: ["Fashion & Apparel"],
      platforms: ["Instagram", "Facebook"],
      format: "Static",
      tags: ["Morning routine"],
      performanceScore: 84,
    },
  ];

  return templates.map((t, idx) => {
    const shopifyPreview = isShopifyCdnUrl(t.previewImageUrl)
      ? t.previewImageUrl
      : undefined;

    return {
      ...t,
      previewImageUrl:
        shopifyPreview ||
        PLACEHOLDER_PREVIEW_IMAGES[idx % PLACEHOLDER_PREVIEW_IMAGES.length],
    };
  });
}

export function getSeededImageAdTemplates(primaryNiche: string | null) {
  return seededTemplates(primaryNiche);
}

function rankTemplates(args: {
  templates: ImageAdTemplate[];
  niche: string | null;
  theme: TemplateTheme | null;
  quickTags: QuickTag[];
  appliedQuickTagIds: string[];
}) {
  const { templates, niche, theme, quickTags, appliedQuickTagIds } = args;

  const appliedLabels = new Set(
    quickTags
      .filter((t) => appliedQuickTagIds.includes(t.id))
      .map((t) => t.label.toLowerCase()),
  );

  const score = (t: ImageAdTemplate) => {
    const nicheScore = niche ? (t.niches.includes(niche) ? 20 : 0) : 0;
    const themeScore = theme ? (t.theme === theme ? 12 : 0) : 0;
    const tagScore =
      appliedLabels.size === 0
        ? 0
        : t.tags.some((tg) => appliedLabels.has(tg.toLowerCase()))
          ? 10
          : 0;
    return t.performanceScore + nicheScore + themeScore + tagScore;
  };

  return [...templates].sort((a, b) => score(b) - score(a));
}

function applyQuickTagNarrowing(args: {
  templates: ImageAdTemplate[];
  quickTags: QuickTag[];
  appliedQuickTagIds: string[];
}) {
  const { templates, quickTags, appliedQuickTagIds } = args;

  if (!appliedQuickTagIds.length) return templates;

  const appliedLabels = new Set(
    quickTags
      .filter((t) => appliedQuickTagIds.includes(t.id))
      .map((t) => t.label.toLowerCase()),
  );

  const matches = templates.filter((t) =>
    t.tags.some((tg) => appliedLabels.has(tg.toLowerCase())),
  );

  return matches.length ? matches : templates;
}

export default function ImageAdsTemplatesBrowser({
  product,
  selectedTemplateIds,
  onToggleTemplateId,
  embedded = false,
}: {
  product: ShopifyProduct["node"];
  selectedTemplateIds: string[];
  onToggleTemplateId: (templateId: string) => void;
  embedded?: boolean;
}) {
  const primaryNiche = useMemo(() => derivePrimaryNiche(product), [product]);

  const [niche, setNiche] = useState<string | null>(null);
  const [theme, setTheme] = useState<TemplateTheme | null>(null);
  const [appliedQuickTagIds, setAppliedQuickTagIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = safeJsonParse<{
      niche: string | null;
      theme: TemplateTheme | null;
      appliedQuickTagIds: string[];
    }>(
      typeof window === "undefined" ? null : localStorage.getItem(STORAGE_KEY),
      { niche: null, theme: null, appliedQuickTagIds: [] },
    );

    setNiche(stored.niche ?? null);
    setTheme(stored.theme ?? null);
    setAppliedQuickTagIds(stored.appliedQuickTagIds ?? []);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ niche, theme, appliedQuickTagIds }),
    );
  }, [niche, theme, appliedQuickTagIds]);

  const generatedQuickTags = useMemo(() => generateQuickTags(product), [product]);

  const templates = useMemo(() => seededTemplates(primaryNiche), [primaryNiche]);

  const filteredTemplates = useMemo(() => {
    return templates
      .filter((t) => (niche ? t.niches.includes(niche) : true))
      .filter((t) => (theme ? t.theme === theme : true));
  }, [templates, niche, theme]);

  const smartTags = useMemo(() => {
    const labels = unique(
      filteredTemplates.flatMap((t) => t.tags).filter(Boolean),
    );

    const fromTemplates: QuickTag[] = labels.map((label) => {
      const type = tagTypeFromLabel(label);
      return { id: `${type}-${slugify(label)}`, label, type };
    });

    const merged = unique([
      ...generatedQuickTags.map((t) => t.label),
      ...fromTemplates.map((t) => t.label),
    ]).map((label) => {
      const type = tagTypeFromLabel(label);
      return { id: `${type}-${slugify(label)}`, label, type };
    });

    const ranked = [...merged].sort((a, b) => {
      const w = (t: QuickTag) =>
        t.type === "season"
          ? 4
          : t.type === "commercial"
            ? 3
            : t.type === "occasion"
              ? 2
              : 1;
      return w(b) - w(a);
    });

    return ranked;
  }, [filteredTemplates, generatedQuickTags]);

  const showSmartTags = Boolean((niche || theme) && smartTags.length > 0);

  const clearFilters = () => {
    setNiche(null);
    setTheme(null);
    setAppliedQuickTagIds([]);
  };

  const rankedTemplates = useMemo(() => {
    const narrowed = applyQuickTagNarrowing({
      templates: filteredTemplates,
      quickTags: smartTags,
      appliedQuickTagIds,
    });

    return rankTemplates({
      templates: narrowed,
      niche,
      theme,
      quickTags: smartTags,
      appliedQuickTagIds,
    });
  }, [filteredTemplates, smartTags, appliedQuickTagIds, niche, theme]);

  const TemplateCard = ({ t }: { t: ImageAdTemplate }) => {
    const selectedIndex = selectedTemplateIds.findIndex((id) => id === t.id);
    const isSelected = selectedIndex >= 0;
    const previewUrl = isShopifyCdnUrl(t.previewImageUrl)
      ? t.previewImageUrl
      : undefined;

    return (
      <button
        className={`relative rounded-3xl overflow-hidden border aspect-[9/16] w-full transition-all ${
          isSelected
            ? "border-purple-600 ring-2 ring-purple-600 shadow-[0_0_0_2px_rgba(104,0,215,0.12),0_0_18px_rgba(104,0,215,0.12)]"
            : "border-[rgba(0,0,0,0.06)]"
        } bg-[#F3EFF6]`}
        onClick={(e) => {
          e.preventDefault();
          onToggleTemplateId(t.id);
        }}
      >
        <div className="absolute inset-0 bg-[#F3EFF6]" />

        {previewUrl ? (
          <img
            src={previewUrl}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-[rgba(0,0,0,0.25)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[rgba(0,0,0,0.85)] to-transparent" />

        <div className="absolute top-3 right-3">
          {isSelected && (
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-semibold flex items-center justify-center shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
              {selectedIndex + 1}
            </div>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-white text-sm font-semibold tracking-100">
            {t.name}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      className={
        embedded
          ? ""
          : "bg-[#FBFAFC] md:bg-white rounded-3xl custom-shadow-sm p-6"
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <SelectInput
            options={ALL_NICHES}
            label="Niche"
            placeholder={primaryNiche ? `Suggested: ${primaryNiche}` : "Select niche"}
            selected={niche}
            setSelected={(v: string) => setNiche(v)}
            background="#ffffff"
          />
          <SelectInput
            options={THEMES.map((t) => t.name)}
            label="Theme"
            placeholder="Select theme"
            selected={theme}
            setSelected={(v: string) => setTheme(v as TemplateTheme)}
            background="#ffffff"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-neutral-light">
            Filtering{niche ? ` • ${niche}` : ""}{theme ? ` • ${theme}` : ""}
          </div>
          <div className="text-xs text-neutral-light">
            Selected {selectedTemplateIds.length}/5
          </div>
          <button
            className="text-xs text-purple-600 font-medium"
            onClick={(e) => {
              e.preventDefault();
              clearFilters();
            }}
          >
            Clear
          </button>
        </div>

        {showSmartTags && (
          <div>
            <div className="text-xs tracking-tight block">Quick Filters</div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-2 pink-scroll">
              {smartTags.map((t, idx) => {
                const active = appliedQuickTagIds.includes(t.id);
                const variant = tagVariantClasses(t, idx);
                return (
                  <button
                    key={t.id}
                    className={`h-[36px] px-4 rounded-xl border text-sm font-medium flex-shrink-0 ${
                      active
                        ? "bg-purple-600 border-purple-600 text-white"
                        : `bg-white ${variant}`
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setAppliedQuickTagIds((prev) =>
                        prev.includes(t.id)
                          ? prev.filter((x) => x !== t.id)
                          : [...prev, t.id],
                      );
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {rankedTemplates.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-input-border p-6">
          <div className="text-sm font-medium text-heading">
            No templates match your selection
          </div>
          <div className="mt-2 text-xs text-neutral-light">
            Try clearing the niche or removing quick tags.
          </div>
          <div className="mt-4 w-[180px]">
            <Button
              text="Clear filters"
              secondary
              action={() => clearFilters()}
            />
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {rankedTemplates.map((t) => (
            <TemplateCard key={t.id} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
