"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchNormal1, ArrowDown2, Play, Eye, Copy, ArrowLeft2, TickCircle, Heart, CloseCircle, ArrowRight2, InfoCircle } from "iconsax-react";

type Ad = {
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
  saved: boolean;
  adScore: number;
};

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
    name: "Food & Beverages",
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
    name: "Hobbies & Lifestyle",
    subNiches: ["Art Supplies", "Craft Kits", "Photography Gear", "Music Accessories", "Collectibles", "DIY Kits", "Gaming Accessories", "Board Games & Puzzles"]
  },
  {
    name: "Luxury & Premium",
    subNiches: ["Designer-inspired Goods", "Premium Home Goods", "Luxury Candles", "High-end Beauty", "Bespoke Products", "Limited Edition Drops"]
  },
  {
    name: "Seasonal & Occasions",
    subNiches: ["Holiday Decor", "Gift Boxes", "Wedding Products", "Party Supplies", "Corporate Gifting", "Back-to-School"]
  },
  {
    name: "Sustainability & Impact",
    subNiches: ["Zero-Waste Products", "Reusable Household", "Sustainable Fashion", "Ethical Beauty", "Carbon-Neutral Brands", "Refill Products"]
  },
  {
    name: "B2B & Professional",
    subNiches: ["Office Supplies", "Corporate Merch", "Branded Swag", "POS Accessories", "Restaurant Supplies", "Salon Supplies"]
  },
  {
    name: "Home Improvement",
    subNiches: ["Furniture", "Home Decor", "Lighting", "Smart Home Devices", "DIY Tools", "Paint & Wall Treatments", "Flooring & Rugs", "Storage & Organization", "Home Security", "Garden & Outdoor"]
  },
  {
    name: "Household Products",
    subNiches: ["Cleaning Supplies", "Laundry Products", "Kitchen Essentials", "Storage & Containers", "Paper Products", "Air Fresheners", "Pest Control", "Home Safety", "Eco-friendly Items"]
  },
  {
    name: "Life Services",
    subNiches: ["Personal Care Services", "Home Cleaning Services", "Moving & Storage", "Repair & Maintenance", "Wellness & Therapy", "Childcare Services", "Elder Care", "Event Services"]
  },
  {
    name: "News & Entertainment",
    subNiches: ["Streaming Services", "Digital Publications", "Magazines", "Gaming Content", "Podcasts", "Event Tickets", "Books & Audiobooks", "Music Platforms"]
  },
  {
    name: "Sports & Outdoors",
    subNiches: ["Fitness Equipment", "Sports Apparel", "Outdoor Gear", "Camping & Hiking", "Cycling", "Water Sports", "Team Sports Gear", "Hunting & Fishing", "Recovery Tools"]
  },
  {
    name: "Tech & Electronics",
    subNiches: ["Mobile Phones", "Phone Accessories", "Laptops & Computers", "Audio Equipment", "Wearables", "Smart Devices", "Gaming Consoles", "Tech Accessories"]
  }
];

const mockAds: Ad[] = [
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
    saved: false,
    adScore: 92,
  },
  {
    id: 2,
    brand: "NomadGear",
    isNew: true,
    daysAgo: null,
    previewType: "image",
    previewUrl: "/ad-assets/0b113324-a1a5-415b-99e2-1a8139f6529e_1766197795897.png",
    headline: "Travel in style with our premium carry-on. Designed for the modern explorer who refuses to compromise...",
    domain: "www.nomadgear.co",
    productName: "Urban Explorer Rolling Bag",
    cta: "Shop Now",
    platform: "meta",
    niche: "Jewelry & Accessories",
    subNiche: "Bags & Wallets",
    status: "active",
    saved: true,
    adScore: 78,
  },
  {
    id: 3,
    brand: "FitForm",
    isNew: true,
    daysAgo: null,
    previewType: "image",
    previewUrl: "/ad-assets/9b63b13f-e770-42dd-a300-36cef414b8c1_1766197795898.png",
    headline: "Elevate your workout game. Premium activewear that moves with you through every rep and stretch...",
    domain: "www.fitform.com",
    productName: "Pro Performance Leggings Set",
    cta: "Shop Now",
    platform: "tiktok",
    niche: "Fashion & Apparel",
    subNiche: "Activewear & Athleisure",
    status: "active",
    saved: false,
    adScore: 85,
  },
  {
    id: 4,
    brand: "SkateFlow",
    isNew: true,
    daysAgo: null,
    previewType: "image",
    previewUrl: "/ad-assets/29f2b7d0-0ca0-42b6-ab01-e94ad8a007ad_1766197795898.png",
    headline: "Feel the freedom of flight. Our pro-grade inline skates deliver unmatched speed and control...",
    domain: "www.skateflow.com",
    productName: "Pro Inline Skates",
    cta: "Shop Now",
    platform: "meta",
    niche: "Sports & Outdoors",
    subNiche: "Outdoor Gear",
    status: "active",
    saved: false,
    adScore: 67,
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
    saved: true,
    adScore: 94,
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
    saved: false,
    adScore: 88,
  },
  {
    id: 7,
    brand: "HomeStyle",
    isNew: true,
    daysAgo: null,
    previewType: "video",
    previewUrl: "/ad-assets/a5928bf1-8cca-4f11-80c1-d48602facf5a_1766197795899.mp4",
    headline: "Create the cozy sanctuary you deserve. Our luxury bedding transforms any bedroom into a 5-star retreat...",
    domain: "www.homestyle.co",
    productName: "Cloud Comfort Bedding Set",
    cta: "Learn More",
    platform: "meta",
    niche: "Home & Living",
    subNiche: "Bedding & Mattresses",
    status: "active",
    saved: false,
    adScore: 73,
  },
  {
    id: 8,
    brand: "TechPro",
    isNew: false,
    daysAgo: 3,
    previewType: "video",
    previewUrl: "/ad-assets/a7aa648c-6d7b-463a-8c47-998e25342aaa_1766197795900.mp4",
    headline: "The future of audio is here. Experience crystal-clear sound with our AI-powered earbuds...",
    domain: "www.techpro.io",
    productName: "AirPods Pro Max",
    cta: "Shop Now",
    platform: "meta",
    niche: "Tech & Electronics",
    subNiche: "Audio Equipment",
    status: "active",
    saved: true,
    adScore: 81,
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
    saved: false,
    adScore: 96,
  },
  {
    id: 10,
    brand: "PetPals",
    isNew: true,
    daysAgo: null,
    previewType: "video",
    previewUrl: "/ad-assets/Download_(1)_1766197795901.mp4",
    headline: "Your furry friend deserves the best. Premium pet accessories that combine style with comfort...",
    domain: "www.petpals.store",
    productName: "Luxury Pet Travel Carrier",
    cta: "Shop Now",
    platform: "meta",
    niche: "Baby & Kids",
    subNiche: "Baby Gear",
    status: "inactive",
    saved: false,
    adScore: 45,
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
    saved: true,
    adScore: 89,
  },
];

const formatOptions = ["All", "Video", "Image"];
const platformOptions = ["All", "Meta", "TikTok"];
const statusOptions = ["All", "Active", "Inactive"];
const sortOptions = ["Newest", "Oldest", "Most Popular"];

export default function CompetitorAds() {
  const [activeTab, setActiveTab] = useState<"explore" | "foryou">("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [ads, setAds] = useState<Ad[]>(mockAds);

  const [filters, setFilters] = useState({
    format: "All",
    platform: "All",
    status: "All",
    niche: "All",
    subNiche: "All",
  });
  const [adRankRange, setAdRankRange] = useState<[number, number]>([0, 100]);

  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const updateFilter = (filterName: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setOpenFilter(null);
  };

  const updateNicheFilter = (niche: string, subNiche?: string) => {
    setFilters((prev) => ({
      ...prev,
      niche: niche,
      subNiche: subNiche || "All",
    }));
    setOpenFilter(null);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.format !== "All") count++;
    if (filters.platform !== "All") count++;
    if (filters.status !== "All") count++;
    if (filters.niche !== "All") count++;
    if (adRankRange[0] !== 0 || adRankRange[1] !== 100) count++;
    return count;
  };

  const filteredAds = useMemo(() => {
    let result = [...ads];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (ad) =>
          ad.brand.toLowerCase().includes(query) ||
          ad.headline.toLowerCase().includes(query) ||
          ad.productName.toLowerCase().includes(query)
      );
    }

    if (filters.format !== "All") {
      result = result.filter((ad) => ad.previewType === filters.format.toLowerCase());
    }

    if (filters.platform !== "All") {
      result = result.filter((ad) => ad.platform === filters.platform.toLowerCase());
    }

    if (filters.status !== "All") {
      result = result.filter((ad) => ad.status === filters.status.toLowerCase());
    }

    if (filters.niche !== "All") {
      result = result.filter((ad) => ad.niche === filters.niche);
      if (filters.subNiche !== "All") {
        result = result.filter((ad) => ad.subNiche === filters.subNiche);
      }
    }

    if (adRankRange[0] !== 0 || adRankRange[1] !== 100) {
      result = result.filter((ad) => ad.adScore >= adRankRange[0] && ad.adScore <= adRankRange[1]);
    }

    if (showSavedOnly) {
      result = result.filter((ad) => ad.saved);
    }

    if (activeTab === "foryou") {
      result = result.filter((ad) => ad.saved || ad.isNew);
    }

    if (sortBy === "Oldest") {
      result = result.reverse();
    }

    return result;
  }, [ads, searchQuery, filters, sortBy, showSavedOnly, activeTab, adRankRange]);

  useEffect(() => {
    const fetchSavedAds = async () => {
      try {
        const response = await fetch("/api/saved-ads");
        const data = await response.json();
        if (data.savedAdIds) {
          setAds((prev) =>
            prev.map((ad) => ({
              ...ad,
              saved: data.savedAdIds.includes(String(ad.id)),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching saved ads:", error);
      }
    };
    fetchSavedAds();
  }, []);

  const toggleSaveAd = async (adId: number) => {
    const ad = ads.find((a) => a.id === adId);
    if (!ad) return;

    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, saved: !a.saved } : a))
    );

    try {
      await fetch("/api/saved-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad }),
      });
    } catch (error) {
      console.error("Error saving ad:", error);
      setAds((prev) =>
        prev.map((a) => (a.id === adId ? { ...a, saved: !a.saved } : a))
      );
    }
  };

  const clearFilters = () => {
    setFilters({
      format: "All",
      platform: "All",
      status: "All",
      niche: "All",
      subNiche: "All",
    });
    setAdRankRange([0, 100]);
    setSearchQuery("");
    setShowSavedOnly(false);
  };

  return (
    <div className="bg-[rgba(246,246,246,0.75)] rounded-3xl p-4 lg:p-6 min-h-[600px]">
      <div className="flex items-center gap-2 mb-4">
        <button className="text-purple-dark hover:text-purple-normal transition-colors">
          <ArrowLeft2 size={20} />
        </button>
        <h2 className="text-purple-dark font-semibold text-lg">Meta Top Ads</h2>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("explore")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              activeTab === "explore"
                ? "text-purple-dark border-purple-normal"
                : "text-gray-dark border-transparent hover:text-purple-dark"
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab("foryou")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              activeTab === "foryou"
                ? "text-purple-dark border-purple-normal"
                : "text-gray-dark border-transparent hover:text-purple-dark"
            }`}
          >
            For You
          </button>
        </div>

        {showBanner && (
          <div className="flex items-center gap-2 text-xs bg-[#FEF5EA] px-3 py-2 rounded-lg">
            <span className="text-[#C67B22]">For inspiration only: These ads come from official Meta/TikTok ad libraries</span>
            <button onClick={() => setShowBanner(false)} className="text-[#C67B22] hover:text-[#A66A1A]">
              <CloseCircle size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-shrink-0 w-full sm:w-[200px]">
            <SearchNormal1 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-dark" />
            <input
              type="text"
              placeholder="Search brands, ads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-input-border rounded-xl pl-9 pr-3 py-2 text-sm text-purple-dark placeholder-gray-dark focus:outline-none focus:border-purple-normal"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 sm:ml-auto">
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1 text-sm text-gray-dark hover:text-purple-dark whitespace-nowrap"
              >
                <span>Sort: {sortBy}</span>
                <ArrowDown2 size={12} />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#F3EFF6] rounded-xl shadow-lg z-10 min-w-[120px]">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-[#F3EFF6] first:rounded-t-xl last:rounded-b-xl ${
                        sortBy === option ? "text-purple-normal font-medium" : "text-gray-dark"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                showSavedOnly ? "text-purple-normal" : "text-gray-dark hover:text-purple-dark"
              }`}
            >
              <Heart size={16} variant={showSavedOnly ? "Bold" : "Linear"} />
              <span className="hidden xs:inline">Saved ads</span>
              <span className="xs:hidden">Saved</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex items-center gap-2 min-w-max lg:flex-wrap">
          <FilterDropdown
            label="Format"
            value={filters.format}
            options={formatOptions}
            isOpen={openFilter === "format"}
            onToggle={() => toggleFilter("format")}
            onSelect={(value) => updateFilter("format", value)}
          />
          <FilterDropdown
            label="Platform"
            value={filters.platform}
            options={platformOptions}
            isOpen={openFilter === "platform"}
            onToggle={() => toggleFilter("platform")}
            onSelect={(value) => updateFilter("platform", value)}
          />
          <FilterDropdown
            label="Status"
            value={filters.status}
            options={statusOptions}
            isOpen={openFilter === "status"}
            onToggle={() => toggleFilter("status")}
            onSelect={(value) => updateFilter("status", value)}
          />
          <NicheDropdown
            selectedNiche={filters.niche}
            selectedSubNiche={filters.subNiche}
            isOpen={openFilter === "niche"}
            onToggle={() => toggleFilter("niche")}
            onSelect={updateNicheFilter}
          />
          <AdScoreDropdown
            range={adRankRange}
            isOpen={openFilter === "adScore"}
            onToggle={() => toggleFilter("adScore")}
            onRangeChange={setAdRankRange}
          />
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm text-purple-normal hover:text-purple-dark font-medium whitespace-nowrap"
            >
              Clear all
            </button>
          )}
          </div>
        </div>
      </div>

      {filteredAds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-dark text-lg mb-2">No ads found</p>
          <p className="text-gray-light text-sm mb-4">Try adjusting your filters or search query</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-purple-normal text-white rounded-xl text-sm font-medium hover:bg-purple-dark transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} onToggleSave={toggleSaveAd} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  const isActive = value !== "All";

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-3 py-1.5 border rounded-xl text-sm transition-colors ${
          isActive
            ? "bg-[#F3EFF6] border-purple-normal text-purple-dark"
            : "bg-white border-input-border text-gray-dark hover:border-purple-normal"
        }`}
      >
        {label}
        {isActive && <span className="text-purple-normal">: {value}</span>}
        <ArrowDown2 size={12} className={isOpen ? "rotate-180" : ""} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-[#F3EFF6] rounded-xl shadow-lg z-10 min-w-[140px]">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-[#F3EFF6] first:rounded-t-xl last:rounded-b-xl flex items-center justify-between ${
                value === option ? "text-purple-normal font-medium" : "text-gray-dark"
              }`}
            >
              {option}
              {value === option && <TickCircle size={14} variant="Bold" />}
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

  const getDisplayLabel = () => {
    if (selectedNiche === "All") return null;
    if (selectedSubNiche !== "All") return selectedSubNiche;
    return selectedNiche;
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-3 py-1.5 border rounded-xl text-sm transition-colors ${
          isActive
            ? "bg-[#F3EFF6] border-purple-normal text-purple-dark"
            : "bg-white border-input-border text-gray-dark hover:border-purple-normal"
        }`}
      >
        Niche
        {isActive && <span className="text-purple-normal truncate max-w-[100px]">: {getDisplayLabel()}</span>}
        <ArrowDown2 size={12} className={isOpen ? "rotate-180" : ""} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-[#F3EFF6] rounded-xl shadow-lg z-20 w-[280px] max-h-[400px] overflow-auto">
          <button
            onClick={() => onSelect("All")}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-[#F3EFF6] rounded-t-xl flex items-center justify-between ${
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
                className={`w-full px-3 py-2 text-left text-sm hover:bg-[#F3EFF6] flex items-center justify-between ${
                  selectedNiche === category.name ? "text-purple-normal font-medium" : "text-gray-dark"
                }`}
              >
                <span className="flex items-center gap-2">
                  {category.name}
                  <span className="text-[10px] text-gray-light">({category.subNiches.length})</span>
                </span>
                <ArrowRight2 size={12} className={`transition-transform ${expandedNiche === category.name ? "rotate-90" : ""}`} />
              </button>
              {expandedNiche === category.name && (
                <div className="bg-[#FAFAFA]">
                  <button
                    onClick={() => onSelect(category.name)}
                    className={`w-full pl-6 pr-3 py-1.5 text-left text-xs hover:bg-[#F3EFF6] flex items-center justify-between ${
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
                      className={`w-full pl-6 pr-3 py-1.5 text-left text-xs hover:bg-[#F3EFF6] flex items-center justify-between ${
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

function AdScoreDropdown({
  range,
  isOpen,
  onToggle,
  onRangeChange,
}: {
  range: [number, number];
  isOpen: boolean;
  onToggle: () => void;
  onRangeChange: (range: [number, number]) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isActive = range[0] !== 0 || range[1] !== 100;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-3 py-1.5 border rounded-xl text-sm transition-colors ${
          isActive
            ? "bg-[#F3EFF6] border-purple-normal text-purple-dark"
            : "bg-white border-input-border text-gray-dark hover:border-purple-normal"
        }`}
      >
        Ad Score
        <div className="relative">
          <InfoCircle 
            size={12} 
            className="text-gray-light cursor-help"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(!showTooltip);
            }}
          />
          {showTooltip && (
            <div 
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[200px] p-2 bg-purple-dark text-white text-[10px] rounded-lg shadow-lg z-30"
              onClick={(e) => e.stopPropagation()}
            >
              Ad Score estimates how likely an ad is to perform well based on real advertiser behavior, longevity, creative reuse, scale, and conversion intent
              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-dark"></div>
            </div>
          )}
        </div>
        {isActive && <span className="text-purple-normal">: {range[0]}-{range[1]}</span>}
        <ArrowDown2 size={12} className={isOpen ? "rotate-180" : ""} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-[#F3EFF6] rounded-xl shadow-lg z-10 p-4 w-[220px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-dark">Score Range</span>
            <span className="text-xs text-purple-normal font-medium">{range[0]} - {range[1]}</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-dark">Min</label>
              <input
                type="range"
                min="0"
                max="100"
                value={range[0]}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  if (newMin <= range[1]) {
                    onRangeChange([newMin, range[1]]);
                  }
                }}
                className="w-full h-1 bg-[#F3EFF6] rounded-lg appearance-none cursor-pointer accent-purple-normal"
              />
            </div>
            <div>
              <label className="text-xs text-gray-dark">Max</label>
              <input
                type="range"
                min="0"
                max="100"
                value={range[1]}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  if (newMax >= range[0]) {
                    onRangeChange([range[0], newMax]);
                  }
                }}
                className="w-full h-1 bg-[#F3EFF6] rounded-lg appearance-none cursor-pointer accent-purple-normal"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onRangeChange([80, 100])}
              className="flex-1 py-1.5 text-xs bg-[#F3EFF6] text-purple-dark rounded-lg hover:bg-[#E6DCF0]"
            >
              Top Ads (80+)
            </button>
            <button
              onClick={() => onRangeChange([0, 100])}
              className="flex-1 py-1.5 text-xs bg-[#F3EFF6] text-purple-dark rounded-lg hover:bg-[#E6DCF0]"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdCard({ ad, onToggleSave }: { ad: Ad; onToggleSave: (id: number) => void }) {
  const router = useRouter();
  const [showInsights, setShowInsights] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [showScoreTooltip, setShowScoreTooltip] = useState(false);

  const isWinningAd = ad.adScore >= 85;

  const handleClone = () => {
    setIsCloning(true);
    router.push("/create-campaign/campaign-snapshots");
  };

  return (
    <>
      <div className="bg-white border border-[#F3EFF6] rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A755FF] to-[#6800D7] flex items-center justify-center">
              <span className="text-xs text-white font-medium">{ad.brand.charAt(0)}</span>
            </div>
            <span className="text-purple-dark text-sm font-medium truncate max-w-[80px]">{ad.brand}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${ad.platform === "meta" ? "bg-[#E7F3FF] text-[#1877F2]" : "bg-[#FFF0F0] text-[#FE2C55]"}`}>
              {ad.platform === "meta" ? "Meta" : "TikTok"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(ad.id)}
              className="transition-colors"
            >
              <Heart
                size={18}
                variant={ad.saved ? "Bold" : "Linear"}
                className={ad.saved ? "text-[#E74C3C]" : "text-gray-light hover:text-[#E74C3C]"}
              />
            </button>
            {ad.isNew ? (
              <span className="px-1.5 py-0.5 bg-[#EAF7EF] text-[#27AE60] text-xs rounded font-medium">NEW</span>
            ) : ad.daysAgo ? (
              <span className="text-gray-dark text-xs">{ad.daysAgo}D</span>
            ) : null}
          </div>
        </div>

        <p className="px-3 text-gray-dark text-xs line-clamp-2 mb-2">{ad.headline}</p>

        <div className="relative flex-1 min-h-[200px] bg-[#F3EFF6] mx-3 rounded-xl overflow-hidden cursor-pointer" onClick={() => setShowInsights(true)}>
          {ad.previewType === "image" ? (
            <img
              src={ad.previewUrl}
              alt={ad.productName}
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <video
              src={ad.previewUrl}
              className="w-full h-full object-cover absolute inset-0"
              muted
              loop
              playsInline
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1D0B30]/30"></div>
          {ad.previewType === "video" && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play size={20} className="text-purple-dark ml-1" variant="Bold" />
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ad.status === "active" ? "bg-[#EAF7EF] text-[#27AE60]" : "bg-[#FEF5EA] text-[#C67B22]"}`}>
              {ad.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
            {isWinningAd && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white flex items-center gap-0.5">
                🔥 Winning Ad
              </span>
            )}
          </div>
          <div className="absolute bottom-2 left-2 z-10">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowScoreTooltip(!showScoreTooltip);
                }}
                className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium bg-white/90 text-purple-dark shadow-sm"
              >
                Ad Score: {ad.adScore}
                <InfoCircle size={10} />
              </button>
              {showScoreTooltip && (
                <div 
                  className="absolute bottom-full left-0 mb-1 w-[200px] p-2 bg-purple-dark text-white text-[10px] rounded-lg shadow-lg z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ad Score estimates how likely an ad is to perform well based on real advertiser behavior, longevity, creative reuse, scale, and conversion intent
                  <div className="absolute bottom-[-4px] left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-dark"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 flex items-center justify-between border-t border-[#F3EFF6] mt-3">
          <div className="flex-1 min-w-0">
            <p className="text-gray-dark text-xs truncate">{ad.domain}</p>
            <p className="text-purple-dark text-sm font-medium truncate">{ad.productName}</p>
          </div>
          <button className="px-3 py-1.5 bg-[#F3EFF6] text-purple-dark text-xs rounded-lg hover:bg-[#E6DCF0] transition-colors flex-shrink-0 font-medium">
            {ad.cta}
          </button>
        </div>

        <div className="p-3 pt-0 flex flex-col gap-2">
          <button
            onClick={() => setShowInsights(true)}
            className="w-full py-2.5 bg-[#F3EFF6] text-purple-dark text-sm rounded-xl hover:bg-[#E6DCF0] transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Eye size={16} />
            View insights
          </button>
          <button
            onClick={handleClone}
            disabled={isCloning}
            className={`w-full py-2.5 gradient text-white text-sm rounded-xl transition-all flex items-center justify-center gap-2 font-medium ${
              isCloning ? "opacity-70" : "hover:opacity-90"
            }`}
          >
            <Copy size={16} />
            {isCloning ? "Cloning..." : `Clone this ${ad.previewType} ad`}
          </button>
        </div>
      </div>

      {showInsights && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInsights(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-[#F3EFF6] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A755FF] to-[#6800D7] flex items-center justify-center">
                  <span className="text-sm text-white font-medium">{ad.brand.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-purple-dark font-semibold">{ad.brand}</h3>
                  <p className="text-gray-dark text-xs">{ad.subNiche} • {ad.platform === "meta" ? "Meta" : "TikTok"}</p>
                </div>
              </div>
              <button onClick={() => setShowInsights(false)} className="text-gray-dark hover:text-purple-dark">
                <CloseCircle size={24} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="aspect-video bg-[#F3EFF6] rounded-xl overflow-hidden relative">
                {ad.previewType === "video" ? (
                  <video
                    src={ad.previewUrl}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={ad.previewUrl}
                    alt={ad.productName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div>
                <h4 className="text-purple-dark font-medium mb-1">Ad Copy</h4>
                <p className="text-gray-dark text-sm">{ad.headline}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F3EFF6] rounded-xl p-3">
                  <p className="text-gray-dark text-xs mb-1">Status</p>
                  <p className={`font-medium text-sm ${ad.status === "active" ? "text-[#27AE60]" : "text-[#C67B22]"}`}>
                    {ad.status === "active" ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="bg-[#F3EFF6] rounded-xl p-3">
                  <p className="text-gray-dark text-xs mb-1">Format</p>
                  <p className="text-purple-dark font-medium text-sm capitalize">{ad.previewType}</p>
                </div>
                <div className="bg-[#F3EFF6] rounded-xl p-3">
                  <p className="text-gray-dark text-xs mb-1">Platform</p>
                  <p className="text-purple-dark font-medium text-sm">{ad.platform === "meta" ? "Meta" : "TikTok"}</p>
                </div>
                <div className="bg-[#F3EFF6] rounded-xl p-3">
                  <p className="text-gray-dark text-xs mb-1">Niche</p>
                  <p className="text-purple-dark font-medium text-sm">{ad.niche}</p>
                </div>
                <div className="bg-[#F3EFF6] rounded-xl p-3 col-span-2">
                  <p className="text-gray-dark text-xs mb-1">Sub-Niche</p>
                  <p className="text-purple-dark font-medium text-sm">{ad.subNiche}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onToggleSave(ad.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    ad.saved
                      ? "bg-[#FEE7E5] text-[#E74C3C]"
                      : "bg-[#F3EFF6] text-purple-dark hover:bg-[#E6DCF0]"
                  }`}
                >
                  <Heart size={16} variant={ad.saved ? "Bold" : "Linear"} />
                  {ad.saved ? "Saved" : "Save Ad"}
                </button>
                <button
                  onClick={() => {
                    handleClone();
                    setShowInsights(false);
                  }}
                  className="flex-1 py-2.5 gradient text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <Copy size={16} />
                  Clone Ad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
