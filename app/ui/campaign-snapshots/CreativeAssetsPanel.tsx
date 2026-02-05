"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import useCreativesStore from "@/app/lib/stores/creativesStore";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useToastStore } from "@/app/lib/stores/toastStore";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import {
  listAssets,
  saveAsset,
  uploadVideo,
  AssetType,
} from "@/app/lib/api/base/assets";

type Props = {
  highlightedProductId: string;
};

export default function CreativeAssetsPanel({ highlightedProductId }: Props) {
  const token = useAuthStore((state) => state.token);
  const destinationUrl = useCreateCampaignStore(
    (state) => state.campaignSnapshots.destinationUrl,
  );
  const setToast = useToastStore((state) => state.setToast);

  const { Instagram, Facebook } = useCreativesStore((state) => state);

  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [savingUrl, setSavingUrl] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const latestMediaCreatives = useMemo(() => {
    const productId = highlightedProductId;
    const instagramSet = Instagram?.[productId]?.[Instagram?.[productId]?.length - 1];
    const facebookSet = Facebook?.[productId]?.[Facebook?.[productId]?.length - 1];

    const igCreatives: any[] = Array.isArray(instagramSet?.creatives)
      ? instagramSet.creatives
      : [];
    const fbCreatives: any[] = Array.isArray(facebookSet?.creatives)
      ? facebookSet.creatives
      : [];

    return [...igCreatives, ...fbCreatives];
  }, [Facebook, Instagram, highlightedProductId]);

  const generatedImageUrls = useMemo(() => {
    const urls = latestMediaCreatives
      .map((c) => c?.url)
      .filter((u) => typeof u === "string" && u.trim().length > 0);

    return Array.from(new Set(urls));
  }, [latestMediaCreatives]);

  const savedImageUrls = useMemo(() => {
    return new Set(
      assets
        .filter((a) => a?.type === "image")
        .map((a) => a?.url)
        .filter((u: any) => typeof u === "string"),
    );
  }, [assets]);

  const savedVideoStorageUrls = useMemo(() => {
    return new Set(
      assets
        .filter((a) => a?.type === "video")
        .map((a) => a?.storageUrl)
        .filter((u: any) => typeof u === "string"),
    );
  }, [assets]);

  const refreshAssets = async (type?: AssetType) => {
    if (!token) return;
    setIsLoadingAssets(true);
    try {
      const result = await listAssets({
        token,
        productId: highlightedProductId,
        type,
      });
      setAssets(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      setToast({
        type: "error",
        title: "Could not load assets",
        message: "Please try again.",
      });
    } finally {
      setIsLoadingAssets(false);
    }
  };

  useEffect(() => {
    if (!token || !highlightedProductId) return;
    refreshAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, highlightedProductId]);

  const handleSaveImage = async (url: string) => {
    if (!token) return;

    setSavingUrl(url);
    try {
      await saveAsset({
        token,
        dto: {
          type: "image",
          source: "generated",
          url,
          productId: highlightedProductId,
          metadata: {
            destinationUrl,
          },
        },
      });

      setToast({
        type: "success",
        title: "Saved to library",
        message: "This image is now available in Saved Ads.",
      });
      await refreshAssets("image");
    } catch (err) {
      setToast({
        type: "error",
        title: "Save failed",
        message: "Please try again.",
      });
    } finally {
      setSavingUrl(null);
    }
  };

  const handleUploadVideo = async (file: File) => {
    if (!token) return;

    setUploadingVideo(true);
    try {
      const uploadResult = await uploadVideo({ token, file });

      await saveAsset({
        token,
        dto: {
          type: "video",
          source: "uploaded",
          storageUrl: uploadResult.storageUrl,
          thumbnailUrl: uploadResult.thumbnailUrl,
          productId: highlightedProductId,
          metadata: {
            destinationUrl,
            duration: uploadResult.duration,
            resolution: uploadResult.resolution,
          },
        },
      });

      setToast({
        type: "success",
        title: "Video uploaded",
        message: "This video is now available in Saved Ads.",
      });
      await refreshAssets("video");
    } catch (err) {
      setToast({
        type: "error",
        title: "Upload failed",
        message: "Please try again.",
      });
    } finally {
      setUploadingVideo(false);
    }
  };

  return (
    <div className="mt-10 px-5 lg:pl-0 lg:pr-5">
      <div className="bg-[#FBFAFC] border border-[#EFEFEF] rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-heading md:text-lg font-medium">
              Creative Assets
            </h3>
            <p className="text-xs md:text-sm text-neutral-light mt-1">
              Save generated images and upload videos to use as creatives.
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => setActiveTab("images")}
            className={`h-[36px] px-4 rounded-[39px] border text-sm font-medium ${
              activeTab === "images"
                ? "bg-[#F0E6FB] border-[#D0B0F3]"
                : "bg-[#ECECEC] border-[#E0E0E0]"
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`h-[36px] px-4 rounded-[39px] border text-sm font-medium ${
              activeTab === "videos"
                ? "bg-[#F0E6FB] border-[#D0B0F3]"
                : "bg-[#ECECEC] border-[#E0E0E0]"
            }`}
          >
            Videos
          </button>
        </div>

        {activeTab === "images" && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-heading">Generated Images</p>
              {isLoadingAssets && (
                <p className="text-xs text-neutral-light">Loading…</p>
              )}
            </div>

            {generatedImageUrls.length === 0 ? (
              <div className="mt-4 text-sm text-[#BFBFBF]">No images yet.</div>
            ) : (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {generatedImageUrls.map((url) => {
                  const isSaved = savedImageUrls.has(url);
                  const isSaving = savingUrl === url;

                  return (
                    <div
                      key={url}
                      className="border border-[#EFEFEF] rounded-2xl p-2 bg-white"
                    >
                      <div className="relative w-full h-[120px] rounded-xl overflow-hidden">
                        <Image
                          src={url}
                          alt="Generated"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-medium ${
                            isSaved ? "text-[#4CAF50]" : "text-[#9B9B9B]"
                          }`}
                        >
                          {isSaved ? "Saved" : "Not saved"}
                        </span>
                        <button
                          disabled={isSaved || isSaving}
                          onClick={() => handleSaveImage(url)}
                          className={`h-[28px] px-3 rounded-[39px] border text-xs font-medium ${
                            isSaved
                              ? "bg-[#ECECEC] border-[#E0E0E0] cursor-not-allowed"
                              : "bg-[#F0E6FB] border-[#D0B0F3]"
                          }`}
                        >
                          {isSaving ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "videos" && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-heading">Upload a Video</p>
              {isLoadingAssets && (
                <p className="text-xs text-neutral-light">Loading…</p>
              )}
            </div>

            <div className="mt-3">
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                disabled={uploadingVideo}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const maxBytes = 250 * 1024 * 1024;
                  if (file.size > maxBytes) {
                    setToast({
                      type: "error",
                      title: "File too large",
                      message: "Max upload size is 250MB.",
                    });
                    return;
                  }

                  handleUploadVideo(file);
                }}
                className="w-full text-sm"
              />
              <p className="mt-2 text-xs md:text-sm text-neutral-light">
                Recommended: 6–15 seconds. Formats: mp4, mov, webm. Max 250MB.
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-heading">Saved Videos</p>

              {assets.filter((a) => a?.type === "video").length === 0 ? (
                <div className="mt-3 text-sm text-[#BFBFBF]">
                  No videos saved yet.
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assets
                    .filter((a) => a?.type === "video")
                    .map((video) => {
                      const isSaved =
                        typeof video?.storageUrl === "string" &&
                        savedVideoStorageUrls.has(video.storageUrl);

                      return (
                        <div
                          key={video?._id || video?.storageUrl}
                          className="border border-[#EFEFEF] rounded-2xl p-3 bg-white"
                        >
                          <div className="flex gap-3">
                            <div className="relative w-[96px] h-[72px] rounded-xl overflow-hidden bg-[#F1F1F1]">
                              {video?.thumbnailUrl ? (
                                <Image
                                  src={video.thumbnailUrl}
                                  alt="Video thumbnail"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-[#9B9B9B]">
                                {video?.duration ? `${Math.round(video.duration)}s` : ""}
                                {video?.duration && video?.resolution ? " • " : ""}
                                {video?.resolution ? video.resolution : ""}
                              </div>
                              <div className="mt-1 text-xs font-medium text-[#4CAF50]">
                                {isSaved ? "Saved" : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
