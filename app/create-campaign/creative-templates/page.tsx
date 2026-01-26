"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowCircleRight2, Edit2 } from "iconsax-react";
import Button from "@/app/ui/Button";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { ShopifyProduct } from "@/type";
import AdLibrary from "@/app/ui/dashboard/AdLibrary";

type Niche =
  | "fashion"
  | "skincare"
  | "beauty"
  | "accessories"
  | "home"
  | "electronics"
  | "fitness"
  | "food"
  | "digital"
  | "pets"
  | "kids"
  | "tools"
  | "lifestyle";

type CreativeDirectionId =
  | "problem_solution"
  | "identity"
  | "comparison"
  | "emotional"
  | "functional"
  | "social_proof"
  | "offer_promo";

type CreativeDirection = {
  id: CreativeDirectionId;
  label: string;
  description: string;
  bestFor: string;
};

type ScriptDraft = {
  video: string[];
  images: string[];
};

type IcpId = string;

type Icp = {
  id: IcpId;
  label: string;
  description: string;
};

const ICP_BY_NICHE: Record<Niche, Icp[]> = {
  fashion: [
    { id: "fashion_everyday_wearer", label: "Everyday wearer", description: "Role-based ICP." },
    { id: "fashion_work_office_wearer", label: "Work / office wearer", description: "Role-based ICP." },
    { id: "fashion_occasion_event_buyer", label: "Occasion / event buyer", description: "Role-based ICP." },
    { id: "fashion_trend_focused_shopper", label: "Trend-focused shopper", description: "Role-based ICP." },
    { id: "fashion_comfort_first_wearer", label: "Comfort-first wearer", description: "Role-based ICP." },
    { id: "fashion_gift_buyer", label: "Gift buyer", description: "Role-based ICP." },
  ],
  beauty: [
    { id: "beauty_daily_makeup_user", label: "Daily makeup user", description: "Role-based ICP." },
    { id: "beauty_occasion_glam_user", label: "Occasion / glam user", description: "Role-based ICP." },
    { id: "beauty_beginner_learning_user", label: "Beginner / learning user", description: "Role-based ICP." },
    { id: "beauty_routine_focused_user", label: "Routine-focused user", description: "Role-based ICP." },
    { id: "beauty_gift_buyer", label: "Gift buyer", description: "Role-based ICP." },
  ],
  skincare: [
    {
      id: "skincare_daily_routine_user",
      label: "Daily routine user",
      description:
        "Uses skincare consistently as part of their everyday routine. Focuses on ease, comfort, and repeat use.",
    },
    {
      id: "skincare_minimal_routine_user",
      label: "Minimal routine user",
      description:
        "Prefers simple routines with fewer products. Values lightweight, no-fuss solutions.",
    },
    {
      id: "skincare_self_care_focused_user",
      label: "Self-care focused user",
      description:
        "Uses skincare as a personal ritual or moment of care. Values how the product feels and fits into downtime.",
    },
    {
      id: "skincare_first_time_skincare_user",
      label: "First-time skincare user",
      description:
        "New to skincare or trying a new category for the first time. Needs clarity, reassurance, and simplicity.",
    },
    {
      id: "skincare_maintenance_user",
      label: "Maintenance user",
      description:
        "Already has a routine and wants to maintain healthy-looking skin. Values consistency over dramatic change.",
    },
    {
      id: "skincare_occasional_event_user",
      label: "Occasional / event user",
      description:
        "Uses skincare ahead of special occasions or outings. Values quick prep and polished results.",
    },
    {
      id: "skincare_gift_buyer",
      label: "Gift buyer",
      description:
        "Buying skincare for someone else. Values presentation, safety, and broad appeal.",
    },
  ],
  accessories: [
    { id: "accessories_everyday_use", label: "Everyday use", description: "Role-based ICP." },
    { id: "accessories_style_upgrade_user", label: "Style upgrade user", description: "Role-based ICP." },
    { id: "accessories_functional_utility_user", label: "Functional / utility user", description: "Role-based ICP." },
    {
      id: "accessories_car_home_owner",
      label: "Car / home owner (for mats, organizers)",
      description: "Role-based ICP.",
    },
    { id: "accessories_gift_buyer", label: "Gift buyer", description: "Role-based ICP." },
    { id: "accessories_enthusiast_collector", label: "Enthusiast / collector", description: "Role-based ICP." },
  ],
  home: [
    { id: "home_everyday_home_user", label: "Everyday home user", description: "Role-based ICP." },
    { id: "home_home_improver", label: "Home improver", description: "Role-based ICP." },
    { id: "home_new_homeowner", label: "New homeowner", description: "Role-based ICP." },
    { id: "home_decor_focused_buyer", label: "Decor-focused buyer", description: "Role-based ICP." },
    { id: "home_practical_utility_user", label: "Practical / utility user", description: "Role-based ICP." },
    { id: "home_gift_buyer", label: "Gift buyer", description: "Role-based ICP." },
  ],
  electronics: [
    { id: "electronics_everyday_user", label: "Everyday user", description: "Role-based ICP." },
    { id: "electronics_tech_savvy_user", label: "Tech-savvy user", description: "Role-based ICP." },
    { id: "electronics_work_productivity_user", label: "Work / productivity user", description: "Role-based ICP." },
    { id: "electronics_home_setup_user", label: "Home setup user", description: "Role-based ICP." },
    { id: "electronics_upgrader_replacement_buyer", label: "Upgrader / replacement buyer", description: "Role-based ICP." },
    { id: "electronics_gift_buyer", label: "Gift buyer", description: "Role-based ICP." },
  ],
  fitness: [
    { id: "fitness_everyday_fitness_user", label: "Everyday fitness user", description: "Role-based ICP." },
    { id: "fitness_beginner_starting_out", label: "Beginner / starting out", description: "Role-based ICP." },
    { id: "fitness_home_workout_user", label: "Home workout user", description: "Role-based ICP." },
    { id: "fitness_routine_builder", label: "Routine builder", description: "Role-based ICP." },
    { id: "fitness_gift_buyer", label: "Gift buyer", description: "Role-based ICP." },
  ],
  food: [
    { id: "food_everyday_consumer", label: "Everyday consumer", description: "Role-based ICP." },
    { id: "food_health_conscious_eater", label: "Health-conscious eater", description: "Role-based ICP." },
    { id: "food_convenience_focused_buyer", label: "Convenience-focused buyer", description: "Role-based ICP." },
    { id: "food_entertaining_hosting_buyer", label: "Entertaining / hosting buyer", description: "Role-based ICP." },
    { id: "food_gift_buyer", label: "Gift buyer", description: "Role-based ICP." },
  ],
  pets: [
    { id: "pets_everyday_pet_owner", label: "Everyday pet owner", description: "Role-based ICP." },
    { id: "pets_new_pet_owner", label: "New pet owner", description: "Role-based ICP." },
    { id: "pets_pet_care_focused_owner", label: "Pet care focused owner", description: "Role-based ICP." },
    { id: "pets_treat_reward_buyer", label: "Treat / reward buyer", description: "Role-based ICP." },
    { id: "pets_gift_buyer_for_pet_owners", label: "Gift buyer (for pet owners)", description: "Role-based ICP." },
  ],
  kids: [
    { id: "kids_everyday_parent_use", label: "Everyday parent use", description: "Role-based ICP." },
    { id: "kids_new_parent", label: "New parent", description: "Role-based ICP." },
    { id: "kids_safety_focused_parent", label: "Safety-focused parent", description: "Role-based ICP." },
    { id: "kids_convenience_focused_parent", label: "Convenience-focused parent", description: "Role-based ICP." },
    { id: "kids_gift_buyer", label: "Gift buyer", description: "Role-based ICP." },
  ],
  digital: [
    { id: "digital_individual_user", label: "Individual user", description: "Role-based ICP." },
    { id: "digital_small_business_owner", label: "Small business owner", description: "Role-based ICP." },
    { id: "digital_team_collaboration_user", label: "Team / collaboration user", description: "Role-based ICP." },
    { id: "digital_beginner_user", label: "Beginner user", description: "Role-based ICP." },
    { id: "digital_power_user", label: "Power user", description: "Role-based ICP." },
  ],
  tools: [
    { id: "tools_professional_tradesperson", label: "Professional tradesperson", description: "Role-based ICP." },
    { id: "tools_home_diy_user", label: "Home / DIY user", description: "Role-based ICP." },
    { id: "tools_weekend_project_user", label: "Weekend project user", description: "Role-based ICP." },
    { id: "tools_heavy_use_user", label: "Heavy-use user", description: "Role-based ICP." },
    { id: "tools_gift_buyer", label: "Gift buyer", description: "Role-based ICP." },
  ],
  lifestyle: [
    { id: "lifestyle_everyday_lifestyle_user", label: "Everyday lifestyle user", description: "Role-based ICP." },
    { id: "lifestyle_experience_focused_buyer", label: "Experience-focused buyer", description: "Role-based ICP." },
    { id: "lifestyle_practical_utility_user", label: "Practical / utility user", description: "Role-based ICP." },
    { id: "lifestyle_trend_explorer", label: "Trend explorer", description: "Role-based ICP." },
    { id: "lifestyle_gift_buyer", label: "Gift buyer", description: "Role-based ICP." },
  ],
};

const ALL_ICPS: Icp[] = Object.values(ICP_BY_NICHE).flat();
const ICP_BY_ID = new Map<IcpId, Icp>(ALL_ICPS.map((x) => [x.id, x] as const));

const CREATIVE_DIRECTIONS: CreativeDirection[] = [
  {
    id: "problem_solution",
    label: "Problem",
    description:
      "Calls out a common frustration your customer has, then shows how the product fixes it quickly and clearly.",
    bestFor: "Best for grabbing attention and driving conversions.",
  },
  {
    id: "identity",
    label: "Identity",
    description:
      "Speaks to who the customer sees themselves as and what they value. Makes the product feel like a reflection of their lifestyle or taste.",
    bestFor: "Best for fashion, lifestyle, and brand-led products.",
  },
  {
    id: "comparison",
    label: "Comparison",
    description:
      "Shows the difference between generic alternatives and your product. Helps shoppers understand why this option is better without heavy claims.",
    bestFor: "Best for competitive or crowded categories.",
  },
  {
    id: "emotional",
    label: "Emotional",
    description:
      "Focuses on how the product makes someone feel — pride, confidence, joy, or uniqueness. Less about features, more about connection.",
    bestFor: "Best for premium, cultural, or expressive brands.",
  },
  {
    id: "functional",
    label: "Functional",
    description:
      "Highlights practical benefits and how the product performs day-to-day. Clear, straightforward, and easy to understand.",
    bestFor: "Best for conversion-focused campaigns.",
  },
  {
    id: "social_proof",
    label: "Social Proof",
    description:
      "Uses popularity or adoption cues to build trust. Signals that other people already love and use the product.",
    bestFor: "Best for reducing hesitation and increasing confidence.",
  },
  {
    id: "offer_promo",
    label: "Offer / Promo",
    description:
      "Frames the product around a compelling offer, bundle, or urgency hook while staying placement-safe.",
    bestFor: "Best for promos, launches, and limited-time pushes.",
  },
];

const DEFAULT_RECOMMENDATION = {
  angles: [
    "functional",
    "problem_solution",
    "social_proof",
  ] as CreativeDirectionId[],
  videos: 1,
  images: 2,
};

const RECOMMENDED_DIRECTIONS_BY_NICHE: Record<Niche, CreativeDirectionId[]> = {
  fashion: ["identity", "emotional", "social_proof"],
  skincare: ["functional", "social_proof", "problem_solution"],
  beauty: ["emotional", "social_proof", "functional"],
  accessories: ["identity", "comparison", "social_proof"],
  home: ["problem_solution", "functional", "social_proof"],
  electronics: ["comparison", "functional", "problem_solution"],
  fitness: ["functional", "social_proof", "offer_promo"],
  food: ["emotional", "social_proof", "offer_promo"],
  digital: ["problem_solution", "comparison", "functional"],
  pets: ["emotional", "social_proof", "functional"],
  kids: ["problem_solution", "functional", "social_proof"],
  tools: ["functional", "problem_solution", "comparison"],
  lifestyle: ["identity", "emotional", "social_proof"],
};

const ASSET_COUNTS_BY_NICHE: Record<Niche, { videos: number; images: number }> = {
  fashion: { videos: 2, images: 2 },
  skincare: { videos: 1, images: 3 },
  beauty: { videos: 2, images: 2 },
  accessories: { videos: 1, images: 3 },
  home: { videos: 1, images: 2 },
  electronics: { videos: 2, images: 1 },
  food: { videos: 2, images: 2 },
  digital: { videos: 2, images: 1 },
  pets: { videos: 2, images: 2 },
  fitness: { videos: 1, images: 1 },
  kids: { videos: 1, images: 1 },
  tools: { videos: 1, images: 2 },
  lifestyle: { videos: 1, images: 2 },
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const normalize = (value: string) => value.toLowerCase().trim();

const detectNiche = (product?: ShopifyProduct): Niche | null => {
  if (!product?.node) return null;

  const title = normalize(product?.node?.title || "");
  const type = normalize(product?.node?.productType || "");
  const tags = (product?.node?.tags || []).map(normalize);
  const haystack = [title, type, ...tags].filter(Boolean).join(" ");

  const hasAny = (words: string[]) => words.some((w) => haystack.includes(w));

  if (hasAny(["skin", "skincare", "serum", "moistur", "cleanser"])) return "skincare";
  if (hasAny(["beauty", "makeup", "lipstick", "mascara", "foundation"])) return "beauty";
  if (
    hasAny([
      "fashion",
      "apparel",
      "clothing",
      "dress",
      "shirt",
      "hoodie",
      "jacket",
      "pants",
      "jeans",
      "shoes",
      "sneaker",
    ])
  )
    return "fashion";
  if (hasAny(["accessor", "jewelry", "jewel", "bag", "handbag", "watch", "belt"]))
    return "accessories";
  if (hasAny(["home", "decor", "furniture", "kitchen", "bedding", "sofa", "lamp"]))
    return "home";
  if (hasAny(["electronic", "gadget", "phone", "laptop", "charger", "headphone"]))
    return "electronics";
  if (hasAny(["fitness", "workout", "gym", "protein", "supplement", "preworkout"]))
    return "fitness";
  if (hasAny(["food", "snack", "coffee", "tea", "chocolate", "meal", "sauce"]))
    return "food";
  if (hasAny(["digital", "ebook", "course", "template", "software", "download"]))
    return "digital";
  if (hasAny(["pet", "dog", "cat", "puppy", "kitten"])) return "pets";
  if (hasAny(["kid", "kids", "baby", "toddler", "toy", "children"])) return "kids";

  if (hasAny(["tool", "tools", "hardware", "drill", "wrench", "hammer", "screw", "saw", "toolkit"]))
    return "tools";
  if (hasAny(["lifestyle", "general merchandise", "essentials", "everyday essentials", "variety"]))
    return "lifestyle";

  return null;
};

const getCreativeDirections = (): CreativeDirection[] => CREATIVE_DIRECTIONS;

const mapDirectionToAdLibraryCreativeDirection = (
  id: CreativeDirectionId
): string | null => {
  switch (id) {
    case "problem_solution":
      return "Problem → Solution";
    case "identity":
      return "Unboxing Experience";
    case "comparison":
      return "Comparison";
    case "emotional":
      return "Customer Story";
    case "functional":
      return "Product Demo";
    case "social_proof":
      return "Customer Story";
    case "offer_promo":
      return "Seasonal / Promo";
    default:
      return null;
  }
};

const buildRecommendation = (niche: Niche | null, directions: CreativeDirection[]) => {
  const available = new Set(directions.map((d) => d.id));

  if (!niche) {
    const safeDefaultAngles = DEFAULT_RECOMMENDATION.angles.filter((a) => available.has(a));
    const fallbackAngles = safeDefaultAngles.length
      ? safeDefaultAngles
      : directions.slice(0, 3).map((a) => a.id);

    return {
      niche: null as Niche | null,
      recommendedAngles: fallbackAngles.slice(0, 3),
      videos: DEFAULT_RECOMMENDATION.videos,
      images: DEFAULT_RECOMMENDATION.images,
    };
  }

  const ordered = RECOMMENDED_DIRECTIONS_BY_NICHE[niche].filter((a) => available.has(a));
  const counts = ASSET_COUNTS_BY_NICHE[niche];
  const recommendedAngles = ordered.length
    ? ordered.slice(0, 3)
    : directions.slice(0, 3).map((a) => a.id);

  return {
    niche,
    recommendedAngles,
    videos: counts.videos,
    images: counts.images,
  };
};

const regenerateAngles = (directions: CreativeDirection[], current: CreativeDirectionId[]) => {
  const safe = directions.map((a) => a.id);
  if (safe.length <= 1) return current;

  const remaining = safe.filter((a) => !current.includes(a));
  if (!remaining.length) return current;

  const shuffled = [...remaining].sort(() => Math.random() - 0.5);
  const next = [...current];
  while (next.length < 3 && shuffled.length) {
    next.push(shuffled.shift() as CreativeDirectionId);
  }

  return next.slice(0, 3);
};

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const directionLabel = (id: CreativeDirectionId) =>
  CREATIVE_DIRECTIONS.find((a) => a.id === id)?.label || id;

const buildScripts = ({
  product,
  niche,
  angles,
  icps,
  videos,
  images,
  videoSeed,
  imageSeeds,
}: {
  product?: ShopifyProduct;
  niche: Niche | null;
  angles: CreativeDirectionId[];
  icps: IcpId[];
  videos: number;
  images: number;
  videoSeed?: number;
  imageSeeds?: Record<number, number>;
}): ScriptDraft => {
  const productName = product?.node?.title || "your product";
  const productType = product?.node?.productType || product?.node?.category?.name || "";
  const benefitSeed = product?.node?.tags?.[0] || "a better everyday experience";
  const audienceSeed = niche ? `for ${niche} shoppers` : "for your audience";

  const seed = typeof videoSeed === "number" ? videoSeed : 0;
  const pick = <T,>(idx: number, options: T[]) => {
    if (!options.length) return undefined as unknown as T;
    return options[(idx + seed) % options.length];
  };

  const directionPillar = (id: CreativeDirectionId) => {
    switch (id) {
      case "problem_solution":
        return "Problem";
      case "identity":
        return "Identity";
      case "comparison":
        return "Comparison";
      case "emotional":
        return "Emotional";
      case "functional":
        return "Functional";
      case "social_proof":
        return "Social Proof";
      case "offer_promo":
        return "Offer / Promo";
      default:
        return id;
    }
  };

  const buildBundle = (id: CreativeDirectionId, idx: number) => {
    const pillar = directionPillar(id);
    switch (id) {
      case "problem_solution":
        return {
          hook: `“Still dealing with ${benefitSeed}?”`,
          visual: `Show the frustration → quick reveal of ${productName} in use`,
          overlay: `${productName} fixes it in seconds.`,
          headline: `Stop settling for ${benefitSeed}.`,
          subtext: `${productName}${productType ? ` • ${productType}` : ""}`, 
          ugc: `“I was tired of ${benefitSeed}… then I tried ${productName}.”`,
          idx,
          pillar,
        };
      case "identity":
        return {
          hook: `“This is so you.”`,
          visual: `Lifestyle shots that match the customer’s taste → ${productName} reveal`,
          overlay: `Made for your lifestyle.`,
          headline: `It’s not just ${productType || "a product"}.`,
          subtext: `It’s your identity.`,
          ugc: `“I love brands that feel like me — ${productName} nailed it.”`,
          idx,
          pillar,
        };
      case "comparison":
        return {
          hook: `“Here’s the difference.”`,
          visual: `Generic alternative vs ${productName} side-by-side`,
          overlay: `The upgrade is obvious.`,
          headline: `Don’t buy the generic version.`,
          subtext: `Choose ${productName} instead.`,
          ugc: `“I tried the cheaper option… ${productName} is just better.”`,
          idx,
          pillar,
        };
      case "emotional":
        return {
          hook: `“The confidence boost is real.”`,
          visual: `Before mood → after mood with ${productName}`,
          overlay: `Feel it instantly.`,
          headline: `Feel good every day.`,
          subtext: `${productName} — ${audienceSeed}`,
          ugc: `“This made me feel so confident — I’m obsessed.”`,
          idx,
          pillar,
        };
      case "functional":
        return {
          hook: `“Here’s what it actually does.”`,
          visual: `3 quick feature/benefit beats of ${productName} in use`,
          overlay: `Built for real life.`,
          headline: `${productName}, simplified.`,
          subtext: `Practical benefits you’ll notice fast.`,
          ugc: `“I use this every day — it just works.”`,
          idx,
          pillar,
        };
      case "social_proof":
        return {
          hook: `“Everyone’s switching to this.”`,
          visual: `Fast montage of happy use → reviews/ratings style text`,
          overlay: `Loved by customers.`,
          headline: `A customer favorite.`,
          subtext: `Trusted for a reason.`,
          ugc: `“I kept seeing this everywhere… now I get why.”`,
          idx,
          pillar,
        };
      case "offer_promo":
        return {
          hook: `“Don’t miss this deal.”`,
          visual: `${productName} hero shot → offer/bundle reveal`,
          overlay: `Limited-time offer.`,
          headline: `Save on ${productName}.`,
          subtext: `Limited time only.`,
          ugc: `“I grabbed it while it was on sale — so worth it.”`,
          idx,
          pillar,
        };
      default:
        return {
          hook: `“Meet ${productName}.”`,
          visual: `${productName} hero reveal`,
          overlay: `${productName}`,
          headline: `${productName}`,
          subtext: audienceSeed,
          ugc: `“Just tried ${productName} — wow.”`,
          idx,
          pillar,
        };
    }
  };

  const buildVideoScript = (idx: number) => {
    const selected = angles[idx % Math.max(angles.length, 1)] || "functional";
    const bundle = buildBundle(selected, idx);

    const pool = niche ? ICP_BY_NICHE[niche] : ALL_ICPS;
    const fallbackIcp = pool[0]?.id;
    const icp = icps.length ? icps[idx % icps.length] : fallbackIcp;
    const icpLabel = icp ? ICP_BY_ID.get(icp)?.label || "" : "";
    const icpHint = (() => {
      const label = icpLabel.toLowerCase();
      if (label.includes("gift")) return "Emphasize giftability, presentation, and broad appeal.";
      if (label.includes("first-time") || label.includes("beginner") || label.includes("new"))
        return "Use reassurance, clarity, and simple benefits.";
      if (label.includes("daily") || label.includes("everyday") || label.includes("routine"))
        return "Highlight ease, consistency, and repeat use.";
      if (label.includes("self-care") || label.includes("occasion") || label.includes("event"))
        return "Use emotional payoff, ritual, and confidence framing.";
      if (label.includes("work") || label.includes("office") || label.includes("productivity"))
        return "Focus on practicality and day-to-day utility.";
      if (label.includes("trend") || label.includes("style") || label.includes("decor"))
        return "Use identity, aesthetic, and lifestyle framing.";
      return "Keep it clear and benefit-led.";
    })();

    const hook = pick(idx, [bundle.hook, `“Meet ${productName}.”`]);
    const overlay = pick(idx + 1, [bundle.overlay, `${productName} • ${benefitSeed}`]);
    const ugc = pick(idx + 2, [bundle.ugc, `“I didn’t expect much… but ${productName} surprised me.”`]);

    return [
      `Creative direction: ${directionLabel(selected)}`,
      `Pillars used: ${bundle.pillar}`,
      icpLabel ? `ICP: ${icpLabel}` : "",
      icpHint ? `ICP note: ${icpHint}` : "",
      "",
      `Vertical Video ${idx + 1}`,
      `Hook (0–3s): ${hook}`,
      `Visual: ${bundle.visual}`,
      `Text overlay: ${overlay}`,
      "",
      `UGC Script: ${ugc}`,
      `CTA: Tap to shop ${productName}`,
    ].filter(Boolean).join("\n");
  };

  const buildImageCopy = (idx: number) => {
    const selected = angles[idx % Math.max(angles.length, 1)] || "functional";
    const bundle = buildBundle(selected, idx);

    const pool = niche ? ICP_BY_NICHE[niche] : ALL_ICPS;
    const fallbackIcp = pool[0]?.id;
    const icp = icps.length ? icps[idx % icps.length] : fallbackIcp;
    const icpLabel = icp ? ICP_BY_ID.get(icp)?.label || "" : "";

    const imageSeed = imageSeeds?.[idx] ?? 0;
    const pickImage = <T,>(j: number, options: T[]) => {
      if (!options.length) return undefined as unknown as T;
      return options[(j + imageSeed) % options.length];
    };
    const headline = pickImage(idx, [bundle.headline, `${productName} that actually works.`]);
    const subtext = pickImage(idx + 1, [bundle.subtext, `${productType || ""}`.trim() || audienceSeed]);
    const ugc = pickImage(idx + 2, [bundle.ugc, `“I didn’t expect to love this… but ${productName} is my new go-to.”`]);

    return [
      `Creative direction: ${directionLabel(selected)}`,
      `Pillars used: ${bundle.pillar}`,
      icpLabel ? `ICP: ${icpLabel}` : "",
      "",
      `Static ${idx + 1}`,
      `Headline: ${headline}`,
      `Subtext: ${subtext}`,
      "",
      `UGC Script: ${ugc}`,
      `CTA: Shop now`,
    ].filter(Boolean).join("\n");
  };

  const videoCount = clamp(videos, 0, 5);
  const imageCount = clamp(images, 0, 6);

  return {
    video: Array.from({ length: videoCount }, (_, i) => buildVideoScript(i)),
    images: Array.from({ length: imageCount }, (_, i) => buildImageCopy(i)),
  };
};

export default function CreativeTemplatesPage() {
  const router = useRouter();
  const { productSelection, supportedAdPlatforms } = useCreateCampaignStore(
    (state) => state
  );

  const [activeSection, setActiveSection] = useState<
    "direction" | "icp" | "script" | "templates"
  >("direction");

  const [isAnglesApproved, setIsAnglesApproved] = useState(false);
  const [isIcpApproved, setIsIcpApproved] = useState(false);
  const [isScriptApproved, setIsScriptApproved] = useState(false);

  const [editingDraftKey, setEditingDraftKey] = useState<string>("");
  const [draftBuffers, setDraftBuffers] = useState<Record<string, string>>({});
  const [draftOverrides, setDraftOverrides] = useState<Record<string, string>>({});

  const [videoRegenerateSeed, setVideoRegenerateSeed] = useState(0);
  const [imageRegenerateSeeds, setImageRegenerateSeeds] = useState<Record<number, number>>({});

  const [recommendedIcpIds, setRecommendedIcpIds] = useState<IcpId[]>([]);
  const [selectedIcpIds, setSelectedIcpIds] = useState<IcpId[]>([]);
  const [icpSelectionMessage, setIcpSelectionMessage] = useState<string>("");

  const [selectedTemplateIds, setSelectedTemplateIds] = useState<number[]>([]);
  const [templateSelectionCounts, setTemplateSelectionCounts] = useState<{
    videos: number;
    images: number;
  }>({ videos: 0, images: 0 });

  const primaryProduct = productSelection.products?.[0];

  const niche = useMemo(() => detectNiche(primaryProduct), [primaryProduct]);
  const creativeDirections = useMemo(() => getCreativeDirections(), []);

  const availableIcps = useMemo(() => {
    return niche ? ICP_BY_NICHE[niche] : ALL_ICPS;
  }, [niche]);

  const baseRecommendation = useMemo(
    () => buildRecommendation(niche, creativeDirections),
    [niche, creativeDirections]
  );

  const [recommendedIds, setRecommendedIds] = useState<CreativeDirectionId[]>(
    baseRecommendation.recommendedAngles
  );
  const [selectedIds, setSelectedIds] = useState<CreativeDirectionId[]>(
    baseRecommendation.recommendedAngles
  );
  const [videos, setVideos] = useState<number>(baseRecommendation.videos);
  const [images, setImages] = useState<number>(baseRecommendation.images);
  const [selectionMessage, setSelectionMessage] = useState<string>("");

  useEffect(() => {
    if (!productSelection.complete) {
      router.push("/create-campaign/");
      return;
    }

    if (!supportedAdPlatforms.complete) {
      router.push("/create-campaign/supported-ad-platforms");
    }
  }, [productSelection.complete, supportedAdPlatforms.complete, router]);

  useEffect(() => {
    setRecommendedIds(baseRecommendation.recommendedAngles);
    setSelectedIds(baseRecommendation.recommendedAngles);
    setVideos(baseRecommendation.videos);
    setImages(baseRecommendation.images);
    setActiveSection("direction");
    setIsAnglesApproved(false);
    setIsIcpApproved(false);
    setIsScriptApproved(false);
    setEditingDraftKey("");
    setDraftBuffers({});
    setDraftOverrides({});
    setSelectedTemplateIds([]);
    setVideoRegenerateSeed(0);
    setImageRegenerateSeeds({});
  }, [baseRecommendation]);

  const recommendIcps = (
    n: Niche | null,
    directions: CreativeDirectionId[],
    product?: ShopifyProduct
  ) => {
    if (!n) return [];

    const pool = ICP_BY_NICHE[n];
    const dirSet = new Set(directions);
    const title = normalize(
      [product?.node?.title, product?.node?.productType, ...(product?.node?.tags || [])]
        .filter(Boolean)
        .join(" ")
    );

    const tokens: string[] = [];
    if (dirSet.has("problem_solution")) tokens.push("first", "beginner", "new");
    if (dirSet.has("functional")) tokens.push("daily", "everyday", "routine", "practical", "utility");
    if (dirSet.has("emotional")) tokens.push("self-care", "experience", "occasion", "event");
    if (dirSet.has("identity")) tokens.push("trend", "style reminders", "style", "decor");
    if (dirSet.has("offer_promo")) tokens.push("gift", "occasion", "event");
    if (dirSet.has("comparison")) tokens.push("upgrader", "replacement", "collector", "power");
    if (title.includes("gift") || title.includes("present")) tokens.push("gift");
    if (title.includes("work") || title.includes("office")) tokens.push("work", "office");

    const score = (icp: Icp) => {
      const hay = normalize(`${icp.label} ${icp.description}`);
      let s = 0;
      for (const t of tokens) {
        const token = normalize(t);
        if (token && hay.includes(token)) s += 2;
      }
      if (hay.includes("gift")) s += 1;
      if (hay.includes("everyday") || hay.includes("daily") || hay.includes("routine")) s += 1;
      return s;
    };

    return [...pool]
      .map((icp) => ({ id: icp.id, score: score(icp) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((x) => x.id);
  };

  useEffect(() => {
    if (!niche) {
      setRecommendedIcpIds([]);
      setSelectedIcpIds([]);
      setIcpSelectionMessage("");
      return;
    }

    const next = recommendIcps(niche, selectedIds, primaryProduct);
    setRecommendedIcpIds(next);
    setSelectedIcpIds(next);
    setIcpSelectionMessage("");
  }, [primaryProduct, selectedIds, niche]);

  const handleBack = () => {
    if (activeSection === "templates") {
      setActiveSection("script");
      return;
    }

    if (activeSection === "script") {
      setActiveSection("icp");
      return;
    }

    if (activeSection === "icp") {
      setActiveSection("direction");
      return;
    }

    router.push("/create-campaign/supported-ad-platforms");
  };

  const handleApprove = () => {
    setIsAnglesApproved(true);
    setActiveSection("icp");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleApproveIcp = () => {
    setIsIcpApproved(true);
    setActiveSection("script");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleApproveScript = () => {
    setIsScriptApproved(true);
    setActiveSection("templates");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const isTemplatesSelectionComplete =
    templateSelectionCounts.videos >= videos && templateSelectionCounts.images >= images;

  const isAllStepsComplete =
    isAnglesApproved && isIcpApproved && isScriptApproved && isTemplatesSelectionComplete;

  const handleProceedFromTemplates = () => {
    if (!isAllStepsComplete) return;
    router.push("/create-campaign/campaign-snapshots");
  };

  const adLibraryDefaultNiche = useMemo(() => {
    if (!niche) return undefined;
    const map: Record<string, string> = {
      fashion: "Fashion & Apparel",
      skincare: "Beauty & Personal Care",
      beauty: "Beauty & Personal Care",
      accessories: "Jewelry & Accessories",
      home: "Home & Living",
      electronics: "Electronics & Tech",
      fitness: "Health & Wellness",
      food: "Food & Beverage",
      digital: "Digital Products",
      pets: "All",
      kids: "Baby & Kids",
      tools: "Home Improvement",
      lifestyle: "Household Essentials",
    };

    const mapped = map[niche];
    if (!mapped || mapped === "All") return undefined;
    return { niche: mapped };
  }, [niche]);

  const toggleAngle = (angleId: CreativeDirectionId) => {
    setSelectionMessage("");
    setSelectedIds((prev) => {
      if (prev.includes(angleId)) return prev.filter((x) => x !== angleId);
      if (prev.length >= 3) {
        setSelectionMessage("Select up to 3 creative directions.");
        return prev;
      }
      return [...prev, angleId];
    });
  };

  const safeAnglesById = useMemo(() => {
    const map = new Map<CreativeDirectionId, CreativeDirection>();
    creativeDirections.forEach((a) => map.set(a.id, a));
    return map;
  }, [creativeDirections]);

  const recommendedSafeAngles = useMemo(() => {
    const set = new Set(recommendedIds);
    return creativeDirections.filter((a) => set.has(a.id));
  }, [recommendedIds, creativeDirections]);

  const otherSafeAngles = useMemo(() => {
    const set = new Set(recommendedIds);
    return creativeDirections.filter((a) => !set.has(a.id));
  }, [recommendedIds, creativeDirections]);

  const recommendedCreativeDirectionFilters = useMemo(() => {
    const mapped = recommendedIds
      .map(mapDirectionToAdLibraryCreativeDirection)
      .filter(Boolean) as string[];
    return Array.from(new Set(mapped));
  }, [recommendedIds]);

  const scripts = useMemo(
    () =>
      buildScripts({
        product: primaryProduct,
        niche,
        angles: selectedIds,
        icps: selectedIcpIds,
        videos,
        images,
        videoSeed: videoRegenerateSeed,
        imageSeeds: imageRegenerateSeeds,
      }),
    [
      primaryProduct,
      niche,
      selectedIds,
      selectedIcpIds,
      videos,
      images,
      videoRegenerateSeed,
      imageRegenerateSeeds,
    ]
  );

  const toggleIcp = (icpId: IcpId) => {
    setIcpSelectionMessage("");
    setSelectedIcpIds((prev) => {
      if (prev.includes(icpId)) return prev.filter((x) => x !== icpId);
      if (prev.length >= 3) {
        setIcpSelectionMessage("Select up to 3 ICPs.");
        return prev;
      }
      return [...prev, icpId];
    });
  };

  const getDraftText = (key: string, fallback: string) =>
    typeof draftOverrides[key] === "string" ? draftOverrides[key] : fallback;

  const startEditingDraft = (key: string, currentText: string) => {
    setEditingDraftKey(key);
    setDraftBuffers((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "string" ? prev[key] : currentText,
    }));
  };

  const saveDraft = (key: string) => {
    const value = draftBuffers[key];
    if (typeof value !== "string") {
      setEditingDraftKey("");
      return;
    }

    setDraftOverrides((prev) => ({ ...prev, [key]: value }));
    setEditingDraftKey("");
  };

  const cancelEditingDraft = () => {
    setEditingDraftKey("");
  };

  const handleRegenerateVideoScripts = () => {
    setVideoRegenerateSeed((v) => v + 1);
    setEditingDraftKey((prev) => (prev.startsWith("video-") ? "" : prev));

    setDraftOverrides((prev) => {
      const next: Record<string, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        if (!key.startsWith("video-")) next[key] = value;
      });
      return next;
    });

    setDraftBuffers((prev) => {
      const next: Record<string, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        if (!key.startsWith("video-")) next[key] = value;
      });
      return next;
    });
  };

  const handleRegenerateImageDraft = (idx: number) => {
    const key = `image-${idx}`;
    setImageRegenerateSeeds((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));
    setEditingDraftKey((prev) => (prev === key ? "" : prev));

    setDraftOverrides((prev) => {
      if (typeof prev[key] !== "string") return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

    setDraftBuffers((prev) => {
      if (typeof prev[key] !== "string") return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleRegenerate = () => {
    const next = regenerateAngles(creativeDirections, recommendedIds);
    setRecommendedIds(next);
    setSelectedIds(next);
    setSelectionMessage("");
  };

  return (
    <div className="mt-6 pb-10">
      <div className="mb-6">
        <div className="text-purple-dark font-semibold text-xl">
          Choose how you want to sell this product
        </div>
        <div className="text-gray-500 text-sm mt-1">
          We’ll recommend multiple creative directions based on your product. Select up to 3.
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <details
          className="bg-[rgba(246,246,246,0.75)] rounded-3xl"
          open={activeSection === "direction"}
          onToggle={(e) => {
            const nextOpen = (e.target as HTMLDetailsElement).open;
            if (nextOpen) setActiveSection("direction");
          }}
        >
          <summary className="cursor-pointer list-none px-4 lg:px-6 py-4 flex items-center justify-between">
            <span className="text-purple-dark font-semibold">Creative direction</span>
            <span className="text-xs text-gray-500">
              {activeSection === "direction" ? "Collapse" : "Expand"}
            </span>
          </summary>

          <div className="px-4 lg:px-6 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
              <div>
                <div className="text-purple-dark font-semibold">Recommended creative direction</div>
                <div className="text-gray-500 text-sm">
                  {niche ? (
                    <span>
                      Based on your store niche: <span className="font-medium">{niche}</span>
                    </span>
                  ) : (
                    <span>We couldn’t detect your niche, so we used a safe default.</span>
                  )}
                </div>
              </div>

              <div className="sm:max-w-[220px] w-full">
                <Button
                  text="Regenerate creative direction"
                  secondary
                  action={handleRegenerate}
                />
              </div>
            </div>

            {selectionMessage ? (
              <div className="mb-3 text-xs text-[#C67B22] bg-[#FEF5EA] px-3 py-2 rounded-lg">
                {selectionMessage}
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendedSafeAngles.map((angle) => {
                const isSelected = selectedIds.includes(angle.id);
                const isRecommended = recommendedIds.includes(angle.id);

                return (
                  <button
                    key={angle.id}
                    type="button"
                    onClick={() => toggleAngle(angle.id)}
                    className={
                      "text-left border rounded-2xl p-4 transition-colors min-h-[110px] " +
                      (isSelected
                        ? "border-purple-dark bg-purple-dark"
                        : "border-[#F3EFF6] bg-white hover:bg-[#F9F7FB]")
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div
                          className={
                            "font-semibold text-sm truncate " +
                            (isSelected ? "text-white" : "text-purple-dark")
                          }
                        >
                          {angle.label}
                        </div>
                        <div
                          className={
                            "text-xs mt-1 line-clamp-2 " +
                            (isSelected ? "text-white/80" : "text-gray-500")
                          }
                        >
                          {angle.description}
                        </div>
                      </div>

                      {isRecommended ? (
                        <span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                          Recommended
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 text-xs">
                      <span
                        className={
                          "inline-block px-2 py-1 rounded-full border " +
                          (isSelected
                            ? "border-white text-white"
                            : "border-[#E6DCF0] text-gray-600")
                        }
                      >
                        {isSelected ? "Selected" : "Select"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <details className="group bg-white border border-[#F3EFF6] rounded-2xl px-4 py-3">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="text-purple-dark font-semibold text-sm">
                    More creative directions
                  </span>
                  <span className="text-xs text-gray-500 group-open:hidden">Expand</span>
                  <span className="text-xs text-gray-500 hidden group-open:block">Collapse</span>
                </summary>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {otherSafeAngles.map((angle) => {
                    const isSelected = selectedIds.includes(angle.id);
                    return (
                      <button
                        key={angle.id}
                        type="button"
                        onClick={() => toggleAngle(angle.id)}
                        className={
                          "text-left border rounded-2xl p-4 transition-colors " +
                          (isSelected
                            ? "border-purple-dark bg-purple-dark"
                            : "border-[#F3EFF6] bg-white hover:bg-[#F9F7FB]")
                        }
                      >
                        <div
                          className={
                            "font-semibold text-sm truncate " +
                            (isSelected ? "text-white" : "text-purple-dark")
                          }
                        >
                          {angle.label}
                        </div>
                        <div
                          className={
                            "text-xs mt-1 line-clamp-1 " +
                            (isSelected ? "text-white/80" : "text-gray-500")
                          }
                        >
                          {angle.description}
                        </div>
                        <div
                          className={
                            "text-[11px] mt-1 line-clamp-1 " +
                            (isSelected ? "text-white/80" : "text-gray-500")
                          }
                        >
                          {angle.bestFor}
                        </div>
                        <div className="mt-3 text-xs">
                          <span
                            className={
                              "inline-block px-2 py-1 rounded-full border " +
                              (isSelected
                                ? "border-white text-white"
                                : "border-[#E6DCF0] text-gray-600")
                            }
                          >
                            {isSelected ? "Selected" : "Select"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </details>
            </div>


            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white border border-[#F3EFF6] rounded-2xl p-4">
                <div className="text-purple-dark font-semibold mb-2">Recommended output</div>
                <div className="text-gray-500 text-xs mb-4">
                  Videos are 9:16, Images are 1:1 or 4:5
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between gap-3 border border-[#F3EFF6] rounded-xl px-3 py-2">
                    <div>
                      <div className="text-xs text-gray-500">Videos</div>
                      <div className="text-purple-dark font-semibold">{videos}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setVideos((v) => clamp(v - 1, 0, 5))}
                        className="w-8 h-8 rounded-full border border-[#E6DCF0] text-purple-dark"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideos((v) => clamp(v + 1, 0, 5))}
                        className="w-8 h-8 rounded-full border border-[#E6DCF0] text-purple-dark"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border border-[#F3EFF6] rounded-xl px-3 py-2">
                    <div>
                      <div className="text-xs text-gray-500">Images</div>
                      <div className="text-purple-dark font-semibold">{images}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImages((x) => clamp(x - 1, 0, 6))}
                        className="w-8 h-8 rounded-full border border-[#E6DCF0] text-purple-dark"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setImages((x) => clamp(x + 1, 0, 6))}
                        className="w-8 h-8 rounded-full border border-[#E6DCF0] text-purple-dark"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#F3EFF6] rounded-2xl p-4">
                <details className="group">
                  <summary className="cursor-pointer list-none flex items-center justify-between">
                    <span className="text-purple-dark font-semibold">
                      Preview what we’ll generate
                    </span>
                    <span className="text-xs text-gray-500 group-open:hidden">Expand</span>
                    <span className="text-xs text-gray-500 hidden group-open:block">Collapse</span>
                  </summary>

                  <div className="mt-3 text-sm">
                    <div className="text-xs text-gray-500">Selected creative direction</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedIds.length ? (
                        selectedIds.map((id) => {
                          const angle = safeAnglesById.get(id);
                          return (
                            <span
                              key={id}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F3EFF6] text-purple-dark"
                            >
                              {angle?.label || id}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-gray-500">
                          No creative direction selected
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">Assets</div>
                    <div className="mt-1 text-sm text-purple-dark">
                      Videos: {videos}
                    </div>
                    <div className="text-sm text-purple-dark">Images: {images}</div>

                    <div className="mt-3 text-xs text-gray-500">Formats</div>
                    <div className="mt-1 text-sm text-purple-dark">Videos: 9:16</div>
                    <div className="text-sm text-purple-dark">Images: 1:1 or 4:5</div>
                  </div>
                </details>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <div className="sm:max-w-[200px] w-full">
                <Button text="Back" action={handleBack} />
              </div>
              <div className="sm:max-w-[200px] w-full">
                <Button
                  text="Approve"
                  action={handleApprove}
                  hasIconOrLoader
                  icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
                  iconPosition="right"
                  iconSize={16}
                />
              </div>
            </div>
          </div>
        </details>

        <details
          className="bg-[rgba(246,246,246,0.75)] rounded-3xl"
          open={activeSection === "icp"}
          onToggle={(e) => {
            const nextOpen = (e.target as HTMLDetailsElement).open;
            if (nextOpen) {
              if (!isAnglesApproved) {
                setActiveSection("direction");
                return;
              }
              setActiveSection("icp");
            }
          }}
        >
          <summary className="cursor-pointer list-none px-4 lg:px-6 py-4 flex items-center justify-between">
            <span className="text-purple-dark font-semibold">Ideal Customer Profile (ICP)</span>
            <span className="text-xs text-gray-500">
              {activeSection === "icp" ? "Collapse" : "Expand"}
            </span>
          </summary>

          <div className="px-4 lg:px-6 pb-6">
            {!isAnglesApproved ? (
              <div className="text-sm text-gray-500">
                Approve your creative direction first to choose ICP.
              </div>
            ) : (
              <div>
                <div className="text-gray-500 text-sm mb-4">
                  We’ll recommend ICPs based on your creative direction and product. Select up to 3.
                </div>

                {icpSelectionMessage ? (
                  <div className="mb-3 text-xs text-[#C67B22] bg-[#FEF5EA] px-3 py-2 rounded-lg">
                    {icpSelectionMessage}
                  </div>
                ) : null}

                {(() => {
                  const recommendedSet = new Set(recommendedIcpIds);
                  const byId = new Map(availableIcps.map((x) => [x.id, x] as const));

                  const recommended = recommendedIcpIds
                    .map((id) => byId.get(id))
                    .filter(Boolean) as Icp[];
                  const others = availableIcps.filter((icp) => !recommendedSet.has(icp.id));

                  const renderTile = (icp: Icp, showRecommendedBadge: boolean) => {
                    const isSelected = selectedIcpIds.includes(icp.id);
                    return (
                      <button
                        key={icp.id}
                        type="button"
                        onClick={() => toggleIcp(icp.id)}
                        className={
                          "text-left border rounded-2xl p-4 transition-colors " +
                          (isSelected
                            ? "border-purple-dark bg-purple-dark"
                            : "border-[#F3EFF6] bg-white hover:bg-[#F9F7FB]")
                        }
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div
                              className={
                                "font-semibold text-sm truncate " +
                                (isSelected ? "text-white" : "text-purple-dark")
                              }
                            >
                              {icp.label}
                            </div>
                            <div
                              className={
                                "text-xs mt-1 line-clamp-2 " +
                                (isSelected ? "text-white/80" : "text-gray-500")
                              }
                            >
                              {icp.description}
                            </div>
                          </div>

                          {showRecommendedBadge ? (
                            <span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                              Recommended
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-3 text-xs">
                          <span
                            className={
                              "inline-block px-2 py-1 rounded-full border " +
                              (isSelected
                                ? "border-white text-white"
                                : "border-[#E6DCF0] text-gray-600")
                            }
                          >
                            {isSelected ? "Selected" : "Select"}
                          </span>
                        </div>
                      </button>
                    );
                  };

                  return (
                    <div>
                      <div className="text-purple-dark font-semibold text-sm mb-2">
                        Recommended ICPs
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {recommended.length
                          ? recommended.map((icp) => renderTile(icp, true))
                          : null}
                      </div>

                      <div className="mt-4">
                        <details className="group bg-white border border-[#F3EFF6] rounded-2xl px-4 py-3">
                          <summary className="cursor-pointer list-none flex items-center justify-between">
                            <span className="text-purple-dark font-semibold text-sm">
                              Other ICPs
                            </span>
                            <span className="text-xs text-gray-500 group-open:hidden">Expand</span>
                            <span className="text-xs text-gray-500 hidden group-open:block">Collapse</span>
                          </summary>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {others.map((icp) => renderTile(icp, false))}
                          </div>
                        </details>
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <div className="sm:max-w-[200px] w-full">
                    <Button text="Back" action={handleBack} />
                  </div>
                  <div className="sm:max-w-[200px] w-full">
                    <Button
                      text="Approve"
                      action={handleApproveIcp}
                      hasIconOrLoader
                      icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
                      iconPosition="right"
                      iconSize={16}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </details>

        <details
          className="bg-[rgba(246,246,246,0.75)] rounded-3xl"
          open={activeSection === "script"}
          onToggle={(e) => {
            const nextOpen = (e.target as HTMLDetailsElement).open;
            if (nextOpen) {
              if (!isAnglesApproved) {
                setActiveSection("direction");
                return;
              }
              if (!isIcpApproved) {
                setActiveSection("icp");
                return;
              }
              setActiveSection("script");
            }
          }}
        >
          <summary className="cursor-pointer list-none px-4 lg:px-6 py-4 flex items-center justify-between">
            <span className="text-purple-dark font-semibold">Script review</span>
            <span className="text-xs text-gray-500">
              {activeSection === "script" ? "Collapse" : "Expand"}
            </span>
          </summary>

          <div className="px-4 lg:px-6 pb-6">
            {!isAnglesApproved ? (
              <div className="text-sm text-gray-500">
                Approve your creative direction first to review scripts.
              </div>
            ) : (
              <div>
                <div className="text-gray-500 text-sm mb-4">
                  Review the generated scripts for your selected creative direction. Approve to continue to creative templates.
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white border border-[#F3EFF6] rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-purple-dark font-semibold">Video scripts</div>
                        <div className="text-gray-500 text-xs mt-1">Format: 9:16</div>
                      </div>
                      <div className="max-w-[180px] w-full">
                        <Button
                          text="Regenerate"
                          buttonSize="small"
                          action={handleRegenerateVideoScripts}
                        />
                      </div>
                    </div>
                    <div className="mb-3" />

                    {scripts.video.length ? (
                      <div className="flex flex-col gap-3">
                        {scripts.video.map((draft, idx) => {
                          const key = `video-${idx}`;
                          const text = getDraftText(key, draft);
                          const isEditing = editingDraftKey === key;

                          return (
                            <div
                              key={key}
                              className="bg-[#F9F7FB] border border-[#F3EFF6] rounded-xl p-3"
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="text-xs text-gray-500">Draft {idx + 1}</div>
                                {!isEditing ? (
                                  <div className="max-w-[120px] w-full">
                                    <Button
                                      text="Edit"
                                      tertiary
                                      hasIconOrLoader
                                      icon={<Edit2 size={16} color="#4B0F81" />}
                                      iconPosition="left"
                                      iconSize={16}
                                      action={() => startEditingDraft(key, text)}
                                    />
                                  </div>
                                ) : null}
                              </div>

                              {isEditing ? (
                                <div>
                                  <textarea
                                    value={draftBuffers[key] ?? text}
                                    onChange={(e) =>
                                      setDraftBuffers((prev) => ({
                                        ...prev,
                                        [key]: e.target.value,
                                      }))
                                    }
                                    className="w-full min-h-[160px] text-xs text-purple-dark bg-white border border-[#E6DCF0] rounded-xl p-3 outline-none"
                                  />

                                  <div className="mt-3 flex gap-2 justify-end">
                                    <div className="max-w-[120px] w-full">
                                      <Button text="Cancel" secondary action={cancelEditingDraft} />
                                    </div>
                                    <div className="max-w-[120px] w-full">
                                      <Button text="Save" action={() => saveDraft(key)} />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <pre className="whitespace-pre-wrap text-xs text-purple-dark">
                                  {text}
                                </pre>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No videos selected.</div>
                    )}
                  </div>

                  <div className="bg-white border border-[#F3EFF6] rounded-2xl p-4">
                    <div className="text-purple-dark font-semibold">Image copy</div>
                    <div className="text-gray-500 text-xs mt-1 mb-3">Format: 1:1 or 4:5</div>

                    {scripts.images.length ? (
                      <div className="flex flex-col gap-3">
                        {scripts.images.map((draft, idx) => {
                          const key = `image-${idx}`;
                          const text = getDraftText(key, draft);
                          const isEditing = editingDraftKey === key;

                          return (
                            <div
                              key={key}
                              className="bg-[#F9F7FB] border border-[#F3EFF6] rounded-xl p-3"
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="text-xs text-gray-500">Draft {idx + 1}</div>
                                {!isEditing ? (
                                  <div className="flex items-center gap-2">
                                    <div className="max-w-[120px] w-full">
                                      <Button
                                        text="Edit"
                                        tertiary
                                        hasIconOrLoader
                                        icon={<Edit2 size={16} color="#4B0F81" />}
                                        iconPosition="left"
                                        iconSize={16}
                                        action={() => startEditingDraft(key, text)}
                                      />
                                    </div>
                                    <div className="max-w-[140px] w-full">
                                      <Button
                                        text="Regenerate"
                                        buttonSize="small"
                                        action={() => handleRegenerateImageDraft(idx)}
                                      />
                                    </div>
                                  </div>
                                ) : null}
                              </div>

                              {isEditing ? (
                                <div>
                                  <textarea
                                    value={draftBuffers[key] ?? text}
                                    onChange={(e) =>
                                      setDraftBuffers((prev) => ({
                                        ...prev,
                                        [key]: e.target.value,
                                      }))
                                    }
                                    className="w-full min-h-[160px] text-xs text-purple-dark bg-white border border-[#E6DCF0] rounded-xl p-3 outline-none"
                                  />

                                  <div className="mt-3 flex gap-2 justify-end">
                                    <div className="max-w-[120px] w-full">
                                      <Button text="Cancel" secondary action={cancelEditingDraft} />
                                    </div>
                                    <div className="max-w-[120px] w-full">
                                      <Button text="Save" action={() => saveDraft(key)} />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <pre className="whitespace-pre-wrap text-xs text-purple-dark">
                                  {text}
                                </pre>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No images selected.</div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <div className="sm:max-w-[200px] w-full">
                    <Button text="Back" action={handleBack} />
                  </div>
                  <div className="sm:max-w-[200px] w-full">
                    <Button
                      text="Approve scripts"
                      action={handleApproveScript}
                      hasIconOrLoader
                      icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
                      iconPosition="right"
                      iconSize={16}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </details>

        <details
          className="bg-[rgba(246,246,246,0.75)] rounded-3xl"
          open={activeSection === "templates"}
          onToggle={(e) => {
            const nextOpen = (e.target as HTMLDetailsElement).open;
            if (nextOpen) {
              if (!isScriptApproved) {
                setActiveSection(isAnglesApproved ? "script" : "direction");
                return;
              }
              setActiveSection("templates");
            }
          }}
        >
          <summary className="cursor-pointer list-none px-4 lg:px-6 py-4 flex items-center justify-between">
            <span className="text-purple-dark font-semibold">Creative templates</span>
            <span className="text-xs text-gray-500">
              {activeSection === "templates" ? "Collapse" : "Expand"}
            </span>
          </summary>

          <div className="px-4 lg:px-6 pb-6">
            {isScriptApproved && activeSection === "templates" ? (
              <div>
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-gray-500">
                    Select up to <span className="font-medium">{videos}</span> videos and{" "}
                    <span className="font-medium">{images}</span> images.
                  </div>
                  <div className="text-xs text-gray-600">
                    Selected: <span className="font-medium">{templateSelectionCounts.videos}</span>/{videos} videos •{" "}
                    <span className="font-medium">{templateSelectionCounts.images}</span>/{images} images
                  </div>
                </div>
                <AdLibrary
                  mode="create_campaign"
                  defaultNiche={adLibraryDefaultNiche}
                  recommendedCreativeDirections={recommendedCreativeDirectionFilters}
                  onSelectionCountsChange={(counts) =>
                    setTemplateSelectionCounts({
                      videos: counts.videos,
                      images: counts.imageTemplates,
                    })
                  }
                  selection={{
                    enabled: true,
                    selectedIds: selectedTemplateIds,
                    maxVideos: videos,
                    maxImages: images,
                    onChangeSelectedIds: setSelectedTemplateIds,
                  }}
                />

                <div className="mt-5 md:mt-9 sm:max-w-[200px] mx-auto">
                  <Button
                    text="Proceed"
                    action={handleProceedFromTemplates}
                    disabled={!isAllStepsComplete}
                    hasIconOrLoader
                    icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
                    iconPosition="right"
                    iconSize={16}
                  />
                </div>
              </div>
            ) : null}
            {!isScriptApproved ? (
              <div className="text-sm text-gray-500">
                Approve your scripts to unlock creative templates.
              </div>
            ) : null}
          </div>
        </details>
      </div>
    </div>
  );
}
