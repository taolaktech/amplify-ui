"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../Button";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { listMediaPresets } from "@/app/lib/api/base/media-presets";
import { type MediaPreset } from "@/app/lib/api/base/media-presets";

export default function CreativeTemplates() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const storeAdStyle = useCreateCampaignStore((s) => s.actions.storeAdStyle);

  const [presetType, setPresetType] = useState<"video" | "image">("video");
  const [presets, setPresets] = useState<MediaPreset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);
  const hasNextPageRef = useRef(true);
  const pageRef = useRef(1);

  const fetchPresets = async (nextPage: number) => {
    if (!token) return;
    if (isLoadingRef.current) return;
    if (!hasNextPageRef.current && nextPage !== 1) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      setError(null);
      const res = await listMediaPresets({
        token,
        type: presetType,
        page: nextPage,
        perPage: 12,
      });

      const nextPresets: MediaPreset[] = res?.data?.presets || [];
      const pagination = res?.data?.pagination;

      setPresets((prev) =>
        nextPage === 1 ? nextPresets : [...prev, ...nextPresets],
      );

      const nextHasNext = Boolean(pagination?.hasNextPage);
      hasNextPageRef.current = nextHasNext;
      pageRef.current = pagination?.page ?? nextPage;
    } catch (e: any) {
      setPresets([]);
      hasNextPageRef.current = false;
      const status = e?.response?.status;
      const isNetworkError =
        e?.message === "Network Error" ||
        e?.code === "ERR_NETWORK" ||
        e?.code === "ECONNABORTED";
      const friendly = isNetworkError
        ? "We couldn't connect to the service. Please check your connection and try again."
        : status === 401
          ? "Your session has expired. Please sign in again."
          : "We couldn't load templates right now. Please try again.";
      setError(friendly);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    hasNextPageRef.current = true;
    pageRef.current = 1;
    fetchPresets(1);
  }, [token, presetType]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (!hasNextPageRef.current) return;
        fetchPresets(pageRef.current + 1);
      },
      { rootMargin: "240px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [presetType]);

  const handleUseTemplate = (preset: MediaPreset) => {
    if (preset.type === "video") {
      storeAdStyle({
        presetType: "video",
        templateId: preset._id,
        videoPreset: {
          id: preset._id,
          title: preset.label || "Video",
          videoUrl: preset.mediaUrl || "",
          thumbnailImageUrl: preset.thumbnailUrl,
          duration: preset.duration,
        },
        complete: false,
      });
    } else {
      storeAdStyle({
        presetType: "image",
        imageTemplateIds: [preset._id],
        imagePresets: [
          {
            id: preset._id,
            label: preset.label,
            mediaUrl: preset.mediaUrl,
            thumbnailUrl: preset.thumbnailUrl,
          },
        ],
        complete: false,
      });
    }
    router.push("/create-campaign");
  };

  return (
    <div className="mt-10 bg-[rgba(246,246,246,0.75)] p-5 lg:p-7 rounded-2xl ">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold text-heading">
          Use Our Ready Made Creative Templates
        </h2>
        <div className="flex items-center gap-2 bg-[#F3EFF6] p-1 rounded-2xl">
          <button
            className={`px-4 h-[36px] rounded-xl text-sm font-medium ${
              presetType === "video"
                ? "bg-white text-heading"
                : "text-neutral-light"
            }`}
            onClick={() => {
              setPresetType("video");
            }}
          >
            Video Ads
          </button>
          <button
            className={`px-4 h-[36px] rounded-xl text-sm font-medium ${
              presetType === "image"
                ? "bg-white text-heading"
                : "text-neutral-light"
            }`}
            onClick={() => {
              setPresetType("image");
            }}
          >
            Image Ads
          </button>
        </div>
      </div>
      <div className="text-sm text-neutral-500 mb-6">
        Select a creative style for your image and video ads, and we'll adapt it
        using your product.
      </div>
      {error ? <div className="text-sm text-neutral-light">{error}</div> : null}

      {!isLoading && !error && presets.length === 0 ? (
        <div className="text-sm text-neutral-light">
          No {presetType} presets available.
        </div>
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {presets.map((preset) => {
          const previewUrl = preset.thumbnailUrl || preset.mediaUrl || "";
          const label = (preset.label || preset.type).trim();
          const disabled = !previewUrl;
          const isUnmuted = unmutedVideoId === preset._id;

          return (
            <div
              key={preset._id}
              className="relative rounded-3xl overflow-hidden border aspect-[9/16] w-full transition-all duration-200 bg-[#F3EFF6]"
            >
              <div className="absolute inset-0 bg-[#1b1b1b]" />

              {preset.type === "video" && previewUrl ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  muted={!isUnmuted}
                  playsInline
                  loop
                  autoPlay
                  poster={preset.thumbnailUrl}
                  src={preset.mediaUrl}
                />
              ) : previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={label}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : null}

              <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[rgba(0,0,0,0.85)] to-transparent" />

              {preset.type === "video" && preset.mediaUrl && !disabled && (
                <button
                  type="button"
                  className="absolute top-3 right-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tracking-100 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUnmutedVideoId((prev) =>
                      prev === preset._id ? null : preset._id,
                    );
                  }}
                  aria-label={isUnmuted ? "Mute video" : "Unmute video"}
                >
                  {isUnmuted ? "Mute" : "Unmute"}
                </button>
              )}

              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-white text-sm font-semibold tracking-100 whitespace-pre-line mb-3">
                  {label}
                </div>
                <Button
                  text="Use Template"
                  height={36}
                  action={() => handleUseTemplate(preset)}
                  disabled={disabled}
                />
              </div>
            </div>
          );
        })}
        <div ref={sentinelRef} className="col-span-full w-full h-8" />
      </div>

      {isLoading && (
        <div className="text-sm text-neutral-light mt-4">Loading…</div>
      )}
    </div>
  );
}
