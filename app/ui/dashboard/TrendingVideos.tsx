"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft2, Copy, Eye, Heart, Video } from "iconsax-react";

type TrendingAd = {
  id: number;
  title: string;
  description: string;
  previewUrl: string;
  platform: "TikTok" | "Instagram" | "Facebook";
  saved: boolean;
};

const trendingVideoAds: TrendingAd[] = [
  {
    id: 501,
    title: "Trending TikTok Hook",
    description:
      "A fast hook + benefit reveal format inspired by what’s working on TikTok right now",
    previewUrl:
      "/attached_assets/a069269c-49e5-4068-a750-007e54a3d580_1766197795899.mp4",
    platform: "TikTok",
    saved: false,
  },
  {
    id: 502,
    title: "Trending IG Reels Style",
    description: "A punchy Reels-style cut with captions and quick pattern interrupts",
    previewUrl:
      "/attached_assets/a5928bf1-8cca-4f11-80c1-d48602facf5a_1766197795899.mp4",
    platform: "Instagram",
    saved: false,
  },
  {
    id: 503,
    title: "Trending Facebook Short",
    description: "A Facebook-friendly short video with clear offer + CTA pacing",
    previewUrl:
      "/attached_assets/a7aa648c-6d7b-463a-8c47-998e25342aaa_1766197795900.mp4",
    platform: "Facebook",
    saved: false,
  },
];

export default function TrendingVideos({
  onSelectAd,
}: {
  onSelectAd?: (adId: number) => void;
}) {
  const router = useRouter();
  const [savedAds, setSavedAds] = useState<number[]>([]);

  const ads = useMemo(
    () =>
      trendingVideoAds.map((ad) => ({
        ...ad,
        saved: savedAds.includes(ad.id),
      })),
    [savedAds]
  );

  const handleCloneAd = (adId?: number) => {
    if (typeof adId === "number" && typeof onSelectAd === "function") {
      onSelectAd(adId);
      return;
    }

    const qs = new URLSearchParams();
    qs.set("source", "trending");
    if (typeof adId === "number") qs.set("adId", String(adId));
    router.push(`/dashboard-v2/create-campaign/product-selection?${qs.toString()}`);
  };

  const toggleSaveAd = (adId: number) => {
    setSavedAds((prev) =>
      prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
    );
  };

  return (
    <div className="bg-[rgba(246,246,246,0.75)] rounded-3xl p-4 lg:p-6 min-h-[400px]">
      <div className="mb-6 flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button className="text-purple-dark hover:text-purple-normal transition-colors -ml-7">
              <ArrowLeft2 size={20} />
            </button>
            <h2 className="text-purple-dark font-semibold text-xl">Trending Videos</h2>
          </div>
          <p className="text-gray-500 text-sm">
            Trending video formats across TikTok, Instagram, and Facebook you can clone and adapt.
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-4 lg:mt-0">{ads.length} videos available</p>
      </div>

      <div className="flex items-center gap-2 mb-6 text-xs bg-[#FEF5EA] px-3 py-2 rounded-lg">
        <span className="text-[#C67B22]">
          For inspiration only: These are prototype examples of trending formats.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white border border-[#F3EFF6] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
          >
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    <Video size={14} />
                  </div>
                  <span className="text-purple-dark font-semibold text-sm truncate">
                    {ad.title}
                  </span>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                  {ad.platform}
                </span>
              </div>
              <p className="text-gray-500 text-xs line-clamp-2 mb-2">{ad.description}</p>
            </div>

            <div className="relative h-[220px] mx-4 rounded-xl overflow-hidden bg-[#F3EFF6]">
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
              <button
                onClick={() => toggleSaveAd(ad.id)}
                className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <Heart
                  size={14}
                  variant={ad.saved ? "Bold" : "Linear"}
                  className={ad.saved ? "text-red-500" : "text-gray-600"}
                />
              </button>
            </div>

            <div className="p-4 pt-3">
              <button className="w-full py-2.5 bg-white border border-[#E6DCF0] text-purple-dark text-xs rounded-full hover:bg-[#F3EFF6] transition-colors flex items-center justify-center gap-1.5 font-medium mb-2">
                <Eye size={14} />
                View Details
              </button>
              <button
                onClick={() => handleCloneAd(ad.id)}
                className="w-full py-2.5 gradient text-white text-xs rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-1.5 font-medium"
              >
                <Copy size={14} />
                Clone Video
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
