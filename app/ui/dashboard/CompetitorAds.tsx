"use client";
import { useState } from "react";
import { SearchNormal1, ArrowDown2, Play, Eye, Copy } from "iconsax-react";

const mockAds = [
  {
    id: 1,
    brand: "BURLEBO",
    isNew: true,
    daysAgo: null,
    preview: "/api/placeholder/300/400",
    previewType: "video",
    headline: "Taking after Dad already! Check out all the latest BURLEY-baby...",
    domain: "www.burlebo.com",
    productName: "BURLEBO Baby Zip Ups",
    cta: "Shop Now",
  },
  {
    id: 2,
    brand: "Zeely Mark...",
    isNew: true,
    daysAgo: null,
    preview: "/api/placeholder/300/400",
    previewType: "video",
    headline: "Add comfort & style to your space with Nu Jants! Our quality throw...",
    domain: "zee.store",
    productName: "Could your living room or wardrob...",
    cta: "Learn More",
  },
  {
    id: 3,
    brand: "Zeely Mark...",
    isNew: true,
    daysAgo: null,
    preview: "/api/placeholder/300/400",
    previewType: "video",
    headline: "Tired of dull outfits? Transform your style with Luo's Shop's...",
    domain: "zeely-...",
    productName: "Discover Exclusive Deals at Luo's...",
    cta: "Learn More",
  },
  {
    id: 4,
    brand: "Zeely Mark...",
    isNew: true,
    daysAgo: null,
    preview: "/api/placeholder/300/400",
    previewType: "video",
    headline: "Tired of endless mall trips? Shop smart with Luo's Shop—your on...",
    domain: "zeely-...",
    productName: "Discover Unbeatable Deal...",
    cta: "Learn More",
  },
  {
    id: 5,
    brand: "BURLEBO",
    isNew: false,
    daysAgo: 1,
    preview: "/api/placeholder/300/400",
    previewType: "video",
    headline: "Matching made easy: BURLEBO Father & Son outfits—durable...",
    domain: "www.burlebo.com",
    productName: "BURLEBO Father & Son BURLEBO...",
    cta: "Shop Now",
  },
  {
    id: 6,
    brand: "Body & Bra",
    isNew: true,
    daysAgo: null,
    preview: "/api/placeholder/300/400",
    previewType: "image",
    headline: "Struggling with larger cup sizes? Finally, a bra that gives real lift...",
    domain: "www.bodyandbra.com",
    productName: "Ultimate Support Bra",
    cta: "Shop Now",
  },
];

const filterOptions = [
  { label: "Format", count: 1 },
  { label: "Platform", count: null },
  { label: "Status", count: null },
  { label: "Industry", count: 11 },
];

export default function CompetitorAds() {
  const [activeTab, setActiveTab] = useState<"explore" | "foryou">("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 lg:p-6 min-h-[600px]">
      <div className="flex items-center gap-2 mb-4">
        <button className="text-white hover:text-gray-300">
          <ArrowDown2 size={20} className="rotate-90" />
        </button>
        <h2 className="text-white font-semibold text-lg">Meta Top Ads</h2>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("explore")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              activeTab === "explore"
                ? "text-white border-white"
                : "text-gray-400 border-transparent hover:text-gray-300"
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab("foryou")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              activeTab === "foryou"
                ? "text-white border-white"
                : "text-gray-400 border-transparent hover:text-gray-300"
            }`}
          >
            For You
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>For inspiration only: These ads come from official Meta/TikTok ad libraries</span>
          <button className="text-gray-400 hover:text-white">×</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="relative flex-shrink-0 w-full lg:w-[200px]">
          <SearchNormal1 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1">
          {filterOptions.map((filter) => (
            <button
              key={filter.label}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-sm text-gray-300 hover:border-gray-500 transition-colors"
            >
              {filter.label}
              {filter.count && <span className="text-gray-500">({filter.count})</span>}
              <ArrowDown2 size={12} className="text-gray-500" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
            <span>Sort: {sortBy}</span>
            <ArrowDown2 size={12} />
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
            Saved ads
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}

function AdCard({ ad }: { ad: typeof mockAds[0] }) {
  return (
    <div className="bg-[#2a2a2a] rounded-xl overflow-hidden flex flex-col">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-xs text-white font-medium">{ad.brand.charAt(0)}</span>
          </div>
          <span className="text-white text-sm font-medium truncate max-w-[100px]">{ad.brand}</span>
          <span className="text-gray-500 text-xs">ID</span>
          <div className="w-4 h-4 rounded bg-gray-600"></div>
        </div>
        <div className="flex items-center gap-1">
          {ad.isNew ? (
            <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">NEW</span>
          ) : ad.daysAgo ? (
            <span className="text-gray-400 text-xs">{ad.daysAgo}D</span>
          ) : null}
        </div>
      </div>

      <p className="px-3 text-gray-300 text-xs line-clamp-2 mb-2">{ad.headline}</p>

      <div className="relative flex-1 min-h-[200px] bg-gray-700 mx-3 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        {ad.previewType === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <Play size={20} className="text-white ml-1" variant="Bold" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 flex items-center justify-between border-t border-[#3a3a3a] mt-3">
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-xs truncate">{ad.domain}</p>
          <p className="text-white text-sm truncate">{ad.productName}</p>
        </div>
        <button className="px-3 py-1.5 bg-[#3a3a3a] text-white text-xs rounded-lg hover:bg-[#4a4a4a] transition-colors flex-shrink-0">
          {ad.cta}
        </button>
      </div>

      <div className="p-3 pt-0 flex flex-col gap-2">
        <button className="w-full py-2 bg-[#3a3a3a] text-gray-300 text-sm rounded-lg hover:bg-[#4a4a4a] transition-colors flex items-center justify-center gap-2">
          <Eye size={16} />
          View insights
        </button>
        <button className="w-full py-2 bg-[#10B981] text-white text-sm rounded-lg hover:bg-[#059669] transition-colors flex items-center justify-center gap-2">
          <Copy size={16} />
          Clone this {ad.previewType} ad
        </button>
      </div>
    </div>
  );
}
