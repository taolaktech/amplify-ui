"use client";
import { useState, useEffect } from "react";
import { Heart, Video, Image as ImageIcon, Play, Trash, Edit2, Eye, Copy, Add, Calendar, Clock, ArrowRight2 } from "iconsax-react";

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
  const [activeTab, setActiveTab] = useState<"saved" | "campaigns" | "cloned">("saved");
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-[calc(100vh-56px)] relative flex flex-col flex-shrink-0 lg:gap-6">
      <div className="mb-3 lg:hidden font-semibold text-lg">Campaigns</div>
      <div className="flex flex-col gap-7">
        <div className="flex w-full flex-col-reverse gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="font-medium tracking-150 text-sm lg:text-base">
            Manage your saved ads and campaigns
          </div>
          <a
            href="/create-campaign/campaign-snapshots"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white text-sm rounded-xl hover:opacity-90 transition-opacity"
          >
            <Add size={18} />
            Create Campaign
          </a>
        </div>

        <div className="bg-[rgba(246,246,246,0.75)] p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-6 border-b border-[#E5E5E5] pb-4">
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "saved"
                  ? "bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white"
                  : "bg-white text-gray-600 hover:bg-[#F3EFF6]"
              }`}
            >
              <Heart size={16} variant={activeTab === "saved" ? "Bold" : "Linear"} />
              Saved Ads
              {savedAds.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "saved" ? "bg-white/20" : "bg-purple-100 text-purple-600"
                }`}>
                  {savedAds.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "campaigns"
                  ? "bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white"
                  : "bg-white text-gray-600 hover:bg-[#F3EFF6]"
              }`}
            >
              <Calendar size={16} />
              Campaigns
              {generatedCampaigns.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "campaigns" ? "bg-white/20" : "bg-purple-100 text-purple-600"
                }`}>
                  {generatedCampaigns.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("cloned")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "cloned"
                  ? "bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white"
                  : "bg-white text-gray-600 hover:bg-[#F3EFF6]"
              }`}
            >
              <Copy size={16} />
              Cloned Ads
              {clonedCampaigns.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "cloned" ? "bg-white/20" : "bg-purple-100 text-purple-600"
                }`}>
                  {clonedCampaigns.length}
                </span>
              )}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {activeTab === "saved" && (
                <>
                  {savedAds.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Heart size={48} className="text-gray-300 mb-4" />
                      <p className="text-gray-600 text-lg mb-2">No saved ads yet</p>
                      <p className="text-gray-400 text-sm mb-4">Save ads from the Competitor Ads page to see them here</p>
                      <a
                        href="/dashboard-v2/inspirations"
                        className="px-4 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        Browse Competitor Ads
                        <ArrowRight2 size={16} />
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {savedAds.map((ad) => (
                        <div key={ad.id} className="bg-white border border-[#F3EFF6] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                          <div className="relative aspect-square">
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
                                  <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl border-2 border-white">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-purple-600 ml-1"></div>
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
                              <span className={`text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                                ad.previewType === "video" 
                                  ? "bg-purple-600 text-white" 
                                  : "bg-blue-500 text-white"
                              }`}>
                                {ad.previewType === "video" ? <Video size={10} /> : <ImageIcon size={10} />}
                                {ad.previewType}
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveSavedAd(ad.id)}
                              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                            >
                              <Heart size={16} variant="Bold" className="text-red-500" />
                            </button>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white text-[10px] font-bold">
                                {ad.brand.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-800 truncate">{ad.brand}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                                ad.platform === "meta" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
                              }`}>
                                {ad.platform}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mb-2">{ad.headline}</p>
                            <div className="flex items-center justify-between text-[10px] text-gray-400">
                              <span>{ad.niche}</span>
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {formatDate(ad.savedAt)}
                              </span>
                            </div>
                          </div>
                          <div className="p-3 pt-0 flex gap-2">
                            <button className="flex-1 py-2 bg-[#F3EFF6] text-purple-600 text-xs rounded-lg hover:bg-[#E6DCF0] transition-colors flex items-center justify-center gap-1 font-medium">
                              <Eye size={14} />
                              View
                            </button>
                            <a
                              href="/create-campaign/campaign-snapshots"
                              className="flex-1 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white text-xs rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1 font-medium"
                            >
                              <Copy size={14} />
                              Clone
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "campaigns" && (
                <>
                  {generatedCampaigns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Calendar size={48} className="text-gray-300 mb-4" />
                      <p className="text-gray-600 text-lg mb-2">No campaigns yet</p>
                      <p className="text-gray-400 text-sm mb-4">Create your first marketing campaign</p>
                      <a
                        href="/create-campaign/campaign-snapshots"
                        className="px-4 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <Add size={16} />
                        Create Campaign
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generatedCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} onDelete={handleDeleteCampaign} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "cloned" && (
                <>
                  {clonedCampaigns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Copy size={48} className="text-gray-300 mb-4" />
                      <p className="text-gray-600 text-lg mb-2">No cloned ads yet</p>
                      <p className="text-gray-400 text-sm mb-4">Clone competitor ads to use as inspiration for your campaigns</p>
                      <a
                        href="/dashboard-v2/inspirations"
                        className="px-4 py-2 bg-gradient-to-r from-[#A755FF] to-[#6800D7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        Browse Competitor Ads
                        <ArrowRight2 size={16} />
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {clonedCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} onDelete={handleDeleteCampaign} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
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
    <div className="bg-white border border-[#F3EFF6] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      {campaign.preview_url ? (
        <div className="relative aspect-video bg-[#F3EFF6]">
          {campaign.preview_type === "video" ? (
            <video src={campaign.preview_url} className="w-full h-full object-cover" muted />
          ) : (
            <img src={campaign.preview_url} alt={campaign.name} className="w-full h-full object-cover" />
          )}
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
          <Calendar size={32} className="text-purple-300" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800 truncate">{campaign.name}</h3>
          <span className={`text-[10px] px-2 py-1 rounded-full capitalize ${getStatusColor(campaign.status)}`}>
            {campaign.status}
          </span>
        </div>
        {campaign.source_brand && (
          <p className="text-xs text-gray-500 mb-2">From: {campaign.source_brand}</p>
        )}
        {campaign.headline && (
          <p className="text-xs text-gray-400 truncate mb-2">{campaign.headline}</p>
        )}
        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-3">
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
        <div className="flex gap-2">
          <button className="flex-1 py-2 bg-[#F3EFF6] text-purple-600 text-xs rounded-lg hover:bg-[#E6DCF0] transition-colors flex items-center justify-center gap-1 font-medium">
            <Edit2 size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete(campaign.id)}
            className="py-2 px-3 bg-red-50 text-red-500 text-xs rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
