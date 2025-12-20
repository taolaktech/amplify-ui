"use client";
import { useState, useEffect } from "react";
import { Image as ImageIcon, Video, Gift, Copy, Heart, Eye, ArrowLeft2, Magicpen, ArrowDown2, TickCircle, ArrowRight2, ArrowLeft, ArrowRight } from "iconsax-react";
import ConnectStore from "../modals/ConnectStore";

const formatOptions = ["All", "Image", "Video"];
const platformOptions = ["All", "Instagram", "Facebook"];
const modelOptions = [
  "All",
  "No Model (Product Only)",
  "Single Model",
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

type LibraryAd = {
  id: number;
  title: string;
  description: string;
  previewType: "video" | "image";
  previewUrl: string;
  category: string;
  style: string;
  saved: boolean;
};

const imageAds: LibraryAd[] = [
  {
    id: 1,
    title: "Glow Skin Model Shot",
    description: "Single model showcasing skincare product with dewy finish",
    previewType: "image",
    previewUrl: "/attached_assets/1b4739e4-836e-4d2c-ac1c-4ff3647179de_1766214497618.png",
    category: "Beauty",
    style: "Editorial",
    saved: false,
  },
  {
    id: 2,
    title: "Brand Campaign Grid",
    description: "Multi-shot grid layout with cohesive pink branding",
    previewType: "image",
    previewUrl: "/attached_assets/46785d59-5c10-456f-bf7a-c0e798345b40_1766214497621.png",
    category: "Beauty",
    style: "Campaign",
    saved: false,
  },
  {
    id: 3,
    title: "SPF Lifestyle",
    description: "Natural light lifestyle shots with product close-ups",
    previewType: "image",
    previewUrl: "/attached_assets/7732f5a9-e556-48ed-9637-faeb04d83e27_1766214497622.png",
    category: "Skincare",
    style: "Lifestyle",
    saved: false,
  },
  {
    id: 4,
    title: "UGC Hand Cream",
    description: "Authentic UGC-style product application shot",
    previewType: "image",
    previewUrl: "/attached_assets/48c5e4d2-fe9d-4eff-ba45-dfb03ace2ffc_1766214497622.png",
    category: "Skincare",
    style: "UGC",
    saved: false,
  },
];

const videoAds: LibraryAd[] = [
  {
    id: 101,
    title: "Unboxing Experience",
    description: "First impressions and product reveal",
    previewType: "video",
    previewUrl: "/attached_assets/a069269c-49e5-4068-a750-007e54a3d580_1766197795899.mp4",
    category: "E-commerce",
    style: "UGC",
    saved: false,
  },
  {
    id: 102,
    title: "How-To Tutorial",
    description: "Step-by-step product usage guide",
    previewType: "video",
    previewUrl: "/attached_assets/a5928bf1-8cca-4f11-80c1-d48602facf5a_1766197795899.mp4",
    category: "Educational",
    style: "Tutorial",
    saved: false,
  },
  {
    id: 103,
    title: "Quick Demo",
    description: "15-30 second product demonstration",
    previewType: "video",
    previewUrl: "/attached_assets/a7aa648c-6d7b-463a-8c47-998e25342aaa_1766197795900.mp4",
    category: "E-commerce",
    style: "Demo",
    saved: false,
  },
  {
    id: 104,
    title: "Customer Story",
    description: "Real customer sharing their experience",
    previewType: "video",
    previewUrl: "/attached_assets/b45b2243-c01d-4719-a6d7-4aec7dfac4e5_1766202310701.mp4",
    category: "Social Proof",
    style: "Testimonial",
    saved: false,
  },
  {
    id: 105,
    title: "Problem-Solution",
    description: "Show the problem, then your product as the solution",
    previewType: "video",
    previewUrl: "/attached_assets/c75be66a-b6a9-4cfb-add1-d2a98fa78080_1766197795900.mp4",
    category: "Marketing",
    style: "Storytelling",
    saved: false,
  },
  {
    id: 106,
    title: "Behind the Scenes",
    description: "Show how your product is made",
    previewType: "video",
    previewUrl: "/attached_assets/d3b6fcfd-4074-4e98-9fb9-8e81d0d78cbe_1766197795901.mp4",
    category: "Brand",
    style: "Authentic",
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
    saved: false,
  },
];

const aiModelAds: LibraryAd[] = [
  {
    id: 301,
    title: "Casual Chic Avatar",
    description: "Trendy streetwear look with glasses and cap",
    previewType: "image",
    previewUrl: "/attached_assets/1c98d4a1-2fa3-4344-b6ac-6c29f45693dd_1766215631255.png",
    category: "AI Avatar",
    style: "Casual",
    saved: false,
  },
  {
    id: 302,
    title: "Golden Hour Model",
    description: "Natural outdoor beauty with warm lighting",
    previewType: "image",
    previewUrl: "/attached_assets/3aa3afa0-2198-4edc-a9d9-cf50ab5deb35_1766215631261.png",
    category: "AI Avatar",
    style: "Natural",
    saved: false,
  },
  {
    id: 303,
    title: "Fresh Face Avatar",
    description: "Clean, natural skin for skincare campaigns",
    previewType: "image",
    previewUrl: "/attached_assets/a0a14069-a700-426b-8f5b-17ab40bf2e5c_1766215631261.png",
    category: "AI Avatar",
    style: "Skincare",
    saved: false,
  },
  {
    id: 304,
    title: "Glam Beauty Model",
    description: "Polished makeup look for beauty brands",
    previewType: "image",
    previewUrl: "/attached_assets/d1fe354f-56f5-4502-a098-c65cc6941e28_1766215631262.png",
    category: "AI Avatar",
    style: "Glam",
    saved: false,
  },
  {
    id: 305,
    title: "Curly Hair Avatar",
    description: "Natural curls for inclusive beauty campaigns",
    previewType: "image",
    previewUrl: "/attached_assets/c2805ff2-64b4-47e4-9eec-4a7d3e6d9690_1766215631262.png",
    category: "AI Avatar",
    style: "Natural",
    saved: false,
  },
  {
    id: 306,
    title: "Everyday Look Avatar",
    description: "Relatable, everyday aesthetic for lifestyle brands",
    previewType: "image",
    previewUrl: "/attached_assets/adf69caa-5bf3-4198-9e6b-7f5626a6f859_1766215631262.png",
    category: "AI Avatar",
    style: "Lifestyle",
    saved: false,
  },
  {
    id: 307,
    title: "Summer Glow Model",
    description: "Bright, sunny aesthetic for warm campaigns",
    previewType: "image",
    previewUrl: "/attached_assets/18ed7eab-3eab-4b61-8694-7c3bb097e4e8_1766215631263.png",
    category: "AI Avatar",
    style: "Summer",
    saved: false,
  },
  {
    id: 308,
    title: "Beach Vibes Avatar",
    description: "Tropical vacation look for resort brands",
    previewType: "image",
    previewUrl: "/attached_assets/fb887e86-d0b8-406d-8425-ef4c34549696_1766215631263.png",
    category: "AI Avatar",
    style: "Beach",
    saved: false,
  },
  {
    id: 309,
    title: "Male Model Avatar",
    description: "Casual masculine look for men's brands",
    previewType: "image",
    previewUrl: "/attached_assets/13262bac-4848-4432-ac4e-e9233f1c3adb_1766215631263.png",
    category: "AI Avatar",
    style: "Male",
    saved: false,
  },
];

type FilterState = {
  format: string;
  platform: string;
  niche: string;
  subNiche: string;
  model: string;
  ethnicity: string;
};

const ITEMS_PER_PAGE = 12;

export default function AdLibrary() {
  const [activeTab, setActiveTab] = useState<"image" | "video" | "seasonal" | "ai">("image");
  const [showConnectStoreModal, setShowConnectStoreModal] = useState(false);
  const [savedAds, setSavedAds] = useState<number[]>([]);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    format: "All",
    platform: "All",
    niche: "All",
    subNiche: "All",
    model: "All",
    ethnicity: "All",
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleCloneAd = () => {
    setShowConnectStoreModal(true);
  };

  const toggleSaveAd = (adId: number) => {
    setSavedAds((prev) =>
      prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
    );
  };

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOpenFilter(null);
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
    switch (activeTab) {
      case "image":
        return imageAds;
      case "video":
        return videoAds;
      case "seasonal":
        return seasonalAds;
      case "ai":
        return aiModelAds;
      default:
        return imageAds;
    }
  };

  const allAds = getAds();
  const totalPages = Math.ceil(allAds.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAds = allAds.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-[rgba(246,246,246,0.75)] rounded-3xl p-4 lg:p-6 min-h-[400px]">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <button className="text-purple-dark hover:text-purple-normal transition-colors">
            <ArrowLeft2 size={20} />
          </button>
          <h2 className="text-purple-dark font-semibold text-xl">Ad Library</h2>
        </div>
        <p className="text-gray-500 text-sm ml-7">Pick a template, add your product, and launch ads without guesswork.</p>
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
            <ImageIcon size={14} />
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
            onClick={() => setActiveTab("seasonal")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "seasonal"
                ? "text-purple-dark border-purple-normal"
                : "text-gray-dark border-transparent hover:text-purple-dark"
            }`}
          >
            <Gift size={14} />
            Seasonal
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
        <FilterDropdown
          label="Format"
          options={formatOptions}
          selected={filters.format}
          isOpen={openFilter === "format"}
          onToggle={() => toggleFilter("format")}
          onSelect={(value) => updateFilter("format", value)}
        />
        <FilterDropdown
          label="Platform"
          options={platformOptions}
          selected={filters.platform}
          isOpen={openFilter === "platform"}
          onToggle={() => toggleFilter("platform")}
          onSelect={(value) => updateFilter("platform", value)}
        />
        <NicheDropdown
          selectedNiche={filters.niche}
          selectedSubNiche={filters.subNiche}
          isOpen={openFilter === "niche"}
          onToggle={() => toggleFilter("niche")}
          onSelect={updateNicheFilter}
        />
        <FilterDropdown
          label="Model"
          options={modelOptions}
          selected={filters.model}
          isOpen={openFilter === "model"}
          onToggle={() => toggleFilter("model")}
          onSelect={(value) => updateFilter("model", value)}
        />
        <FilterDropdown
          label="Model Ethnicity"
          options={ethnicityOptions}
          selected={filters.ethnicity}
          isOpen={openFilter === "ethnicity"}
          onToggle={() => toggleFilter("ethnicity")}
          onSelect={(value) => updateFilter("ethnicity", value)}
        />
      </div>

      {activeTab === "seasonal" && (
        <div className="bg-gradient-to-r from-red-500 to-green-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Gift size={28} />
            <div>
              <h3 className="text-xl font-bold">Christmas Campaign Ideas</h3>
              <p className="text-white/80 text-sm">Trending templates for the holiday season</p>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            These campaign templates are optimized for the current season. Use them as inspiration to create timely, relevant ads that resonate with your audience.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentAds.map((ad) => (
          <div
            key={ad.id}
            className="bg-white border border-[#F3EFF6] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
          >
            <div className="relative h-[250px]">
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
                    <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl border-2 border-white">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-purple-dark ml-1"></div>
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
              <div className="absolute top-2 left-2 flex items-center gap-2">
                <span
                  className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                    ad.previewType === "video"
                      ? "bg-purple-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {ad.previewType === "video" ? (
                    <Video size={10} className="inline mr-1" />
                  ) : (
                    <ImageIcon size={10} className="inline mr-1" />
                  )}
                  {ad.previewType}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-green-500 text-white">
                  {ad.category}
                </span>
              </div>
              <button
                onClick={() => toggleSaveAd(ad.id)}
                className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <Heart
                  size={16}
                  variant={savedAds.includes(ad.id) ? "Bold" : "Linear"}
                  className={savedAds.includes(ad.id) ? "text-red-500" : "text-gray-600"}
                />
              </button>
            </div>
            <div className="p-4">
              <h4 className="text-purple-dark font-semibold mb-1">{ad.title}</h4>
              <p className="text-gray-dark text-xs mb-3 line-clamp-2">
                {ad.description}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] px-2 py-1 bg-[#F3EFF6] text-gray-600 rounded-full">
                  {ad.style}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex-1 py-2 bg-[#F3EFF6] text-purple-dark text-xs rounded-lg hover:bg-[#E6DCF0] transition-colors flex items-center justify-center gap-1.5 font-medium">
                  <Eye size={14} />
                  Preview
                </button>
                <button
                  onClick={handleCloneAd}
                  className="flex-1 py-2 gradient text-white text-xs rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5 font-medium"
                >
                  <Copy size={14} />
                  {activeTab === "ai" ? "Use this Model" : "Use Template"}
                </button>
              </div>
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
            <ArrowLeft size={18} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
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
            <ArrowRight size={18} />
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
}: {
  label: string;
  options: string[];
  selected: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  const isActive = selected !== "All";
  const displayValue = selected === "All" ? null : selected;

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
        {displayValue && <span className="font-medium">: {displayValue}</span>}
        <ArrowDown2 size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#E6DCF0] rounded-xl shadow-lg z-20 min-w-[180px] max-h-[280px] overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`w-full text-left px-4 py-2 text-xs hover:bg-[#F3EFF6] transition-colors flex items-center justify-between first:rounded-t-xl last:rounded-b-xl ${
                selected === option ? "text-purple-normal font-medium" : "text-gray-dark"
              }`}
            >
              {option}
              {selected === option && <TickCircle size={14} variant="Bold" />}
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
