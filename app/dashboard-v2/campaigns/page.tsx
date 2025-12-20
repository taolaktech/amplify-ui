"use client";
import { useState, useEffect } from "react";
import {
  Heart,
  Video,
  Image as ImageIcon,
  Bag,
  Trash,
  Edit2,
  Add,
  Calendar,
  Clock,
  ArrowLeft2,
  ArrowRight2,
  Copy,
  DocumentDownload,
  Refresh2,
} from "iconsax-react";
import { useRouter } from "next/navigation";
import ConnectStore from "@/app/ui/modals/ConnectStore";
import FBIcon from "@/public/facebook-sm.svg";
import IGIcon from "@/public/ig-small.svg";

type SavedAd = {
  id: string;
  brand: string;
  productName: string;
  headline: string;
  previewType: "video" | "image";
  previewUrl: string;
  platform: "meta" | "tiktok";
  status: "active" | "inactive";
  niche: string;
  subNiche: string;
  domain: string;
  cta: string;
  savedAt: string;
};

type Campaign = {
  id: number;
  name: string;
  type: string;
  status: string;
  source_ad_id: string | null;
  source_brand: string | null;
  product_name: string | null;
  headline: string | null;
  preview_type: string | null;
  preview_url: string | null;
  platform: string | null;
  niche: string | null;
  created_at: string;
  product_count?: number;
};

function TikTokIcon({ width = 16, height = 16 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33.2 6c.9 7.3 5.1 11.7 12.8 12.2v7.1c-4.5.2-8.4-1.3-12.6-4v12.7c0 16.1-17.7 21.2-26.6 9.7C1.2 36.2 3.7 21.4 19 19.6v7.5c-1.1.2-2.2.5-3.2 1-3 1.3-4.7 4.2-4.2 7.5.9 5.5 7.6 6.9 10.8 3.1 1.8-2.1 1.6-4.6 1.6-7.1V6h9.2Z"
        fill="#000"
      />
      <path
        d="M33.2 6c.9 7.3 5.1 11.7 12.8 12.2v7.1c-4.5.2-8.4-1.3-12.6-4v12.7c0 16.1-17.7 21.2-26.6 9.7C1.2 36.2 3.7 21.4 19 19.6v7.5c-1.1.2-2.2.5-3.2 1-3 1.3-4.7 4.2-4.2 7.5.9 5.5 7.6 6.9 10.8 3.1 1.8-2.1 1.6-4.6 1.6-7.1V6h9.2Z"
        fill="#EE1D52"
        fillOpacity="0.35"
      />
      <path
        d="M33.2 6c.9 7.3 5.1 11.7 12.8 12.2v2.9c-4.5.2-8.4-1.3-12.6-4v12.7c0 16.1-17.7 21.2-26.6 9.7A12.3 12.3 0 0 1 4 33.4c.4 4.6 3 7.6 6.5 9.4 8.9 4.6 19.6-1.1 19.6-10.7V19.4c4.2 2.7 8.1 4.2 12.6 4v-2.9C38.3 20.1 34 15.6 33.2 8.4V6Z"
        fill="#69C9D0"
        fillOpacity="0.35"
      />
    </svg>
  );
}

function PlatformIcons({ platform }: { platform: string | null }) {
  const value = (platform || "").toLowerCase();
  if (value === "meta") {
    return (
      <span className="flex items-center gap-1">
        <FBIcon width={15} height={18} />
        <IGIcon />
      </span>
    );
  }
  if (value === "tiktok") {
    return <TikTokIcon width={16} height={16} />;
  }
  return null;
}

const demoCampaigns: Campaign[] = [
  {
    id: 1001,
    name: "Summer Skincare Launch",
    type: "generated",
    status: "active",
    source_ad_id: null,
    source_brand: "MUSE Skin",
    product_name: "Glow Serum",
    headline: "Achieve radiant summer skin with our bestselling serum",
    preview_type: "image",
    preview_url: "/image-ads/muse-skin.png",
    platform: "meta",
    niche: "Beauty",
    created_at: "2024-12-18T10:30:00Z",
  },
  {
    id: 1002,
    name: "SPF Awareness Campaign",
    type: "generated",
    status: "draft",
    source_ad_id: null,
    source_brand: "Naked Sundays",
    product_name: "Collagen Glow SPF50+",
    headline: "Protect your skin while getting that perfect glow",
    preview_type: "image",
    preview_url: "/image-ads/naked-sundays.png",
    platform: "tiktok",
    niche: "Skincare",
    created_at: "2024-12-17T14:20:00Z",
  },
  {
    id: 1003,
    name: "Holiday Hand Care",
    type: "generated",
    status: "active",
    source_ad_id: null,
    source_brand: "Mary Kay",
    product_name: "Satin Hands",
    headline: "Give the gift of soft, silky hands this holiday season",
    preview_type: "image",
    preview_url: "/image-ads/satin-hands.png",
    platform: "meta",
    niche: "Skincare",
    created_at: "2024-12-16T09:15:00Z",
  },
  {
    id: 1004,
    name: "Clean Beauty Launch",
    type: "cloned",
    status: "paused",
    source_ad_id: "hersteller-001",
    source_brand: "Hersteller",
    product_name: "Veggie Cleanser",
    headline: "Clean beauty that actually works for sensitive skin",
    preview_type: "image",
    preview_url: "/image-ads/hersteller.png",
    platform: "meta",
    niche: "Skincare",
    created_at: "2024-12-15T16:45:00Z",
  },
];

export default function CampaignsV2Page() {
  const router = useRouter();
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>(demoCampaigns);
  const [loading, setLoading] = useState(true);
  const [showConnectStoreModal, setShowConnectStoreModal] = useState(false);

  const [recentCampaignsPage, setRecentCampaignsPage] = useState(1);
  const [savedAdsPage, setSavedAdsPage] = useState(1);

  const CAMPAIGNS_PER_PAGE = 6;
  const SAVED_ADS_PER_PAGE = 8;

  const handleCreateCampaign = () => {
    router.push("/dashboard-v2/create-campaign/product-selection");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [savedRes, campaignsRes] = await Promise.all([
        fetch("/api/saved-ads/full"),
        fetch("/api/campaigns"),
      ]);
      
      const savedData = await savedRes.json();
      const campaignsData = await campaignsRes.json();
      
      setSavedAds(savedData.savedAds || []);
      const apiCampaigns = campaignsData.campaigns || [];
      setCampaigns([...demoCampaigns, ...apiCampaigns]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setCampaigns(demoCampaigns);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedAd = async (adId: string) => {
    try {
      await fetch("/api/saved-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad: { id: adId } }),
      });
      setSavedAds(savedAds.filter((ad) => ad.id !== adId));
    } catch (error) {
      console.error("Error removing saved ad:", error);
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    const confirmed = window.confirm("Delete this campaign? This can’t be undone.");
    if (!confirmed) return;
    if (id >= 1001 && id <= 1004) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
      return;
    }
    try {
      await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
      setCampaigns(campaigns.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const handleRegenerateCampaign = (campaign: Campaign) => {
    const productCount = campaign.product_count ?? (campaign.product_name ? 1 : 0);
    const selectedProducts = Array.from({ length: Math.max(1, productCount) }).map((_, idx) => ({
      id: `${campaign.id}-${idx + 1}`,
      title: campaign.product_name ? `${campaign.product_name}${productCount > 1 ? ` ${idx + 1}` : ""}` : `Product ${idx + 1}`,
      price: "$0.00",
      imageUrl: campaign.preview_url || "/ad-assets/6da1073c-b66a-4448-9269-80afa64e9ac9_1766197795895.png",
    }));

    try {
      sessionStorage.setItem(
        "v2_create_campaign",
        JSON.stringify({
          selectedProducts,
          source: "campaign",
          campaignId: campaign.id,
        })
      );
    } catch {
      // ignore
    }

    router.push(`/dashboard-v2/create-campaign/preview?campaignId=${campaign.id}&regenerate=true`);
  };

  const handleDownloadAssets = async (campaign: Campaign) => {
    if (campaign.preview_url) {
      const link = document.createElement("a");
      link.href = campaign.preview_url;
      link.download = `${campaign.name.replace(/\s+/g, "-").toLowerCase()}-asset`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const recentCampaigns = [...campaigns].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const recentCampaignsTotalPages = Math.max(
    1,
    Math.ceil(recentCampaigns.length / CAMPAIGNS_PER_PAGE)
  );
  const savedAdsTotalPages = Math.max(1, Math.ceil(savedAds.length / SAVED_ADS_PER_PAGE));

  useEffect(() => {
    setRecentCampaignsPage(1);
  }, [campaigns.length]);

  useEffect(() => {
    setSavedAdsPage(1);
  }, [savedAds.length]);

  useEffect(() => {
    setRecentCampaignsPage((prev) => Math.min(prev, recentCampaignsTotalPages));
  }, [recentCampaignsTotalPages]);

  useEffect(() => {
    setSavedAdsPage((prev) => Math.min(prev, savedAdsTotalPages));
  }, [savedAdsTotalPages]);

  const pagedRecentCampaigns = recentCampaigns.slice(
    (recentCampaignsPage - 1) * CAMPAIGNS_PER_PAGE,
    recentCampaignsPage * CAMPAIGNS_PER_PAGE
  );
  const pagedSavedAds = savedAds.slice(
    (savedAdsPage - 1) * SAVED_ADS_PER_PAGE,
    savedAdsPage * SAVED_ADS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] relative flex flex-col flex-shrink-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          {/* <h1 className="text-2xl font-semibold text-gray-800 mb-1">Your Campaigns</h1>
          <p className="text-gray-500 text-sm">Manage your saved ads and marketing campaigns</p> */}
        </div>
        <button
          onClick={handleCreateCampaign}
          className="flex items-center justify-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white text-sm rounded-xl hover:opacity-90 transition-opacity font-medium leading-tight whitespace-nowrap"
        >
          <Add size={18} color="#FFFFFF" className="flex-shrink-0" />
          Create Campaign
        </button>
      </div>

      <div className="space-y-10">
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Recent Campaigns</h2>
          </div>
          
          {recentCampaigns.length === 0 ? (
            <div className="bg-[#F8F7FA] border border-[#E8E5EC] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px]">
              <Calendar size={40} className="text-purple-500 mb-3" />
              <p className="text-gray-800 text-lg font-medium mb-1">No campaigns yet</p>
              <p className="text-gray-500 text-sm mb-4 text-center">Create your first marketing campaign</p>
              <button
                onClick={handleCreateCampaign}
                className="px-4 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 leading-tight whitespace-nowrap"
              >
                <Add size={16} color="#FFFFFF" className="flex-shrink-0" />
                Create Campaign
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pagedRecentCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onDelete={handleDeleteCampaign}
                    onRegenerate={handleRegenerateCampaign}
                    onDownload={handleDownloadAssets}
                  />
                ))}
              </div>

              {recentCampaignsTotalPages > 1 ? (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRecentCampaignsPage((p) => Math.max(1, p - 1))}
                    disabled={recentCampaignsPage === 1}
                    className={`h-[36px] px-3 rounded-xl border flex items-center gap-2 text-sm font-medium transition-colors ${
                      recentCampaignsPage === 1
                        ? "bg-gray-100 border-[#E8E5EC] text-gray-400 cursor-not-allowed"
                        : "bg-white border-[#E8E5EC] text-gray-700 hover:bg-[#F8F7FA]"
                    }`}
                  >
                    <ArrowLeft2 size={16} color={recentCampaignsPage === 1 ? "#9CA3AF" : "#333"} />
                    Prev
                  </button>

                  <div className="text-sm text-gray-600 px-3">
                    Page <span className="font-medium text-gray-800">{recentCampaignsPage}</span> of{" "}
                    <span className="font-medium text-gray-800">{recentCampaignsTotalPages}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setRecentCampaignsPage((p) => Math.min(recentCampaignsTotalPages, p + 1))
                    }
                    disabled={recentCampaignsPage === recentCampaignsTotalPages}
                    className={`h-[36px] px-3 rounded-xl border flex items-center gap-2 text-sm font-medium transition-colors ${
                      recentCampaignsPage === recentCampaignsTotalPages
                        ? "bg-gray-100 border-[#E8E5EC] text-gray-400 cursor-not-allowed"
                        : "bg-white border-[#E8E5EC] text-gray-700 hover:bg-[#F8F7FA]"
                    }`}
                  >
                    Next
                    <ArrowRight2
                      size={16}
                      color={recentCampaignsPage === recentCampaignsTotalPages ? "#9CA3AF" : "#333"}
                    />
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Saved Ads</h2>
            {savedAds.length > 0 && (
              <a
                href="/dashboard-v2/inspirations"
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                Browse more <ArrowRight2 size={14} />
              </a>
            )}
          </div>
          
          {savedAds.length === 0 ? (
            <div className="bg-[#F8F7FA] border border-[#E8E5EC] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px]">
              <Heart size={40} className="text-purple-500 mb-3" />
              <p className="text-gray-800 text-lg font-medium mb-1">No saved ads yet</p>
              <p className="text-gray-500 text-sm mb-4 text-center">Save competitor ads to use as inspiration for your campaigns</p>
              <a
                href="/dashboard-v2/inspirations"
                className="px-4 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Browse Competitor Ads
                <ArrowRight2 size={16} />
              </a>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {pagedSavedAds.map((ad) => (
                  <div key={ad.id} className="bg-white border border-[#E8E5EC] rounded-2xl p-4 hover:shadow-lg transition-all group">
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-4 bg-[#F3EFF6]">
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
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-white ml-1"></div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <img
                          src={ad.previewUrl}
                          alt={ad.productName}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className={`text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm ${
                          ad.previewType === "video" 
                            ? "bg-purple-500 text-white" 
                            : "bg-blue-500 text-white"
                        }`}>
                          {ad.previewType === "video" ? <Video size={10} className="inline mr-1" /> : <ImageIcon size={10} className="inline mr-1" />}
                          {ad.previewType}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveSavedAd(ad.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors shadow-sm"
                      >
                        <Heart size={14} variant="Bold" className="text-red-500" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A755FF] to-[#6800D7] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {ad.brand.charAt(0)}
                        </div>
                        <span className="text-gray-800 font-medium text-sm truncate">{ad.brand}</span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          {ad.platform === "meta" ? (
                            <>
                              <FBIcon width={15} height={18} />
                              <IGIcon />
                            </>
                          ) : (
                            <TikTokIcon width={16} height={16} />
                          )}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2">{ad.headline}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={handleCreateCampaign}
                          className="flex-1 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white text-xs rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1 font-medium"
                        >
                          <Copy size={12} />
                          Create Campaign
                        </button>
                        <button className="py-2 px-3 bg-[#F3EFF6] text-purple-600 text-xs rounded-lg hover:bg-[#E6DCF0] transition-colors">
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {savedAdsTotalPages > 1 ? (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSavedAdsPage((p) => Math.max(1, p - 1))}
                    disabled={savedAdsPage === 1}
                    className={`h-[36px] px-3 rounded-xl border flex items-center gap-2 text-sm font-medium transition-colors ${
                      savedAdsPage === 1
                        ? "bg-gray-100 border-[#E8E5EC] text-gray-400 cursor-not-allowed"
                        : "bg-white border-[#E8E5EC] text-gray-700 hover:bg-[#F8F7FA]"
                    }`}
                  >
                    <ArrowLeft2 size={16} color={savedAdsPage === 1 ? "#9CA3AF" : "#333"} />
                    Prev
                  </button>

                  <div className="text-sm text-gray-600 px-3">
                    Page <span className="font-medium text-gray-800">{savedAdsPage}</span> of{" "}
                    <span className="font-medium text-gray-800">{savedAdsTotalPages}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSavedAdsPage((p) => Math.min(savedAdsTotalPages, p + 1))}
                    disabled={savedAdsPage === savedAdsTotalPages}
                    className={`h-[36px] px-3 rounded-xl border flex items-center gap-2 text-sm font-medium transition-colors ${
                      savedAdsPage === savedAdsTotalPages
                        ? "bg-gray-100 border-[#E8E5EC] text-gray-400 cursor-not-allowed"
                        : "bg-white border-[#E8E5EC] text-gray-700 hover:bg-[#F8F7FA]"
                    }`}
                  >
                    Next
                    <ArrowRight2
                      size={16}
                      color={savedAdsPage === savedAdsTotalPages ? "#9CA3AF" : "#333"}
                    />
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </section>
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

function CampaignCard({ campaign, onDelete, onRegenerate, onDownload }: { 
  campaign: Campaign; 
  onDelete: (id: number) => void;
  onRegenerate: (campaign: Campaign) => void;
  onDownload: (campaign: Campaign) => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const productCount = campaign.product_count ?? (campaign.product_name ? 1 : 0);

  return (
    <div className="bg-white border border-[#E8E5EC] rounded-2xl p-4 hover:shadow-lg transition-all group">
      <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-4 bg-[#F3EFF6]">
        {campaign.preview_url ? (
          campaign.preview_type === "video" ? (
            <video src={campaign.preview_url} className="w-full h-full object-cover" muted />
          ) : (
            <img src={campaign.preview_url} alt={campaign.name} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50">
            <Calendar size={40} className="text-purple-400" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-gray-800 font-medium truncate">{campaign.name}</h3>
        {campaign.headline && (
          <p className="text-gray-500 text-xs line-clamp-2">{campaign.headline}</p>
        )}
        {campaign.source_brand && (
          <p className="text-purple-600 text-[10px]">Inspired by: {campaign.source_brand}</p>
        )}
        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {formatDate(campaign.created_at)}
          </span>
          <span className="flex items-center gap-2">
            {productCount > 0 ? <span className="text-gray-500">{productCount} products</span> : null}
            <PlatformIcons platform={campaign.platform} />
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onRegenerate(campaign)}
            className="flex-1 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white text-xs rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1 font-medium"
          >
            <Refresh2 size={12} />
            Regenerate
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDownload(campaign)}
            className="flex-1 py-2 bg-[#F3EFF6] text-purple-600 text-xs rounded-lg hover:bg-[#E6DCF0] transition-colors flex items-center justify-center gap-1 font-medium"
          >
            <DocumentDownload size={12} />
            Download
          </button>
          <button
            onClick={() => onDelete(campaign.id)}
            className="py-2 px-3 bg-red-50 text-red-500 text-xs rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
          >
            <Trash size={16} variant="Bold" color="#EF4444" />
          </button>
        </div>
      </div>
    </div>
  );
}
