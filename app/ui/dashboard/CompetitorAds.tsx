"use client";
import { useState, useMemo } from "react";
import { SearchNormal1, ArrowDown2, Play, Eye, Copy, ArrowLeft2, TickCircle, Heart, CloseCircle, ArrowRight2 } from "iconsax-react";

type Ad = {
  id: number;
  brand: string;
  isNew: boolean;
  daysAgo: number | null;
  previewType: "video" | "image";
  headline: string;
  domain: string;
  productName: string;
  cta: string;
  platform: "meta" | "tiktok";
  niche: string;
  subNiche: string;
  status: "active" | "inactive";
  saved: boolean;
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
    brand: "BURLEBO",
    isNew: true,
    daysAgo: null,
    previewType: "video",
    headline: "Taking after Dad already! Check out all the latest BURLEY-baby...",
    domain: "www.burlebo.com",
    productName: "BURLEBO Baby Zip Ups",
    cta: "Shop Now",
    platform: "meta",
    niche: "Fashion & Apparel",
    subNiche: "Kids & Baby Clothing",
    status: "active",
    saved: false,
  },
  {
    id: 2,
    brand: "Zeely Market",
    isNew: true,
    daysAgo: null,
    previewType: "video",
    headline: "Add comfort & style to your space with Nu Jants! Our quality throw...",
    domain: "zee.store",
    productName: "Could your living room or wardrob...",
    cta: "Learn More",
    platform: "meta",
    niche: "Home & Living",
    subNiche: "Bedding & Mattresses",
    status: "active",
    saved: true,
  },
  {
    id: 3,
    brand: "Zeely Market",
    isNew: true,
    daysAgo: null,
    previewType: "video",
    headline: "Tired of dull outfits? Transform your style with Luo's Shop's...",
    domain: "zeely.store",
    productName: "Discover Exclusive Deals at Luo's...",
    cta: "Learn More",
    platform: "tiktok",
    niche: "Fashion & Apparel",
    subNiche: "Women's Clothing",
    status: "active",
    saved: false,
  },
  {
    id: 4,
    brand: "Zeely Market",
    isNew: true,
    daysAgo: null,
    previewType: "image",
    headline: "Tired of endless mall trips? Shop smart with Luo's Shop—your on...",
    domain: "zeely.store",
    productName: "Discover Unbeatable Deal...",
    cta: "Learn More",
    platform: "meta",
    niche: "Digital Products",
    subNiche: "Online Courses",
    status: "inactive",
    saved: false,
  },
  {
    id: 5,
    brand: "BURLEBO",
    isNew: false,
    daysAgo: 1,
    previewType: "video",
    headline: "Matching made easy: BURLEBO Father & Son outfits—durable...",
    domain: "www.burlebo.com",
    productName: "BURLEBO Father & Son BURLEBO...",
    cta: "Shop Now",
    platform: "meta",
    niche: "Fashion & Apparel",
    subNiche: "Men's Clothing",
    status: "active",
    saved: true,
  },
  {
    id: 6,
    brand: "Body & Bra",
    isNew: true,
    daysAgo: null,
    previewType: "image",
    headline: "Struggling with larger cup sizes? Finally, a bra that gives real lift...",
    domain: "www.bodyandbra.com",
    productName: "Ultimate Support Bra",
    cta: "Shop Now",
    platform: "tiktok",
    niche: "Beauty & Personal Care",
    subNiche: "Women's Clothing",
    status: "active",
    saved: false,
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
  }, [ads, searchQuery, filters, sortBy, showSavedOnly, activeTab]);

  const toggleSaveAd = (adId: number) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, saved: !ad.saved } : ad))
    );
  };

  const clearFilters = () => {
    setFilters({
      format: "All",
      platform: "All",
      status: "All",
      niche: "All",
      subNiche: "All",
    });
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

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="relative flex-shrink-0 w-full lg:w-[200px]">
          <SearchNormal1 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-dark" />
          <input
            type="text"
            placeholder="Search brands, ads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-input-border rounded-xl pl-9 pr-3 py-2 text-sm text-purple-dark placeholder-gray-dark focus:outline-none focus:border-purple-normal"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1">
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
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm text-purple-normal hover:text-purple-dark font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 text-sm text-gray-dark hover:text-purple-dark"
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
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${
              showSavedOnly ? "text-purple-normal" : "text-gray-dark hover:text-purple-dark"
            }`}
          >
            <Heart size={16} variant={showSavedOnly ? "Bold" : "Linear"} />
            Saved ads
          </button>
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

function AdCard({ ad, onToggleSave }: { ad: Ad; onToggleSave: (id: number) => void }) {
  const [showInsights, setShowInsights] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  const handleClone = () => {
    setIsCloning(true);
    setTimeout(() => setIsCloning(false), 1500);
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1D0B30]/20"></div>
          {ad.previewType === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play size={20} className="text-purple-dark ml-1" variant="Bold" />
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ad.status === "active" ? "bg-[#EAF7EF] text-[#27AE60]" : "bg-[#FEF5EA] text-[#C67B22]"}`}>
              {ad.status === "active" ? "Active" : "Inactive"}
            </span>
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
              <div className="aspect-video bg-[#F3EFF6] rounded-xl flex items-center justify-center">
                {ad.previewType === "video" ? (
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play size={28} className="text-purple-dark ml-1" variant="Bold" />
                  </div>
                ) : (
                  <span className="text-gray-dark">Image Preview</span>
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
