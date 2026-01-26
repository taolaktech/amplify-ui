"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SearchNormal1, ArrowDown2, Play, Eye, Copy, ArrowLeft2, TickCircle, Heart, ArrowRight2, Video, Magicpen } from "iconsax-react";
import ConnectStore from "../modals/ConnectStore";
import { useToastStore } from "../../lib/stores/toastStore";

const modelOptions = [
  "All",
  "No Model (Product Only)",
  "Single Model (Male)",
  "Single Model (Female)",
  "Couple",
  "Group",
  "UGC-Style (Phone-shot)",
  "Influencer-Style",
  "Hands-Only",
];
const ethnicityOptions = [
  "All",
  "Black / African Descent",
  "White / Caucasian",
  "East Asian",
  "South Asian",
  "Middle Eastern",
  "Latino / Hispanic",
  "Mixed / Multi-ethnic",
  "Indigenous",
];
const creativeDirectionOptions = [
  "All",
  "Problem → Solution",
  "Close-up / Detail",
  "Comparison",
  "Seasonal / Promo",
  "Customer Story",
  "Product Demo",
  "How-To Tutorial",
  "Unboxing Experience",
];

const campaignTypeOptions = [
  "All",
  "Valentine’s Day",
  "Mother’s Day",
  "Father’s Day",
  "Back to School",
  "Labor Day",
  "Halloween",
  "Black Friday",
  "Cyber Monday",
  "Black Friday → Cyber Week",
  "Christmas Sale",
  "Boxing Day",
  "New Year’s Eve Sale",
];

function getRecommendedCampaignTypes(now = new Date()) {
  const thisMonth = now.getMonth();
  const nextMonth = (thisMonth + 1) % 12;

  const byMonth: Record<number, string[]> = {
    // Feb
    1: ["Valentine’s Day"],
    // May
    4: ["Mother’s Day"],
    // Jun
    5: ["Father’s Day"],
    // Aug
    7: ["Back to School"],
    // Sep
    8: ["Labor Day"],
    // Oct
    9: ["Halloween"],
    // Nov
    10: ["Black Friday", "Cyber Monday", "Black Friday → Cyber Week"],
    // Dec
    11: ["Christmas Sale", "Boxing Day", "New Year’s Eve Sale"],
  };

  const recommended = new Set<string>();
  for (const item of byMonth[thisMonth] || []) recommended.add(item);
  for (const item of byMonth[nextMonth] || []) recommended.add(item);
  return recommended;
}

type NicheCategory = {
  name: string;
  subNiches: string[];
};

const nicheCategories: NicheCategory[] = [
  {
    name: "Fashion & Apparel",
    subNiches: ["Women's Clothing", "Men's Clothing", "Activewear & Athleisure", "Loungewear & Sleepwear", "Streetwear", "Modest Fashion", "Plus Size Apparel", "Kids & Baby Clothing", "Occasion Wear", "Sustainable Fashion"]
  },
  {
    name: "Beauty & Personal Care",
    subNiches: ["Skincare", "Haircare", "Makeup & Cosmetics", "Fragrances", "Men's Grooming", "Beauty Tools & Devices", "Natural & Organic Beauty", "K-Beauty", "Nail Care", "Beauty Subscriptions"]
  },
  {
    name: "Health & Wellness",
    subNiches: ["Supplements & Vitamins", "Fitness Accessories", "Yoga & Mindfulness", "Weight Loss Products", "Sleep Aids", "Recovery & Therapy Tools", "Mental Wellness Tools", "Women's Health", "Men's Health", "Holistic Health"]
  },
  {
    name: "Jewelry & Accessories",
    subNiches: ["Fine Jewelry", "Fashion Jewelry", "Watches", "Sunglasses", "Bags & Wallets", "Scarves & Belts", "Custom Jewelry", "Bridal Jewelry", "Men's Accessories"]
  },
  {
    name: "Baby & Kids",
    subNiches: ["Baby Gear", "Baby Care Products", "Educational Toys", "Kids Furniture", "Kids Apparel", "Baby Feeding", "Maternity Products", "Kids Safety", "Subscription Boxes"]
  },
  {
    name: "Food & Beverage",
    subNiches: ["Snacks & Treats", "Coffee & Tea", "Health Foods", "Supplement Drinks", "Gourmet Foods", "Cultural Foods", "Meal Kits", "Subscription Food Boxes"]
  },
  {
    name: "Home & Living",
    subNiches: ["Bedding & Mattresses", "Bath & Towels", "Kitchen Tools", "Home Fragrance", "Wall Art & Prints", "Storage Solutions", "Minimalist Home", "Eco Home Products"]
  },
  {
    name: "Digital Products",
    subNiches: ["Online Courses", "Templates", "E-books & Guides", "Presets & Filters", "Stock Assets", "Membership Communities", "SaaS Add-ons", "AI Tools & Prompts"]
  },
  {
    name: "Arts, Crafts & Hobbies",
    subNiches: ["Art Supplies", "Craft Kits", "Photography Gear", "Music Accessories", "Collectibles", "DIY Kits", "Gaming Accessories", "Board Games & Puzzles"]
  },
  {
    name: "Luxury & Premium",
    subNiches: ["Designer-inspired Goods", "Premium Home Goods", "Luxury Candles", "High-end Beauty", "Bespoke Products", "Limited Edition Drops"]
  },
  {
    name: "Seasonal & Gifting",
    subNiches: ["Holiday Decor", "Gift Boxes", "Wedding Products", "Party Supplies", "Corporate Gifting", "Back-to-School"]
  },
  {
    name: "Eco & Sustainability",
    subNiches: ["Zero-Waste Products", "Reusable Household", "Sustainable Fashion", "Ethical Beauty", "Carbon-Neutral Brands", "Refill Products"]
  },
  {
    name: "B2B & Commercial",
    subNiches: ["Office Supplies", "Corporate Merch", "Branded Swag", "POS Accessories", "Restaurant Supplies", "Salon Supplies"]
  },
  {
    name: "Home Improvement",
    subNiches: ["Furniture", "Home Decor", "Lighting", "Smart Home Devices", "DIY Tools", "Paint & Wall Treatments", "Flooring & Rugs", "Storage & Organization", "Home Security", "Garden & Outdoor"]
  },
  {
    name: "Household Essentials",
    subNiches: ["Cleaning Supplies", "Laundry Products", "Kitchen Essentials", "Storage & Containers", "Paper Products", "Air Fresheners", "Pest Control", "Home Safety", "Eco-friendly Items"]
  },
  {
    name: "Services",
    subNiches: ["Personal Care Services", "Home Cleaning Services", "Moving & Storage", "Repair & Maintenance", "Wellness & Therapy", "Childcare Services", "Elder Care", "Event Services"]
  },
  {
    name: "Entertainment & Media",
    subNiches: ["Streaming Services", "Digital Publications", "Magazines", "Gaming Content", "Podcasts", "Event Tickets", "Books & Audiobooks", "Music Platforms"]
  },
  {
    name: "Sports & Outdoors",
    subNiches: ["Fitness Equipment", "Sports Apparel", "Outdoor Gear", "Camping & Hiking", "Cycling", "Water Sports", "Team Sports Gear", "Hunting & Fishing", "Recovery Tools"]
  },
  {
    name: "Electronics & Tech",
    subNiches: ["Mobile Phones", "Phone Accessories", "Laptops & Computers", "Audio Equipment", "Wearables", "Smart Devices", "Gaming Consoles", "Tech Accessories"]
  },
];

const aiAvatarNamesById: Record<number, string> = {
  301: "Layla",
  302: "Emily",
  303: "Hannah",
  304: "Camila",
  305: "Nia",
  306: "Sarah",
  307: "Jordan",
  308: "Olivia",
  309: "Jack",
};

type LibraryAd = {
  id: number;
  title: string;
  description: string;
  previewType: "video" | "image";
  previewUrl: string;
  category: string;
  style: string;
  saved: boolean;
  ethnicity?: string;
  campaignType?: string;
};

const imageAds: LibraryAd[] = [
  {
    id: 1,
    title: "MUSE Skin Glow",
    description: "Editorial shot with glowing skin and bold product placement",
    previewType: "image",
    previewUrl: "/image-ads/muse-skin.png",
    category: "Beauty",
    style: "Editorial",
    saved: false,
    ethnicity: "Latino / Hispanic",
  },
  {
    id: 2,
    title: "Naked Sundays SPF",
    description: "Multi-shot lifestyle grid with product application close-ups",
    previewType: "image",
    previewUrl: "/image-ads/naked-sundays.png",
    category: "Skincare",
    style: "Lifestyle",
    saved: false,
    ethnicity: "White / Caucasian",
  },
  {
    id: 3,
    title: "Hersteller Cleanser",
    description: "Playful UGC-style shot with natural freckled skin",
    previewType: "image",
    previewUrl: "/image-ads/hersteller.png",
    category: "Skincare",
    style: "UGC",
    saved: false,
    ethnicity: "White / Caucasian",
  },
  {
    id: 4,
    title: "Satin Hands Cream",
    description: "Golden hour product application with soft lighting",
    previewType: "image",
    previewUrl: "/image-ads/satin-hands.png",
    category: "Skincare",
    style: "Lifestyle",
    saved: false,
    ethnicity: "White / Caucasian",
  },
];

const videoAds: LibraryAd[] = [
  {
    id: 101,
    title: "Unboxing Experience",
    description: "First impressions that sell instantly. Best for: New products, cold audiences",
    previewType: "video",
    previewUrl: "/attached_assets/a069269c-49e5-4068-a750-007e54a3d580_1766197795899.mp4",
    category: "E-commerce",
    style: "UGC",
    saved: false,
  },
  {
    id: 102,
    title: "How-To Tutorial",
    description: "Show how it works in seconds. Best for: Functional products, education-led ads",
    previewType: "video",
    previewUrl: "/attached_assets/a5928bf1-8cca-4f11-80c1-d48602facf5a_1766197795899.mp4",
    category: "Educational",
    style: "Tutorial",
    saved: false,
  },
  {
    id: 103,
    title: "Product Demo",
    description: "See the product in action. Best for: Conversion-focused campaigns",
    previewType: "video",
    previewUrl: "/attached_assets/a7aa648c-6d7b-463a-8c47-998e25342aaa_1766197795900.mp4",
    category: "E-commerce",
    style: "Demo",
    saved: false,
  },
  {
    id: 104,
    title: "Customer Story",
    description: "Real experiences, real trust. Best for: Retargeting, warm audiences",
    previewType: "video",
    previewUrl: "/attached_assets/b45b2243-c01d-4719-a6d7-4aec7dfac4e5_1766202310701.mp4",
    category: "Social Proof",
    style: "Testimonial",
    saved: false,
  },
  {
    id: 105,
    title: "Problem → Solution",
    description: "Call out the problem. Show the fix. Best for: Direct-response performance ads",
    previewType: "video",
    previewUrl: "/attached_assets/c75be66a-b6a9-4cfb-add1-d2a98fa78080_1766197795900.mp4",
    category: "Marketing",
    style: "Storytelling",
    saved: false,
  },
  {
    id: 106,
    title: "Close-up / Detail",
    description: "Highlight quality and craftsmanship. Best for: Premium or design-led products",
    previewType: "video",
    previewUrl: "/attached_assets/d3b6fcfd-4074-4e98-9fb9-8e81d0d78cbe_1766197795901.mp4",
    category: "E-commerce",
    style: "Detail",
    saved: false,
  },
  {
    id: 107,
    title: "Comparison",
    description: "Show why this option wins. Best for: Competitive niches",
    previewType: "video",
    previewUrl: "/attached_assets/a7aa648c-6d7b-463a-8c47-998e25342aaa_1766197795900.mp4",
    category: "Marketing",
    style: "Comparison",
    saved: false,
  },
  {
    id: 108,
    title: "Seasonal / Promo",
    description: "Drive urgency with timely offers. Best for: Sales, launches, holidays",
    previewType: "video",
    previewUrl: "/attached_assets/c75be66a-b6a9-4cfb-add1-d2a98fa78080_1766197795900.mp4",
    category: "Promotional",
    style: "Promo",
    saved: false,
  },
];

const seasonalAds: LibraryAd[] = [
  {
    id: 201,
    title: "Holiday Gift Guide",
    description: "Showcase products as perfect holiday gifts",
    previewType: "video",
    previewUrl: "/attached_assets/AQM5E_KyXvEkXlDaJzULHef3U3ucw0ALNHOBTdWQhm0THUpyVxZEBzJ6uwhfAS_1766202310700.mp4",
    category: "Christmas",
    style: "Festive",
    campaignType: "Christmas Sale",
    saved: false,
  },
  {
    id: 202,
    title: "Christmas Sale",
    description: "Limited-time holiday discount promotion",
    previewType: "image",
    previewUrl: "/attached_assets/Winter_Gala_Ready_version_1_1766197795900.png",
    category: "Christmas",
    style: "Promotional",
    campaignType: "Christmas Sale",
    saved: false,
  },
  {
    id: 203,
    title: "Cozy Winter Vibes",
    description: "Warm, cozy winter aesthetics",
    previewType: "video",
    previewUrl: "/attached_assets/AQP8eyx5D8yntxpO7rCFFWxb7gSKlojV0dcA6loTB-tl462LjLSTB4CaYtV57e_1766202310701.mp4",
    category: "Winter",
    style: "Lifestyle",
    saved: false,
  },
  {
    id: 204,
    title: "New Year Goals",
    description: "Products for New Year resolutions",
    previewType: "image",
    previewUrl: "/attached_assets/0b113324-a1a5-415b-99e2-1a8139f6529e_1766197795897.png",
    category: "New Year",
    style: "Motivational",
    campaignType: "New Year’s Eve Sale",
    saved: false,
  },
  {
    id: 205,
    title: "Family Moments",
    description: "Family gatherings and togetherness",
    previewType: "video",
    previewUrl: "/attached_assets/AQPRTgBVdYj83IchzmGk4NrNf2XZQR3IcDDCwIx8X96g8Fvy7mSQjyFl24hnUi_1766202310701.mp4",
    category: "Christmas",
    style: "Emotional",
    campaignType: "Christmas Sale",
    saved: false,
  },
  {
    id: 206,
    title: "Stocking Stuffers",
    description: "Affordable gift ideas under $25",
    previewType: "image",
    previewUrl: "/attached_assets/29f2b7d0-0ca0-42b6-ab01-e94ad8a007ad_1766197795898.png",
    category: "Christmas",
    style: "Budget",
    campaignType: "Christmas Sale",
    saved: false,
  },
];

const aiModelAds: LibraryAd[] = [
  {
    id: 301,
    title: "Casual Chic Avatar",
    description: "Trendy streetwear look with glasses and cap",
    previewType: "image",
    previewUrl: "/ai-avatars/casual-chic.png",
    category: "AI Avatar",
    style: "Casual",
    saved: false,
    ethnicity: "Middle Eastern",
  },
  {
    id: 302,
    title: "Golden Hour Model",
    description: "Natural outdoor beauty with warm lighting",
    previewType: "image",
    previewUrl: "/ai-avatars/golden-hour.png",
    category: "AI Avatar",
    style: "Natural",
    saved: false,
    ethnicity: "White / Caucasian",
  },
  {
    id: 303,
    title: "Fresh Face Avatar",
    description: "Clean, natural skin for skincare campaigns",
    previewType: "image",
    previewUrl: "/ai-avatars/fresh-face.png",
    category: "AI Avatar",
    style: "Skincare",
    saved: false,
    ethnicity: "White / Caucasian",
  },
  {
    id: 304,
    title: "Glam Beauty Model",
    description: "Polished makeup look for beauty brands",
    previewType: "image",
    previewUrl: "/ai-avatars/glam-beauty.png",
    category: "AI Avatar",
    style: "Glam",
    saved: false,
    ethnicity: "Latino / Hispanic",
  },
  {
    id: 305,
    title: "Curly Hair Avatar",
    description: "Natural curls for inclusive beauty campaigns",
    previewType: "image",
    previewUrl: "/ai-avatars/curly-hair.png",
    category: "AI Avatar",
    style: "Natural",
    saved: false,
    ethnicity: "Black / African Descent",
  },
  {
    id: 306,
    title: "Everyday Look Avatar",
    description: "Relatable, everyday aesthetic for lifestyle brands",
    previewType: "image",
    previewUrl: "/ai-avatars/everyday-look.png",
    category: "AI Avatar",
    style: "Lifestyle",
    saved: false,
    ethnicity: "White / Caucasian",
  },
  {
    id: 307,
    title: "Summer Glow Model",
    description: "Bright, sunny aesthetic for warm campaigns",
    previewType: "image",
    previewUrl: "/ai-avatars/summer-glow.png",
    category: "AI Avatar",
    style: "Summer",
    saved: false,
    ethnicity: "Mixed / Multi-ethnic",
  },
  {
    id: 308,
    title: "Beach Vibes Avatar",
    description: "Tropical vacation look for resort brands",
    previewType: "image",
    previewUrl: "/ai-avatars/beach-vibes.png",
    category: "AI Avatar",
    style: "Beach",
    saved: false,
    ethnicity: "White / Caucasian",
  },
  {
    id: 309,
    title: "Male Model Avatar",
    description: "Casual masculine look for men's brands",
    previewType: "image",
    previewUrl: "/ai-avatars/male-model.png",
    category: "AI Avatar",
    style: "Male",
    saved: false,
    ethnicity: "White / Caucasian",
  },
];

const prototypeImageAds: LibraryAd[] = [
  ...imageAds,
  ...imageAds.map((ad, index) => ({
    ...ad,
    id: ad.id + 1000 + index,
    saved: false,
  })),
];

const prototypeVideoAds: LibraryAd[] = [
  ...videoAds,
  ...videoAds.map((ad, index) => ({
    ...ad,
    id: ad.id + 1000 + index,
    saved: false,
  })),
];

const prototypeAiModelAds: LibraryAd[] = [
  ...aiModelAds,
  ...aiModelAds.map((ad, index) => ({
    ...ad,
    id: ad.id + 1000 + index,
    saved: false,
  })),
];

type FilterState = {
  format: string[];
  niche: string;
  subNiche: string;
  model: string[];
  ethnicity: string[];
  creativeDirection: string[];
  campaignType: string[];
};

const normalizeText = (value: string) => value.toLowerCase().trim();

const matchesNiche = (adCategory: string, selectedNiche: string) => {
  if (!selectedNiche || selectedNiche === "All") return true;

  const category = normalizeText(adCategory || "");
  const niche = normalizeText(selectedNiche);

  if (niche.includes("fashion")) return category.includes("fashion") || category.includes("apparel");
  if (niche.includes("beauty")) return category.includes("beauty") || category.includes("skincare") || category.includes("hair");
  if (niche.includes("health")) return category.includes("fitness") || category.includes("wellness") || category.includes("supplement");
  if (niche.includes("jewelry")) return category.includes("jewelry") || category.includes("accessor");
  if (niche.includes("baby") || niche.includes("kids")) return category.includes("kids") || category.includes("baby");
  if (niche.includes("food")) return category.includes("food") || category.includes("beverage") || category.includes("snack");
  if (niche.includes("home")) return category.includes("home") || category.includes("living") || category.includes("decor");
  if (niche.includes("digital")) return category.includes("digital") || category.includes("software") || category.includes("course");
  if (niche.includes("electronics") || niche.includes("tech")) return category.includes("electronics") || category.includes("tech");

  return true;
};

const matchesModel = (ad: LibraryAd, selected: string[]) => {
  if (!selected.length) return true;
  const haystack = normalizeText(`${ad.title} ${ad.description} ${ad.style}`);

  const match = (needle: string) => haystack.includes(normalizeText(needle));

  // Best-effort mapping for a few common cases
  if (selected.includes("Single Model (Male)")) return match("male");
  if (selected.includes("Single Model (Female)")) return match("female") || match("woman") || match("girl");
  if (selected.includes("UGC-Style (Phone-shot)")) return match("ugc") || match("phone");
  if (selected.includes("Influencer-Style")) return match("influencer") || match("creator");
  if (selected.includes("Hands-Only")) return match("hand");
  if (selected.includes("No Model (Product Only)")) return match("product") || match("close") || match("detail");

  // Fallback: allow if any selected label keyword is present
  return selected.some((option) => {
    if (option === "All") return true;
    const simplified = normalizeText(option.replace(/\(.*?\)/g, ""));
    const token = simplified.split(" ").find(Boolean) || simplified;
    return token ? haystack.includes(token) : false;
  });
};

export default function AdLibrary({
  onSelectAd,
  mode,
  defaultNiche,
  recommendedCreativeDirections,
  onSelectionCountsChange,
  selection,
}: {
  onSelectAd?: (adId: number) => void;
  mode?: "default" | "create_campaign";
  defaultNiche?: { niche: string; subNiche?: string };
  recommendedCreativeDirections?: string[];
  onSelectionCountsChange?: (counts: {
    videos: number;
    images: number;
    imageTemplates: number;
    aiModels: number;
  }) => void;
  selection?: {
    enabled: boolean;
    selectedIds: number[];
    maxVideos: number;
    maxImages: number;
    onChangeSelectedIds: (next: number[]) => void;
  };
}) {
  const router = useRouter();
  const setToast = useToastStore((state) => state.setToast);
  const [activeTab, setActiveTab] = useState<"image" | "video" | "ai">("image");
  const [showConnectStoreModal, setShowConnectStoreModal] = useState(false);
  const [savedAds, setSavedAds] = useState<number[]>([]);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [filters, setFilters] = useState<FilterState>({
    format: [],
    niche: "All",
    subNiche: "All",
    model: [],
    ethnicity: [],
    creativeDirection: [],
    campaignType: [],
  });
  const selectionEnabled = !!selection?.enabled;

  const creativeDirectionBadges = useMemo(() => {
    const badges: Record<string, string> = {};
    for (const option of creativeDirectionOptions) {
      if (option === "All") continue;
      if (recommendedCreativeDirections?.includes(option)) badges[option] = "Recommended";
    }
    return badges;
  }, [recommendedCreativeDirections]);

  useEffect(() => {
    if (!defaultNiche?.niche) return;
    setFilters((prev) => {
      if (prev.niche !== "All") return prev;
      return {
        ...prev,
        niche: defaultNiche.niche,
        subNiche: defaultNiche.subNiche || "All",
      };
    });
  }, [defaultNiche?.niche, defaultNiche?.subNiche]);

  useEffect(() => {
    if (mode !== "create_campaign") return;
    if (!recommendedCreativeDirections?.length) return;
    setFilters((prev) => {
      if (prev.creativeDirection.length > 0) return prev;
      const allowed = new Set(creativeDirectionOptions);
      const next = recommendedCreativeDirections.filter((v) => v !== "All" && allowed.has(v));
      return { ...prev, creativeDirection: next };
    });
  }, [mode, recommendedCreativeDirections]);

  const recommendedCampaignTypes = useMemo(() => getRecommendedCampaignTypes(), []);
  const campaignTypeBadges = useMemo(() => {
    const badges: Record<string, string> = {};
    for (const option of campaignTypeOptions) {
      if (option === "All") continue;
      if (recommendedCampaignTypes.has(option)) badges[option] = "Recommended";
    }
    return badges;
  }, [recommendedCampaignTypes]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filters]);

  useEffect(() => {
    const compute = () => {
      // Match our grid breakpoints: base=1 col, sm=2 cols, lg=4 cols
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 640) return 2;
      return 1;
    };

    const next = compute();
    setItemsPerPage(next);

    const onResize = () => {
      const computed = compute();
      setItemsPerPage((prev) => {
        if (prev === computed) return prev;
        setCurrentPage(1);
        return computed;
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleCloneAd = (adId?: number) => {
    if (typeof adId === "number" && typeof onSelectAd === "function") {
      onSelectAd(adId);
      return;
    }

    const qs = new URLSearchParams();
    qs.set("source", "library");
    if (typeof adId === "number") qs.set("adId", String(adId));
    router.push(`/dashboard-v2/create-campaign/product-selection?${qs.toString()}`);
  };

  const toggleSaveAd = (adId: number) => {
    setSavedAds((prev) =>
      prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
    );
  };

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const updateMultiFilter = (
    key: "format" | "model" | "ethnicity" | "creativeDirection" | "campaignType",
    value: string
  ) => {
    setFilters((prev) => {
      if (value === "All") return { ...prev, [key]: [] };

      const current = prev[key];
      if (key === "creativeDirection") {
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [key]: next };
      }

      const next = current[0] === value ? [] : [value];
      return { ...prev, [key]: next };
    });

    if (key !== "creativeDirection") {
      setOpenFilter(null);
    }
  };

  const updateNicheFilter = (niche: string, subNiche?: string) => {
    setFilters((prev) => ({
      ...prev,
      niche,
      subNiche: subNiche || "All",
    }));
    if (subNiche) {
      setOpenFilter(null);
    }
  };

  const getAds = () => {
    let ads: LibraryAd[];
    switch (activeTab) {
      case "image":
        ads = [...prototypeImageAds, ...seasonalAds.filter((ad) => ad.previewType === "image")];
        break;
      case "video":
        ads = [...prototypeVideoAds, ...seasonalAds.filter((ad) => ad.previewType === "video")];
        break;
      case "ai":
        ads = prototypeAiModelAds;
        break;
      default:
        ads = [...prototypeImageAds, ...seasonalAds.filter((ad) => ad.previewType === "image")];
    }

    if (filters.campaignType.length > 0 && activeTab !== "ai") {
      const allowed = new Set(filters.campaignType);
      ads = ads.filter((ad) => !!ad.campaignType && allowed.has(ad.campaignType));
    }

    if (filters.ethnicity.length > 0) {
      ads = ads.filter((ad) => !!ad.ethnicity && filters.ethnicity.includes(ad.ethnicity));
    }

    if (filters.model.length > 0) {
      ads = ads.filter((ad) => matchesModel(ad, filters.model));
    }

    if (activeTab !== "ai" && filters.niche !== "All") {
      ads = ads.filter((ad) => matchesNiche(ad.category, filters.niche));
    }

    if (activeTab === "video" && filters.creativeDirection.length > 0) {
      const allowed = new Set(filters.creativeDirection);
      ads = ads.filter((ad) => allowed.has(ad.title));
    }

    return ads;
  };

  const allAds = getAds();
  const selectedIds = selection?.selectedIds || [];
  const selectedById = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedCounts = useMemo(() => {
    const allSelectable = [
      ...prototypeImageAds,
      ...prototypeVideoAds,
      ...seasonalAds,
      ...prototypeAiModelAds,
    ];
    const byId = new Map(allSelectable.map((ad) => [ad.id, ad] as const));
    let videos = 0;
    let images = 0;
    let imageTemplates = 0;
    let aiModels = 0;
    for (const id of selectedIds) {
      const ad = byId.get(id);
      if (!ad) continue;
      if (ad.previewType === "video") videos += 1;
      if (ad.previewType === "image") images += 1;
      if (ad.previewType === "image" && ad.category !== "AI Avatar") imageTemplates += 1;
      if (ad.category === "AI Avatar") aiModels += 1;
    }
    return { videos, images, imageTemplates, aiModels };
  }, [selectedIds]);

  useEffect(() => {
    if (!selectionEnabled) return;
    if (!onSelectionCountsChange) return;
    onSelectionCountsChange(selectedCounts);
  }, [onSelectionCountsChange, selectedCounts, selectionEnabled]);

  const isTemplateSelectionDisabled = (ad: LibraryAd) => {
    if (!selectionEnabled || !selection) return false;
    if (selectedById.has(ad.id)) return false;

    if (activeTab === "ai" || ad.category === "AI Avatar") {
      return selectedCounts.aiModels >= selectedCounts.imageTemplates;
    }

    if (ad.previewType === "video") return selectedCounts.videos >= selection.maxVideos;
    if (ad.previewType === "image") return selectedCounts.images >= selection.maxImages;
    return false;
  };

  const toggleSelectedTemplate = (ad: LibraryAd) => {
    if (!selectionEnabled || !selection) return;
    const isSelected = selectedById.has(ad.id);
    if (!isSelected && isTemplateSelectionDisabled(ad)) {
      if (activeTab === "ai" || ad.category === "AI Avatar") {
        const max = selectedCounts.imageTemplates;
        setToast({
          title: "Selection limit reached",
          message:
            max === 0
              ? "Select at least 1 image ad before choosing AI models."
              : `You can’t select more AI models than your selected image ads (${max}).`,
          type: "warning",
        });
      } else {
        const isVideo = ad.previewType === "video";
        const max = isVideo ? selection.maxVideos : selection.maxImages;
        setToast({
          title: "Selection limit reached",
          message: `You can’t select more ${isVideo ? "video" : "image"} models than the recommended amount approved in Creative direction (${max}).`,
          type: "warning",
        });
      }
      return;
    }
    const next = isSelected
      ? selectedIds.filter((id) => id !== ad.id)
      : [...selectedIds, ad.id];
    selection.onChangeSelectedIds(next);
  };
  const totalPages = Math.ceil(allAds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAds = allAds.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-[rgba(246,246,246,0.75)] rounded-3xl p-4 lg:p-6 min-h-[400px]">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <button className="text-purple-dark hover:text-purple-normal transition-colors -ml-7">
            <ArrowLeft2 size={20} />
          </button>
          <h2 className="text-purple-dark font-semibold text-xl">Use Our Ready Made Creative Templates</h2>
        </div>
        <p className="text-gray-500 text-sm">Select a creative style for your image and video ads, and we’ll adapt it using your product.</p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("image")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "image"
                ? "text-purple-dark border-purple-normal"
                : "text-gray-dark border-transparent hover:text-purple-dark"
            }`}
          >
            <Play size={14} />
            Image Ads
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "video"
                ? "text-purple-dark border-purple-normal"
                : "text-gray-dark border-transparent hover:text-purple-dark"
            }`}
          >
            <Video size={14} />
            Video Ads
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "ai"
                ? "text-purple-dark border-purple-normal"
                : "text-gray-dark border-transparent hover:text-purple-dark"
            }`}
          >
            <Magicpen size={14} />
            AI Models
          </button>
        </div>

        <p className="text-xs text-gray-500">
          {allAds.length} templates available
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {activeTab !== "ai" && (
          <FilterDropdown
            label="Campaign Type"
            options={campaignTypeOptions}
            selected={filters.campaignType}
            isOpen={openFilter === "campaignType"}
            onToggle={() => toggleFilter("campaignType")}
            onSelect={(value) => updateMultiFilter("campaignType", value)}
            optionBadges={campaignTypeBadges}
          />
        )}

        {activeTab !== "ai" && (
          <NicheDropdown
            selectedNiche={filters.niche}
            selectedSubNiche={filters.subNiche}
            isOpen={openFilter === "niche"}
            onToggle={() => toggleFilter("niche")}
            onSelect={updateNicheFilter}
          />
        )}

        <FilterDropdown
          label="Model"
          options={modelOptions}
          selected={filters.model}
          isOpen={openFilter === "model"}
          onToggle={() => toggleFilter("model")}
          onSelect={(value) => updateMultiFilter("model", value)}
        />

        <FilterDropdown
          label="Model Ethnicity"
          options={ethnicityOptions}
          selected={filters.ethnicity}
          isOpen={openFilter === "ethnicity"}
          onToggle={() => toggleFilter("ethnicity")}
          onSelect={(value) => updateMultiFilter("ethnicity", value)}
        />

        {activeTab === "video" && (
          <FilterDropdown
            label="Creative Direction"
            options={creativeDirectionOptions}
            selected={filters.creativeDirection}
            isOpen={openFilter === "creativeDirection"}
            onToggle={() => toggleFilter("creativeDirection")}
            onSelect={(value) => updateMultiFilter("creativeDirection", value)}
            optionBadges={creativeDirectionBadges}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentAds.map((ad) => (
          <div
            key={ad.id}
            className={`bg-white border border-[#F3EFF6] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group ${
              selectionEnabled && isTemplateSelectionDisabled(ad) ? "opacity-60" : ""
            }`}
          >
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full gradient flex items-center justify-center text-white text-xs font-bold">
                    {ad.title.charAt(0)}
                  </div>
                  <span className="text-purple-dark font-semibold text-sm">{ad.title}</span>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                  {ad.style}
                </span>
              </div>
              <p className="text-gray-500 text-xs line-clamp-2 mb-2">
                {ad.description}
              </p>
            </div>
            
            <div className="relative h-[220px] mx-4 rounded-xl overflow-hidden">
              {selectionEnabled ? (
                <label className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm border border-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedById.has(ad.id)}
                    disabled={isTemplateSelectionDisabled(ad)}
                    onChange={() => toggleSelectedTemplate(ad)}
                    className="h-4 w-4"
                  />
                  <span className="text-[10px] text-purple-dark font-medium">
                    Select
                  </span>
                </label>
              ) : null}
              {ad.previewType === "video" ? (
                <>
                  <video
                    src={ad.previewUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none group-hover:opacity-0 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-xl border-2 border-white">
                      <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[12px] border-l-purple-dark ml-1"></div>
                    </div>
                  </div>
                </>
              ) : (
                <img
                  src={ad.previewUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => toggleSaveAd(ad.id)}
                className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <Heart
                  size={14}
                  variant={savedAds.includes(ad.id) ? "Bold" : "Linear"}
                  className={savedAds.includes(ad.id) ? "text-red-500" : "text-gray-600"}
                />
              </button>
            </div>
            
            <div className="p-4 pt-3">
              <p className="text-purple-dark text-xs font-medium mb-3">
                {activeTab === "ai"
                  ? aiAvatarNamesById[ad.id] || ad.title
                  : ad.category}
              </p>

              {!selectionEnabled ? (
                <>
                  <button className="w-full py-2.5 bg-white border border-[#E6DCF0] text-purple-dark text-xs rounded-full hover:bg-[#F3EFF6] transition-colors flex items-center justify-center gap-1.5 font-medium mb-2">
                    <Eye size={14} />
                    View Details
                  </button>
                  {mode !== "create_campaign" ? (
                    <button
                      onClick={() => handleCloneAd(ad.id)}
                      className="w-full py-2.5 gradient text-white text-xs rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-1.5 font-medium"
                    >
                      <Copy size={14} />
                      Use Template
                    </button>
                  ) : null}
                </>
              ) : (
                <div className="text-xs text-gray-500">
                  {ad.previewType === "video"
                    ? `${selectedCounts.videos}/${selection?.maxVideos ?? 0} videos selected`
                    : `${selectedCounts.images}/${selection?.maxImages ?? 0} images selected`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-purple-dark hover:bg-[#F3EFF6]"
            }`}
          >
            <ArrowLeft2 size={18} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium leading-none flex items-center justify-center transition-colors ${
                currentPage === page
                  ? "gradient text-white"
                  : "text-gray-dark hover:bg-[#F3EFF6]"
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-purple-dark hover:bg-[#F3EFF6]"
            }`}
          >
            <ArrowRight2 size={18} />
          </button>
        </div>
      )}

      {showConnectStoreModal && (
        <ConnectStore
          isOpen={showConnectStoreModal}
          closeModal={() => setShowConnectStoreModal(false)}
        />
      )}
    </div>
  );
}

function FilterDropdown({
  label,
  options,
  selected,
  isOpen,
  onToggle,
  onSelect,
  optionBadges,
}: {
  label: string;
  options: string[];
  selected: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  optionBadges?: Record<string, string>;
}) {
  const isActive = selected.length > 0;
  const displayValue = selected.length === 0 ? null : selected;

  const displayText = useMemo(() => {
    if (!displayValue) return null;
    if (displayValue.length === 1) return displayValue[0];
    return `${displayValue[0]} +${displayValue.length - 1}`;
  }, [displayValue]);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border transition-colors ${
          isActive
            ? "bg-purple-normal text-white border-purple-normal"
            : "bg-white text-gray-dark border-[#E6DCF0] hover:border-purple-light"
        }`}
      >
        {label}
        {displayText && <span className="font-medium">: {displayText}</span>}
        <ArrowDown2 size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#E6DCF0] rounded-xl shadow-lg z-20 min-w-[180px] max-h-[280px] overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`w-full text-left px-4 py-2 text-xs hover:bg-[#F3EFF6] transition-colors flex items-center justify-between first:rounded-t-xl last:rounded-b-xl ${
                (option === "All" ? selected.length === 0 : selected.includes(option))
                  ? "text-purple-normal font-medium"
                  : "text-gray-dark"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{option}</span>
                {optionBadges?.[option] && (
                  <span className="text-[10px] leading-none px-2 py-1 rounded-full bg-[#F3EFF6] text-purple-dark">
                    {optionBadges[option]}
                  </span>
                )}
              </div>
              {(option === "All" ? selected.length === 0 : selected.includes(option)) && (
                <TickCircle size={14} variant="Bold" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NicheDropdown({
  selectedNiche,
  selectedSubNiche,
  isOpen,
  onToggle,
  onSelect,
}: {
  selectedNiche: string;
  selectedSubNiche: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (niche: string, subNiche?: string) => void;
}) {
  const [expandedNiche, setExpandedNiche] = useState<string | null>(null);
  const isActive = selectedNiche !== "All";

  const getDisplayValue = () => {
    if (selectedNiche === "All") return null;
    if (selectedSubNiche !== "All") return selectedSubNiche;
    return selectedNiche;
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border transition-colors ${
          isActive
            ? "bg-purple-normal text-white border-purple-normal"
            : "bg-white text-gray-dark border-[#E6DCF0] hover:border-purple-light"
        }`}
      >
        Niche
        {getDisplayValue() && <span className="font-medium">: {getDisplayValue()}</span>}
        <ArrowDown2 size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#E6DCF0] rounded-xl shadow-lg z-20 min-w-[240px] max-h-[350px] overflow-y-auto">
          <button
            onClick={() => onSelect("All")}
            className={`w-full text-left px-4 py-2 text-xs hover:bg-[#F3EFF6] transition-colors flex items-center justify-between rounded-t-xl ${
              selectedNiche === "All" ? "text-purple-normal font-medium" : "text-gray-dark"
            }`}
          >
            All Niches
            {selectedNiche === "All" && <TickCircle size={14} variant="Bold" />}
          </button>
          {nicheCategories.map((category, idx) => (
            <div key={category.name} className={idx === nicheCategories.length - 1 ? "rounded-b-xl" : ""}>
              <button
                onClick={() => {
                  if (expandedNiche === category.name) {
                    setExpandedNiche(null);
                  } else {
                    setExpandedNiche(category.name);
                  }
                }}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-[#F3EFF6] transition-colors flex items-center justify-between ${
                  selectedNiche === category.name ? "text-purple-normal font-medium" : "text-gray-dark"
                }`}
              >
                <div className="flex items-center gap-2">
                  {category.name}
                  <span className="text-[10px] text-gray-light">({category.subNiches.length})</span>
                </div>
                <ArrowRight2 size={12} className={`transition-transform ${expandedNiche === category.name ? "rotate-90" : ""}`} />
              </button>
              {expandedNiche === category.name && (
                <div className="bg-[#FAFAFA] border-t border-[#E6DCF0]">
                  <button
                    onClick={() => onSelect(category.name, "All")}
                    className={`w-full text-left px-6 py-2 text-xs hover:bg-[#F3EFF6] transition-colors flex items-center justify-between ${
                      selectedNiche === category.name && selectedSubNiche === "All" ? "text-purple-normal font-medium" : "text-gray-dark"
                    }`}
                  >
                    All {category.name}
                    {selectedNiche === category.name && selectedSubNiche === "All" && <TickCircle size={12} variant="Bold" />}
                  </button>
                  {category.subNiches.map((subNiche) => (
                    <button
                      key={subNiche}
                      onClick={() => onSelect(category.name, subNiche)}
                      className={`w-full text-left px-6 py-2 text-xs hover:bg-[#F3EFF6] transition-colors flex items-center justify-between ${
                        selectedNiche === category.name && selectedSubNiche === subNiche ? "text-purple-normal font-medium" : "text-gray-dark"
                      }`}
                    >
                      {subNiche}
                      {selectedNiche === category.name && selectedSubNiche === subNiche && <TickCircle size={12} variant="Bold" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
