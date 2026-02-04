"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
import {
  listVideoPresets,
  VideoPreset,
} from "@/app/lib/api/base/video-presets";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import ImageAdsTemplatesBrowser from "../product-kit/ImageAdsTemplatesBrowser";

const LOCAL_VIDEO_PRESETS: VideoPreset[] = [
  {
    _id: "local-video-1",
    title: "Skincare • Lifestyle routine",
    templateId: "local-video-1",
    videoUrl:
      "https://cdn.higgsfield.ai/veo3_motion/51748eea-5159-44b9-bbcb-f11a49cea887.mp4",
    thumbnailImageUrl: "/ig_post_lg.webp",
    thumbnailVideoUrl: "",
  },
  {
    _id: "local-video-2",
    title: "Skincare • Problem → solution",
    templateId: "local-video-2",
    videoUrl:
      "https://cdn.higgsfield.ai/veo3_motion/161e7c18-6448-4e3a-80aa-86523027dc8c.mp4",
    thumbnailImageUrl: "/facebook_post_lg.webp",
    thumbnailVideoUrl: "",
  },
  {
    _id: "local-video-3",
    title: "Wellness • Before / after",
    templateId: "local-video-3",
    videoUrl:
      "https://cdn.higgsfield.ai/veo3_motion/4faa72d7-d8a2-4037-a57e-753d0b8b76fa.mp4",
    thumbnailImageUrl: "/google_post_lg.webp",
    thumbnailVideoUrl: "",
  },
  {
    _id: "local-video-4",
    title: "Supplements • Offers & urgency",
    templateId: "local-video-4",
    videoUrl:
      "https://cdn.higgsfield.ai/veo3_motion/161e7c18-6448-4e3a-80aa-86523027dc8c.mp4",
    thumbnailImageUrl: "/facebook_post_lg_compressed.webp",
    thumbnailVideoUrl: "",
  },
  {
    _id: "local-video-5",
    title: "Beauty • Testimonials",
    templateId: "local-video-5",
    videoUrl:
      "https://cdn.higgsfield.ai/veo3_motion/51748eea-5159-44b9-bbcb-f11a49cea887.mp4",
    thumbnailImageUrl: "/ig_post_lg_compressed.webp",
    thumbnailVideoUrl: "",
  },
];

function normalizeLabel(input?: string) {
  return (input || "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

export default function ChooseAdStylePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const { productSelection } = useCreateCampaignStore((s) => s);
  const storeAdStyle = useCreateCampaignStore((s) => s.actions.storeAdStyle);

  const selectedProductNode = productSelection.products?.[0]?.node;

  const mode: "standard" = "standard";
  const [presetType, setPresetType] = useState<"video" | "image">("video");
  const [selectedVideoTemplateId, setSelectedVideoTemplateId] = useState<
    string | null
  >(null);
  const [selectedImageTemplateIds, setSelectedImageTemplateIds] = useState<
    string[]
  >([]);
  const [presetLoadError, setPresetLoadError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [presets, setPresets] = useState<VideoPreset[]>([]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);
  const hasNextPageRef = useRef(true);
  const pageRef = useRef(1);

  const canContinue =
    Boolean(selectedVideoTemplateId) && selectedImageTemplateIds.length > 0;

  const friendlyPresetLoadError = useMemo(() => {
    if (!presetLoadError) return null;
    if (/^Cannot\s+(GET|POST|PUT|DELETE)\s+/i.test(presetLoadError)) {
      return "We couldn’t connect to the service. Please check your connection and try again.";
    }
    return presetLoadError;
  }, [presetLoadError]);

  const showLocalVideoPresets = useMemo(() => {
    if (presetType !== "video") return false;
    if (!hasHydrated) return false;
    if (!token) return true;
    if (Boolean(friendlyPresetLoadError)) return true;
    if (!isLoading && presets.length === 0) return true;
    return false;
  }, [presetType, hasHydrated, token, friendlyPresetLoadError, isLoading, presets.length]);

  useEffect(() => {
    if (!productSelection.complete) {
      router.push("/create-campaign/");
    }
  }, []);

  const fetchPage = useCallback(
    async (nextPage: number) => {
      if (presetType !== "video") return;
      if (!token) return;
      if (isLoadingRef.current) return;
      if (!hasNextPageRef.current && nextPage !== 1) return;

      isLoadingRef.current = true;
      setIsLoading(true);
      try {
        setPresetLoadError(null);
        const res = await listVideoPresets({
          token,
          page: nextPage,
          perPage: 12,
        });
        const nextPresets = res.data.presets || [];
        const pagination = res.data.pagination;

        setPresets((prev) =>
          nextPage === 1 ? nextPresets : [...prev, ...nextPresets],
        );

        const nextHasNext = Boolean(pagination?.hasNextPage);
        hasNextPageRef.current = nextHasNext;
        setHasNextPage(nextHasNext);

        const nextPageValue = pagination?.page ?? nextPage;
        pageRef.current = nextPageValue;
        setPage(nextPageValue);
      } catch (e: any) {
        setPresets([]);
        setHasNextPage(false);
        hasNextPageRef.current = false;
        const status = e?.response?.status;
        const isNetworkError =
          e?.message === "Network Error" ||
          e?.code === "ERR_NETWORK" ||
          e?.code === "ECONNABORTED";
        const friendly = isNetworkError
          ? "We couldn’t connect to the service. Please check your connection and try again."
          : status === 401
            ? "Your session has expired. Please sign in again."
            : "We couldn’t load ad styles right now. Please try again.";
        setPresetLoadError(friendly);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [token, presetType],
  );

  useEffect(() => {
    if (!token) return;
    if (presetType !== "video") return;
    hasNextPageRef.current = true;
    pageRef.current = 1;
    fetchPage(1);
  }, [token, fetchPage, presetType]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const rootEl = listRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (presetType !== "video") return;
        if (!hasNextPageRef.current) return;
        fetchPage(pageRef.current + 1);
      },
      { root: rootEl, rootMargin: "240px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchPage, presetType]);

  const cards = useMemo(() => {
    if (presetType === "image") return [];
    const source = showLocalVideoPresets ? LOCAL_VIDEO_PRESETS : presets;
    return source.map((preset) => {
      const templateId = preset?._id;
      const rawLabel = preset?.title || preset?.label || preset?.templateId;
      const label = rawLabel?.trim() || normalizeLabel(rawLabel) || "Video";
      return {
        preset,
        templateId,
        label,
        disabled: !preset?.videoUrl,
      };
    });
  }, [presets, presetType, showLocalVideoPresets]);

  const toggleImageTemplateId = useCallback((templateId: string) => {
    setSelectedImageTemplateIds((prev) => {
      if (prev.includes(templateId)) {
        return prev.filter((id) => id !== templateId);
      }
      if (prev.length >= 5) return prev;
      return [...prev, templateId];
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-160px)] mt-10 pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-8 items-start">
        <div className="bg-[#FBFAFC] md:bg-white rounded-3xl custom-shadow-sm p-6 lg:sticky lg:top-24">
          <div className="text-heading">
            <div className="text-[34px] leading-[40px] font-bold tracking-800">
              CHOOSE YOUR AD
              <br />
              STYLE
            </div>
            <p className="mt-3 text-sm text-neutral-light tracking-40 max-w-[320px]">
              Select a style to generate your ad. Each preset includes optimized
              visuals, captions, and pacing for social media.
            </p>
          </div>

          <div className="mt-5">
            <Button
              text={"Generate ads"}
              action={async () => {
                if (!canContinue) return;

                const picked = cards.find(
                  (c) => c.templateId === selectedVideoTemplateId,
                );

                storeAdStyle({
                  templateId: selectedVideoTemplateId,
                  imageTemplateIds: selectedImageTemplateIds,
                  videoPreset: picked?.preset
                    ? {
                        id: picked.preset._id,
                        title: picked.label,
                        videoUrl: picked.preset.videoUrl,
                        thumbnailImageUrl: picked.preset.thumbnailImageUrl,
                        duration: (picked.preset as any).duration,
                      }
                    : null,
                  generationId: null,
                  mode,
                  complete: true,
                });

                router.push("/create-campaign/creative-ready");
              }}
              disabled={!canContinue}
              hasIconOrLoader
              icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
              iconPosition="right"
              iconSize={16}
            />
          </div>
        </div>

        <div className="bg-[#FBFAFC] md:bg-white rounded-3xl custom-shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-heading text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span>Ad styles</span>
            </div>

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

          <div
            ref={listRef}
            className={`mt-5 max-h-[calc(100vh-220px)] overflow-y-auto overflow-x-hidden pr-2 pink-scroll ${
              presetType === "video" ? "grid grid-cols-2 md:grid-cols-3 gap-4" : ""
            }`}
          >
            {presetType === "image" ? (
              <div className="col-span-full">
                {selectedProductNode ? (
                  <ImageAdsTemplatesBrowser
                    product={selectedProductNode}
                    selectedTemplateIds={selectedImageTemplateIds}
                    embedded
                    onToggleTemplateId={(templateId) =>
                      toggleImageTemplateId(templateId)
                    }
                  />
                ) : (
                  <div className="text-xs text-neutral-light">
                    Select a product to see image ad templates.
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="col-span-full text-sm font-medium text-heading">
                  Video ad templates
                </div>
                {cards.map((c, idx) => {
                  const isSelected =
                    Boolean(c.templateId) &&
                    selectedVideoTemplateId === c.templateId;
                  const disabled = c.disabled;

                  return (
                    <button
                      key={c.preset?._id}
                      className={`relative rounded-3xl overflow-hidden aspect-[9/16] w-full transition-all duration-200 ${
                        disabled
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      } ${
                        isSelected
                          ? "ring-2 ring-purple-600 shadow-[0_0_0_2px_rgba(104,0,215,0.18),0_0_22px_rgba(104,0,215,0.18)]"
                          : ""
                      }`}
                      aria-disabled={disabled}
                      tabIndex={disabled ? -1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        if (disabled) return;
                        setSelectedVideoTemplateId((prev) =>
                          prev === c.templateId ? null : c.templateId,
                        );
                      }}
                    >
                      {c.preset?.videoUrl ? (
                        <video
                          className="absolute inset-0 w-full h-full object-cover"
                          muted
                          playsInline
                          loop
                          autoPlay
                          poster={showLocalVideoPresets ? undefined : c.preset.thumbnailImageUrl}
                          src={c.preset.videoUrl}
                        />
                      ) : c.preset?.thumbnailImageUrl ? (
                        <img
                          src={c.preset.thumbnailImageUrl}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#1b1b1b]" />
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[rgba(0,0,0,0.85)] to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white text-sm font-semibold tracking-100 whitespace-pre-line">
                          {c.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
                <div ref={sentinelRef} className="col-span-full w-full h-8" />
              </>
            )}
          </div>

          {isLoading && (
            <div className="mt-4 text-xs text-neutral-light">
              Loading…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
