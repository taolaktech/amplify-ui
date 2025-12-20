"use client";
import { useState } from "react";
import { Image as ImageIcon, Video, Gift, Copy, Heart, Eye, ArrowLeft2, Magicpen, ArrowDown2, TickCircle, ArrowRight2 } from "iconsax-react";
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
    title: "Product Showcase",
    description: "Clean product photography with minimal background",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "E-commerce",
    style: "Minimal",
    saved: false,
  },
  {
    id: 2,
    title: "Lifestyle Shot",
    description: "Product in real-life context with models",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fashion",
    style: "Lifestyle",
    saved: false,
  },
  {
    id: 3,
    title: "Before & After",
    description: "Side-by-side comparison showing transformation",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Beauty",
    style: "Comparison",
    saved: false,
  },
  {
    id: 4,
    title: "User Testimonial",
    description: "Customer quote with product image",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/5632386/pexels-photo-5632386.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Social Proof",
    style: "Testimonial",
    saved: false,
  },
  {
    id: 5,
    title: "Sale Banner",
    description: "Eye-catching promotional graphics",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/5632376/pexels-photo-5632376.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Promotion",
    style: "Bold",
    saved: false,
  },
  {
    id: 6,
    title: "Infographic Style",
    description: "Product features highlighted with icons",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Educational",
    style: "Informative",
    saved: false,
  },
];

const videoAds: LibraryAd[] = [
  {
    id: 101,
    title: "Unboxing Experience",
    description: "First impressions and product reveal",
    previewType: "video",
    previewUrl: "https://videos.pexels.com/video-files/5585798/5585798-uhd_2160_3840_25fps.mp4",
    category: "E-commerce",
    style: "UGC",
    saved: false,
  },
  {
    id: 102,
    title: "How-To Tutorial",
    description: "Step-by-step product usage guide",
    previewType: "video",
    previewUrl: "https://videos.pexels.com/video-files/6774125/6774125-uhd_2732_1440_25fps.mp4",
    category: "Educational",
    style: "Tutorial",
    saved: false,
  },
  {
    id: 103,
    title: "Quick Demo",
    description: "15-30 second product demonstration",
    previewType: "video",
    previewUrl: "https://videos.pexels.com/video-files/5585796/5585796-uhd_2160_3840_25fps.mp4",
    category: "E-commerce",
    style: "Demo",
    saved: false,
  },
  {
    id: 104,
    title: "Customer Story",
    description: "Real customer sharing their experience",
    previewType: "video",
    previewUrl: "https://videos.pexels.com/video-files/5585790/5585790-uhd_2160_3840_25fps.mp4",
    category: "Social Proof",
    style: "Testimonial",
    saved: false,
  },
  {
    id: 105,
    title: "Problem-Solution",
    description: "Show the problem, then your product as the solution",
    previewType: "video",
    previewUrl: "https://videos.pexels.com/video-files/4625518/4625518-uhd_2160_3840_25fps.mp4",
    category: "Marketing",
    style: "Storytelling",
    saved: false,
  },
  {
    id: 106,
    title: "Behind the Scenes",
    description: "Show how your product is made",
    previewType: "video",
    previewUrl: "https://videos.pexels.com/video-files/3252128/3252128-uhd_2560_1440_25fps.mp4",
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
    previewUrl: "https://videos.pexels.com/video-files/5765191/5765191-uhd_2160_3840_25fps.mp4",
    category: "Christmas",
    style: "Festive",
    saved: false,
  },
  {
    id: 202,
    title: "Christmas Sale",
    description: "Limited-time holiday discount promotion",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/3303614/pexels-photo-3303614.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Christmas",
    style: "Promotional",
    saved: false,
  },
  {
    id: 203,
    title: "Cozy Winter Vibes",
    description: "Warm, cozy winter aesthetics",
    previewType: "video",
    previewUrl: "https://videos.pexels.com/video-files/5765146/5765146-uhd_2160_3840_25fps.mp4",
    category: "Winter",
    style: "Lifestyle",
    saved: false,
  },
  {
    id: 204,
    title: "New Year Goals",
    description: "Products for New Year resolutions",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/6479601/pexels-photo-6479601.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "New Year",
    style: "Motivational",
    saved: false,
  },
  {
    id: 205,
    title: "Family Moments",
    description: "Family gatherings and togetherness",
    previewType: "video",
    previewUrl: "https://videos.pexels.com/video-files/5737549/5737549-uhd_2160_3840_25fps.mp4",
    category: "Christmas",
    style: "Emotional",
    saved: false,
  },
  {
    id: 206,
    title: "Stocking Stuffers",
    description: "Affordable gift ideas under $25",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/5765147/pexels-photo-5765147.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Christmas",
    style: "Budget",
    saved: false,
  },
];

const aiModelAds: LibraryAd[] = [
  {
    id: 301,
    title: "AI Product Photoshoot",
    description: "Generate studio-quality product images with AI",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "AI Generated",
    style: "Studio",
    saved: false,
  },
  {
    id: 302,
    title: "AI Lifestyle Scene",
    description: "Place your product in any AI-generated environment",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "AI Generated",
    style: "Lifestyle",
    saved: false,
  },
  {
    id: 303,
    title: "AI Model Integration",
    description: "Add AI-generated models showcasing your product",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/8386365/pexels-photo-8386365.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "AI Generated",
    style: "Fashion",
    saved: false,
  },
  {
    id: 304,
    title: "AI Background Swap",
    description: "Replace backgrounds with AI-generated scenes",
    previewType: "image",
    previewUrl: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "AI Generated",
    style: "Dynamic",
    saved: false,
  },
  {
    id: 305,
    title: "AI Video Avatar",
    description: "Create spokesperson videos with AI avatars",
    previewType: "video",
    previewUrl: "https://videos.pexels.com/video-files/6774125/6774125-uhd_2732_1440_25fps.mp4",
    category: "AI Generated",
    style: "Spokesperson",
    saved: false,
  },
  {
    id: 306,
    title: "AI Product Animation",
    description: "Animate static products with AI motion",
    previewType: "video",
    previewUrl: "https://videos.pexels.com/video-files/5585798/5585798-uhd_2160_3840_25fps.mp4",
    category: "AI Generated",
    style: "Animation",
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

export default function AdLibrary() {
  const [activeTab, setActiveTab] = useState<"image" | "video" | "seasonal" | "ai">("image");
  const [showConnectStoreModal, setShowConnectStoreModal] = useState(false);
  const [savedAds, setSavedAds] = useState<number[]>([]);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    format: "All",
    platform: "All",
    niche: "All",
    subNiche: "All",
    model: "All",
    ethnicity: "All",
  });

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

  const currentAds = getAds();

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
          {currentAds.length} templates available
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
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
