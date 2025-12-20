export type TrendingAd = {
  id: number;
  brand: string;
  isNew: boolean;
  daysAgo: number | null;
  previewType: "video" | "image";
  previewUrl: string;
  headline: string;
  domain: string;
  productName: string;
  cta: string;
  platform: "meta" | "tiktok";
  niche: string;
  subNiche: string;
  status: "active" | "inactive";
  adScore: number;
  hook?: string;
};

export const trendingAds: TrendingAd[] = [
  {
    id: 1,
    brand: "Luxe Cosmetics",
    isNew: true,
    daysAgo: null,
    previewType: "image",
    previewUrl: "/ad-assets/6da1073c-b66a-4448-9269-80afa64e9ac9_1766197795895.png",
    headline: "Your signature shade awaits. Our long-lasting lipstick stays flawless from morning meetings to midnight events...",
    domain: "www.luxecosmetics.com",
    productName: "Velvet Matte Lipstick Collection",
    cta: "Shop Now",
    platform: "meta",
    niche: "Beauty & Personal Care",
    subNiche: "Makeup & Cosmetics",
    status: "active",
    adScore: 92,
  },
  {
    id: 9,
    brand: "FitLife",
    isNew: true,
    daysAgo: null,
    previewType: "video",
    previewUrl: "/ad-assets/c75be66a-b6a9-4cfb-add1-d2a98fa78080_1766197795900.mp4",
    headline: "Your home gym, reimagined. Compact equipment that delivers full-body results without the gym membership...",
    domain: "www.fitlife.com",
    productName: "Home Fitness System",
    cta: "Shop Now",
    platform: "tiktok",
    niche: "Health & Wellness",
    subNiche: "Fitness Accessories",
    status: "active",
    adScore: 96,
    hook: "If you want to transform your body at home, you need to try this. No gym membership required!",
  },
  {
    id: 5,
    brand: "Elegance Studio",
    isNew: false,
    daysAgo: 2,
    previewType: "image",
    previewUrl: "/ad-assets/Winter_Gala_Ready_version_1_1766197795900.png",
    headline: "The Winter Event Standard. The perfect deep emerald dress, designed to move with you through every festive moment...",
    domain: "www.elegancestudio.com",
    productName: "Winter Gala Collection",
    cta: "Shop Now",
    platform: "meta",
    niche: "Fashion & Apparel",
    subNiche: "Occasion Wear",
    status: "active",
    adScore: 94,
  },
  {
    id: 12,
    brand: "ZenSkin",
    isNew: true,
    daysAgo: null,
    previewType: "video",
    previewUrl: "/ad-assets/c75be66a-b6a9-4cfb-add1-d2a98fa78080_1766202310696.mp4",
    headline: "Discover the secret to radiant skin. Our all-natural serum is formulated with powerful antioxidants...",
    domain: "www.zenskin.co",
    productName: "Radiance Boost Serum",
    cta: "Shop Now",
    platform: "meta",
    niche: "Beauty & Personal Care",
    subNiche: "Skincare",
    status: "active",
    adScore: 91,
    hook: "If you want flawless, glowing skin, you need to try this serum. Watch what happens in 7 days!",
  },
  {
    id: 11,
    brand: "Artisan Coffee",
    isNew: false,
    daysAgo: 1,
    previewType: "video",
    previewUrl: "/ad-assets/d3b6fcfd-4074-4e98-9fb9-8e81d0d78cbe_1766197795901.mp4",
    headline: "Start your morning right. Single-origin beans roasted to perfection for the ultimate coffee experience...",
    domain: "www.artisancoffee.co",
    productName: "Premium Coffee Subscription",
    cta: "Subscribe",
    platform: "tiktok",
    niche: "Food & Beverages",
    subNiche: "Coffee & Tea",
    status: "active",
    adScore: 89,
    hook: "Seriously, what was I drinking before? This coffee is a game-changer for your morning routine.",
  },
  {
    id: 6,
    brand: "GlowUp Beauty",
    isNew: true,
    daysAgo: null,
    previewType: "video",
    previewUrl: "/ad-assets/a069269c-49e5-4068-a750-007e54a3d580_1766197795899.mp4",
    headline: "Transform your skincare routine with our viral serum. See real results in just 7 days...",
    domain: "www.glowupbeauty.com",
    productName: "Hydra-Glow Vitamin C Serum",
    cta: "Shop Now",
    platform: "tiktok",
    niche: "Beauty & Personal Care",
    subNiche: "Skincare",
    status: "active",
    adScore: 88,
    hook: "I just got this serum and you need to get this for yourself. My skin has never looked better!",
  },
];

export function getTrendingAds(limit?: number): TrendingAd[] {
  const sorted = [...trendingAds].sort((a, b) => b.adScore - a.adScore);
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getSuggestionsByNiche(niche: string, limit?: number): TrendingAd[] {
  const filtered = trendingAds.filter(ad => ad.niche === niche);
  const sorted = filtered.sort((a, b) => b.adScore - a.adScore);
  return limit ? sorted.slice(0, limit) : sorted;
}
