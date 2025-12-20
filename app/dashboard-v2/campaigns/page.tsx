"use client";
import { useState, useEffect } from "react";
import { Heart, Video, Image as ImageIcon, Trash, Edit2, Add, Calendar, Clock, ArrowRight2, Copy, TrendUp, Flash } from "iconsax-react";
import { getTrendingAds, TrendingAd } from "@/app/lib/trendingAds";
import ConnectStore from "@/app/ui/modals/ConnectStore";

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
};

export default function CampaignsV2Page() {
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnectStoreModal, setShowConnectStoreModal] = useState(false);

  const handleCloneAd = () => {
    setShowConnectStoreModal(true);
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
      setCampaigns(campaignsData.campaigns || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    try {
      await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
      setCampaigns(campaigns.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const clonedCampaigns = campaigns.filter((c) => c.type === "cloned");
  const generatedCampaigns = campaigns.filter((c) => c.type === "generated");

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
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Your Campaigns</h1>
          <p className="text-gray-500 text-sm">Manage your saved ads and marketing campaigns</p>
        </div>
        <button
          onClick={handleCloneAd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white text-sm rounded-xl hover:opacity-90 transition-opacity font-medium"
        >
          <Add size={18} />
          Create Campaign
        </button>
      </div>

      <div className="space-y-10">
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Saved Ads</h2>
            {savedAds.length > 0 && (
              <a href="/dashboard-v2/inspirations" className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {savedAds.map((ad) => (
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
                      <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize flex-shrink-0 ${
                        ad.platform === "meta" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
                      }`}>
                        {ad.platform}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-2">{ad.headline}</p>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleCloneAd}
                        className="flex-1 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white text-xs rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1 font-medium"
                      >
                        <Copy size={12} />
                        Clone Ad
                      </button>
                      <button className="py-2 px-3 bg-[#F3EFF6] text-purple-600 text-xs rounded-lg hover:bg-[#E6DCF0] transition-colors">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Recent Campaigns</h2>
          </div>
          
          {generatedCampaigns.length === 0 ? (
            <div className="bg-[#F8F7FA] border border-[#E8E5EC] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px]">
              <Calendar size={40} className="text-purple-500 mb-3" />
              <p className="text-gray-800 text-lg font-medium mb-1">No campaigns yet</p>
              <p className="text-gray-500 text-sm mb-4 text-center">Create your first marketing campaign</p>
              <button
                onClick={handleCloneAd}
                className="px-4 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Add size={16} />
                Create Campaign
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {generatedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} onDelete={handleDeleteCampaign} />
              ))}
            </div>
          )}
        </section>

        {clonedCampaigns.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Cloned from Competitor Ads</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {clonedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} onDelete={handleDeleteCampaign} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] rounded-xl">
                <TrendUp size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Suggestions Based on Trending Ads</h2>
                <p className="text-xs text-gray-500">Top performing ads from Meta Ad Library</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {getTrendingAds(6).map((ad) => (
              <TrendingAdCard key={ad.id} ad={ad} onClone={handleCloneAd} />
            ))}
          </div>
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

function CampaignCard({ campaign, onDelete }: { campaign: Campaign; onDelete: (id: number) => void }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-600";
      case "draft":
        return "bg-yellow-100 text-yellow-600";
      case "paused":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

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
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm capitalize ${getStatusColor(campaign.status)}`}>
            {campaign.status}
          </span>
        </div>
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
          {campaign.platform && (
            <span className={`px-1.5 py-0.5 rounded capitalize ${
              campaign.platform === "meta" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
            }`}>
              {campaign.platform}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button className="flex-1 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white text-xs rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1 font-medium">
            <Edit2 size={12} />
            Edit
          </button>
          <button
            onClick={() => onDelete(campaign.id)}
            className="py-2 px-3 bg-red-50 text-red-500 text-xs rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TrendingAdCard({ ad, onClone }: { ad: TrendingAd; onClone: () => void }) {
  return (
    <div className="bg-white border border-[#E8E5EC] rounded-2xl p-4 hover:shadow-lg transition-all group">
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
        <div className="absolute top-2 right-2">
          <span className="text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center gap-1">
            <Flash size={10} variant="Bold" />
            Score: {ad.adScore}
          </span>
        </div>
        {ad.isNew && (
          <div className="absolute bottom-2 left-2">
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white">
              NEW
            </span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-gray-800 font-medium truncate">{ad.productName}</h3>
        <p className="text-gray-500 text-xs line-clamp-2">{ad.headline}</p>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#A755FF] to-[#6800D7] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
            {ad.brand.charAt(0)}
          </div>
          <span className="text-gray-600 text-xs truncate">{ad.brand}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize flex-shrink-0 ${
            ad.platform === "meta" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
          }`}>
            {ad.platform}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClone}
            className="flex-1 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white text-xs rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1 font-medium"
          >
            <Copy size={12} />
            Use as Template
          </button>
        </div>
      </div>
    </div>
  );
}
