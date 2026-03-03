export const CREATIVE_DIRECTIONS = [
  "Testimonials",
  "Problem → Solution",
  "UGC Review",
  "Founder Story",
  "Comparison",
  "Before & After",
  "Lifestyle Showcase",
  "Product Demo",
  "Social Proof",
  "Offer / Discount",
] as const;

export type CreativeDirection = (typeof CREATIVE_DIRECTIONS)[number];

export const NICHES = [
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
] as const;

export type Niche = (typeof NICHES)[number];

export const QUICK_TAGS = [
  "Summer",
  "High Converting",
  "Trending",
  "New",
  "Black Friday",
  "Luxury",
  "Minimal",
  "Bold",
  "Emotional",
  "Fast Paced",
  "Winter",
  "Spring",
  "Limited Time",
  "Giftable",
  "Bundle",
] as const;

export type QuickTag = (typeof QUICK_TAGS)[number];

export type FilterState = {
  creativeDirections: CreativeDirection[];
  niches: Niche[];
  tags: QuickTag[];
};

export const EMPTY_FILTERS: FilterState = {
  creativeDirections: [],
  niches: [],
  tags: [],
};

export function countActiveFilters(filters: FilterState): number {
  return (
    filters.creativeDirections.length +
    filters.niches.length +
    filters.tags.length
  );
}

export function hasActiveFilters(filters: FilterState): boolean {
  return countActiveFilters(filters) > 0;
}

/**
 * Derives a CreativeDirection from a template label/theme string.
 * Used to map image-ad themes and video-preset labels to the canonical filter values.
 */
export function deriveCreativeDirection(
  input: string,
): CreativeDirection | null {
  const v = (input || "").toLowerCase();
  if (v.includes("testimonial")) return "Testimonials";
  if (v.includes("problem") || v.includes("solution")) return "Problem → Solution";
  if (v.includes("ugc") || v.includes("review")) return "UGC Review";
  if (v.includes("founder") || v.includes("story")) return "Founder Story";
  if (v.includes("comparison") || v.includes("compare") || v.includes("vs")) return "Comparison";
  if (v.includes("before") || v.includes("after") || v.includes("transformation")) return "Before & After";
  if (
    v.includes("lifestyle") ||
    v.includes("routine") ||
    v.includes("showcase")
  )
    return "Lifestyle Showcase";
  if (v.includes("demo") || v.includes("unboxing") || v.includes("how to"))
    return "Product Demo";
  if (v.includes("social proof") || v.includes("trust")) return "Social Proof";
  if (
    v.includes("offer") ||
    v.includes("discount") ||
    v.includes("urgency") ||
    v.includes("sale") ||
    v.includes("black friday") ||
    v.includes("payday") ||
    v.includes("limited")
  )
    return "Offer / Discount";
  if (v.includes("viral") || v.includes("fast cut")) return "Product Demo";
  if (v.includes("luxury") || v.includes("macro")) return "Lifestyle Showcase";
  return null;
}

/**
 * Derives a Niche from a video preset label (e.g. "Skincare • Lifestyle routine").
 */
export function deriveNicheFromLabel(label: string): Niche | null {
  const v = (label || "").toLowerCase();
  if (v.includes("skincare") || v.includes("beauty") || v.includes("acne") || v.includes("serum"))
    return "Beauty & Skincare";
  if (v.includes("fashion") || v.includes("apparel") || v.includes("clothing") || v.includes("outfit") || v.includes("shirt") || v.includes("suit"))
    return "Fashion & Apparel";
  if (v.includes("wellness") || v.includes("health") || v.includes("supplement") || v.includes("vitamin"))
    return "Health & Wellness";
  if (v.includes("home") || v.includes("living") || v.includes("kitchen") || v.includes("decor"))
    return "Home & Living";
  if (v.includes("jewelry") || v.includes("necklace") || v.includes("ring") || v.includes("bracelet"))
    return "Jewelry & Accessories";
  if (v.includes("fitness") || v.includes("gym") || v.includes("workout") || v.includes("sport"))
    return "Fitness & Sports";
  if (v.includes("food") || v.includes("beverage") || v.includes("coffee") || v.includes("snack"))
    return "Food & Beverage";
  if (v.includes("tech") || v.includes("gadget") || v.includes("phone") || v.includes("electronic"))
    return "Electronics & Gadgets";
  if (v.includes("pet") || v.includes("dog") || v.includes("cat")) return "Pet Supplies";
  if (v.includes("baby") || v.includes("kid") || v.includes("toddler")) return "Baby, Kids & Parenting";
  if (v.includes("travel") || v.includes("outdoor") || v.includes("hiking")) return "Travel & Outdoor";
  if (v.includes("gift") || v.includes("holiday") || v.includes("birthday")) return "Gifts & Occasions";
  return null;
}

/**
 * Derives quick tags from a label string.
 */
export function deriveTagsFromLabel(label: string): QuickTag[] {
  const v = (label || "").toLowerCase();
  const out: QuickTag[] = [];
  if (v.includes("summer")) out.push("Summer");
  if (v.includes("winter")) out.push("Winter");
  if (v.includes("spring")) out.push("Spring");
  if (v.includes("black friday")) out.push("Black Friday");
  if (v.includes("limited") || v.includes("urgency") || v.includes("sale") || v.includes("payday"))
    out.push("Limited Time");
  if (v.includes("luxury") || v.includes("macro") || v.includes("premium")) out.push("Luxury");
  if (v.includes("minimal")) out.push("Minimal");
  if (v.includes("viral") || v.includes("fast") || v.includes("trending")) out.push("Trending");
  if (v.includes("gift") || v.includes("gifting")) out.push("Giftable");
  if (v.includes("bundle") || v.includes("pack") || v.includes("set")) out.push("Bundle");
  if (v.includes("new") || v.includes("launch") || v.includes("arrival")) out.push("New");
  if (v.includes("bold")) out.push("Bold");
  if (v.includes("emotional") || v.includes("story") || v.includes("founder")) out.push("Emotional");
  return out;
}
