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
import {
  listMediaPresets,
  type MediaPreset,
} from "@/app/lib/api/base/media-presets";
import { generateImageAsset } from "@/app/lib/api/base/assets";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useToastStore } from "@/app/lib/stores/toastStore";

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
  const setToast = useToastStore((s) => s.setToast);
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

  const [generatedCopy, setGeneratedCopy] = useState("");
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [includeMusic, setIncludeMusic] = useState(true);
  const [includeVoiceover, setIncludeVoiceover] = useState(true);
  const [isEditingCopy, setIsEditingCopy] = useState(false);
  const [isCopySaved, setIsCopySaved] = useState(false);

  const [imageCopyById, setImageCopyById] = useState<Record<string, string>>(
    {},
  );
  const [imageEditingId, setImageEditingId] = useState<string | null>(null);
  const [imageCopySavedById, setImageCopySavedById] = useState<
    Record<string, boolean>
  >({});
  const [isGeneratingImageCopy, setIsGeneratingImageCopy] = useState<
    Record<string, boolean>
  >({});

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [presets, setPresets] = useState<VideoPreset[]>([]);

  const [imagePresets, setImagePresets] = useState<MediaPreset[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [imagePresetLoadError, setImagePresetLoadError] = useState<
    string | null
  >(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);
  const hasNextPageRef = useRef(true);
  const pageRef = useRef(1);

  const canContinue =
    Boolean(selectedVideoTemplateId) || selectedImageTemplateIds.length > 0;

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
  }, [
    presetType,
    hasHydrated,
    token,
    friendlyPresetLoadError,
    isLoading,
    presets.length,
  ]);

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
    if (!token) return;
    if (presetType !== "image") return;
    let cancelled = false;

    (async () => {
      setIsLoadingImages(true);
      try {
        setImagePresetLoadError(null);
        const res = await listMediaPresets({
          token,
          type: "image",
          page: 1,
          perPage: 50,
        });
        if (cancelled) return;
        setImagePresets(res?.data?.presets || []);
      } catch (e: any) {
        if (cancelled) return;
        const status = e?.response?.status;
        const isNetworkError =
          e?.message === "Network Error" ||
          e?.code === "ERR_NETWORK" ||
          e?.code === "ECONNABORTED";
        const friendly = isNetworkError
          ? "We couldn’t connect to the service. Please check your connection and try again."
          : status === 401
            ? "Your session has expired. Please sign in again."
            : "We couldn’t load image ad styles right now. Please try again.";
        setImagePresetLoadError(friendly);
        setImagePresets([]);
      } finally {
        if (cancelled) return;
        setIsLoadingImages(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, presetType]);

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

  const handleGenerateCopy = useCallback(async () => {
    if (isGeneratingCopy) return;
    setIsGeneratingCopy(true);
    setGeneratedCopy("");

    const productTitle = selectedProductNode?.title || "Product";
    const productDesc = selectedProductNode?.description || "";

    await new Promise((r) => setTimeout(r, 1200));

    const script = `Hook: Meet ${productTitle}.\n\nProblem: You want something that stands out.\n\nSolution: ${productTitle} delivers style and confidence.\n\nCTA: Tap to shop now.`;
    setGeneratedCopy(script);

    setIsGeneratingCopy(false);
  }, [
    isGeneratingCopy,
    selectedProductNode?.title,
    selectedProductNode?.description,
  ]);

  const handleGenerateImageCopy = useCallback(
    async (templateId: string, index: number) => {
      if (isGeneratingImageCopy[templateId]) return;
      setIsGeneratingImageCopy((prev) => ({ ...prev, [templateId]: true }));

      const productTitle = selectedProductNode?.title || "Product";
      const productDesc = selectedProductNode?.description || "";

      await new Promise((r) => setTimeout(r, 800 + index * 200));

      const headline = `Introducing ${productTitle}`;
      const body = productDesc
        ? productDesc.slice(0, 120)
        : `Discover ${productTitle} and shop today.`;
      const copy = `Headline: ${headline}\n\nBody: ${body}\n\nCTA: Shop now`;

      setImageCopyById((prev) => ({ ...prev, [templateId]: copy }));
      setIsGeneratingImageCopy((prev) => ({ ...prev, [templateId]: false }));
    },
    [
      isGeneratingImageCopy,
      selectedProductNode?.title,
      selectedProductNode?.description,
    ],
  );

  const handleGenerateAllImageCopies = useCallback(async () => {
    for (let i = 0; i < selectedImageTemplateIds.length; i++) {
      const templateId = selectedImageTemplateIds[i];
      if (!imageCopyById[templateId]) {
        await handleGenerateImageCopy(templateId, i);
      }
    }
  }, [selectedImageTemplateIds, imageCopyById, handleGenerateImageCopy]);

  return (
    <div className="min-h-[calc(100vh-160px)] mt-10 pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-8 items-start">
        <div className="bg-[#F3F4F6] rounded-3xl custom-shadow-sm p-6 lg:sticky lg:top-24">
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
            <p className="mt-2 text-xs text-neutral-light/70 tracking-40">
              You can select 1 video and up to 5 images per campaign.
            </p>
          </div>

          <div className="mt-5">
            <Button
              text={"Generate ads"}
              action={async () => {
                if (!canContinue) return;
                if (!token) {
                  setToast({
                    type: "error",
                    title: "Missing login",
                    message: "Please log in again to generate ads.",
                  });
                  return;
                }

                const productId = selectedProductNode?.id || "";
                const productName = selectedProductNode?.title || "";
                const productDescription =
                  selectedProductNode?.description || "";
                const productImages =
                  selectedProductNode?.media?.edges
                    ?.filter((e: any) => {
                      const type = (e?.node?.mediaContentType || "")
                        .toString()
                        .toUpperCase();
                      return type === "IMAGE";
                    })
                    .map((e: any) => e?.node?.preview?.image?.url)
                    .filter(
                      (u: any): u is string =>
                        typeof u === "string" && u.trim().length > 0,
                    )
                    .slice(0, 4) || [];

                const selectedImagePresetIds = selectedImageTemplateIds.slice(
                  0,
                  5,
                );

                let imageAssetIdsByPresetId: Record<string, string> = {};
                if (selectedImagePresetIds.length > 0) {
                  if (!productId || !productName || !productDescription) {
                    setToast({
                      type: "error",
                      title: "Missing product details",
                      message:
                        "Please select a product with title and description before generating images.",
                    });
                    return;
                  }

                  if (productImages.length === 0) {
                    setToast({
                      type: "error",
                      title: "Missing product images",
                      message:
                        "Please select a product with at least one image before generating image ads.",
                    });
                    return;
                  }

                  try {
                    const results = await Promise.all(
                      selectedImagePresetIds.map(async (presetId, idx) => {
                        const rawCopy = imageCopyById[presetId] || "";

                        const headlineMatch =
                          rawCopy.match(/Headline:\s*(.*)/i);
                        const bodyMatch = rawCopy.match(
                          /Body:\s*([\s\S]*?)(\n\nCTA:|$)/i,
                        );
                        const ctaMatch = rawCopy.match(/CTA:\s*(.*)/i);

                        const headline = (headlineMatch?.[1] || "").trim();
                        const bodyCopy = (bodyMatch?.[1] || "").trim();
                        const cta = (ctaMatch?.[1] || "").trim();

                        if (!headline || !bodyCopy) {
                          throw new Error(
                            `Generate copy for image ${idx + 1} before generating assets.`,
                          );
                        }

                        const res = await generateImageAsset({
                          token,
                          dto: {
                            productId,
                            productName,
                            productDescription,
                            productImages,
                            imagePresetId: presetId,
                            headline,
                            bodyCopy,
                            cta: cta || undefined,
                          },
                        });

                        const assetId = res?.data?.assetId;
                        if (!assetId) {
                          throw new Error(
                            `Image generation failed for image ${idx + 1}. Please try again.`,
                          );
                        }

                        return { presetId, assetId };
                      }),
                    );

                    imageAssetIdsByPresetId = results.reduce(
                      (acc, r) => {
                        acc[r.presetId] = r.assetId;
                        return acc;
                      },
                      {} as Record<string, string>,
                    );
                  } catch (e: any) {
                    const msg =
                      e?.response?.data?.message ||
                      e?.message ||
                      "We couldn’t generate an image right now. Please try again.";
                    setToast({
                      type: "error",
                      title: "Image generation failed",
                      message: msg,
                    });
                    return;
                  }
                }

                const picked = cards.find(
                  (c) => c.templateId === selectedVideoTemplateId,
                );

                storeAdStyle({
                  templateId: selectedVideoTemplateId,
                  imageTemplateIds: selectedImageTemplateIds,
                  imageAssetIdsByPresetId,
                  imagePresets: selectedImageTemplateIds
                    .map((id) => {
                      const p = imagePresets.find((x) => x._id === id);
                      return p
                        ? {
                            id: p._id,
                            label: p.label,
                            mediaUrl: p.mediaUrl,
                            thumbnailUrl: p.thumbnailUrl,
                          }
                        : null;
                    })
                    .filter(Boolean) as Array<{
                    id: string;
                    label?: string;
                    mediaUrl?: string;
                    thumbnailUrl?: string;
                  }>,
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

          {presetType === "video" && (
            <div className="mt-6 border-t border-[rgba(0,0,0,0.08)] pt-5">
              <div className="text-sm font-semibold text-heading mb-3">
                Video Script
              </div>

              <button
                onClick={handleGenerateCopy}
                disabled={isGeneratingCopy || !selectedVideoTemplateId}
                className="w-full h-[44px] rounded-[22px] bg-white border border-[#E0E0E0] text-sm font-medium text-heading flex items-center justify-center gap-2 hover:bg-[#FAFAFA] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGeneratingCopy ? (
                  <>
                    <span className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>Generate Script</>
                )}
              </button>

              {generatedCopy && (
                <div className="mt-3">
                  {isEditingCopy ? (
                    <textarea
                      className="w-full p-3 bg-white rounded-xl border border-purple-400 text-xs text-heading whitespace-pre-wrap min-h-[140px] max-h-[200px] overflow-y-auto resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
                      value={generatedCopy}
                      onChange={(e) => {
                        setGeneratedCopy(e.target.value);
                        setIsCopySaved(false);
                      }}
                      autoFocus
                    />
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-[#E8E8E8] text-xs text-neutral-light whitespace-pre-wrap max-h-[140px] overflow-y-auto">
                      {generatedCopy}
                    </div>
                  )}
                  <div className="mt-2 flex gap-2">
                    {isEditingCopy ? (
                      <>
                        <button
                          onClick={() => {
                            setIsEditingCopy(false);
                            setIsCopySaved(true);
                          }}
                          className="flex-1 h-[36px] rounded-[18px] bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditingCopy(false)}
                          className="flex-1 h-[36px] rounded-[18px] bg-white border border-[#E0E0E0] text-xs font-medium text-heading hover:bg-[#FAFAFA] transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditingCopy(true)}
                        className="flex-1 h-[36px] rounded-[18px] bg-white border border-[#E0E0E0] text-xs font-medium text-heading hover:bg-[#FAFAFA] transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isCopySaved && !isEditingCopy && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      ✓ Saved
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setIncludeMusic((v) => !v)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                      includeMusic ? "bg-purple-600" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        includeMusic ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-heading">Include Music</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setIncludeVoiceover((v) => !v)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                      includeVoiceover ? "bg-purple-600" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        includeVoiceover ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-heading">
                    Include Voiceover
                  </span>
                </label>
              </div>
            </div>
          )}

          {presetType === "image" && selectedImageTemplateIds.length > 0 && (
            <div className="mt-6 border-t border-[rgba(0,0,0,0.08)] pt-5">
              <div className="text-sm font-semibold text-heading mb-3">
                Ad Copy ({selectedImageTemplateIds.length} image
                {selectedImageTemplateIds.length > 1 ? "s" : ""})
              </div>

              <button
                onClick={handleGenerateAllImageCopies}
                disabled={selectedImageTemplateIds.every(
                  (id) => imageCopyById[id],
                )}
                className="w-full h-[44px] rounded-[22px] bg-white border border-[#E0E0E0] text-sm font-medium text-heading flex items-center justify-center gap-2 hover:bg-[#FAFAFA] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-3"
              >
                Generate All Copy
              </button>

              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {selectedImageTemplateIds.map((templateId, idx) => {
                  const copy = imageCopyById[templateId] || "";
                  const isEditing = imageEditingId === templateId;
                  const isGenerating = isGeneratingImageCopy[templateId];
                  const isSaved = imageCopySavedById[templateId];

                  return (
                    <div
                      key={templateId}
                      className="bg-white rounded-xl border border-[#E8E8E8] p-3"
                    >
                      <div className="text-xs font-medium text-heading mb-2">
                        Image {idx + 1}
                      </div>

                      {!copy && !isGenerating && (
                        <button
                          onClick={() =>
                            handleGenerateImageCopy(templateId, idx)
                          }
                          className="w-full h-[36px] rounded-[18px] bg-[#F3F4F6] border border-[#E0E0E0] text-xs font-medium text-heading hover:bg-[#EAEAEA] transition-colors"
                        >
                          Generate Copy
                        </button>
                      )}

                      {isGenerating && (
                        <div className="flex items-center gap-2 text-xs text-neutral-light">
                          <span className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                          Generating…
                        </div>
                      )}

                      {copy && !isGenerating && (
                        <>
                          {isEditing ? (
                            <textarea
                              className="w-full p-2 bg-[#FAFAFA] rounded-lg border border-purple-400 text-xs text-heading whitespace-pre-wrap min-h-[100px] resize-none focus:outline-none"
                              value={copy}
                              onChange={(e) => {
                                setImageCopyById((prev) => ({
                                  ...prev,
                                  [templateId]: e.target.value,
                                }));
                                setImageCopySavedById((prev) => ({
                                  ...prev,
                                  [templateId]: false,
                                }));
                              }}
                              autoFocus
                            />
                          ) : (
                            <div className="text-xs text-neutral-light whitespace-pre-wrap max-h-[80px] overflow-y-auto">
                              {copy}
                            </div>
                          )}
                          <div className="mt-2 flex gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => {
                                    setImageEditingId(null);
                                    setImageCopySavedById((prev) => ({
                                      ...prev,
                                      [templateId]: true,
                                    }));
                                  }}
                                  className="flex-1 h-[30px] rounded-[15px] bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setImageEditingId(null)}
                                  className="flex-1 h-[30px] rounded-[15px] bg-white border border-[#E0E0E0] text-xs font-medium text-heading hover:bg-[#FAFAFA] transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setImageEditingId(templateId)}
                                className="flex-1 h-[30px] rounded-[15px] bg-white border border-[#E0E0E0] text-xs font-medium text-heading hover:bg-[#FAFAFA] transition-colors"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                          {isSaved && !isEditing && (
                            <div className="mt-1 text-xs text-green-600 font-medium">
                              ✓ Saved
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#F3F4F6] rounded-3xl custom-shadow-sm p-6 overflow-hidden">
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
              presetType === "video"
                ? "grid grid-cols-2 md:grid-cols-3 gap-4"
                : ""
            }`}
          >
            {presetType === "image" ? (
              <>
                <div className="col-span-full text-sm font-medium text-heading">
                  Image ad templates
                </div>

                {imagePresetLoadError ? (
                  <div className="col-span-full text-xs text-neutral-light">
                    {imagePresetLoadError}
                  </div>
                ) : null}

                {isLoadingImages ? (
                  <div className="col-span-full text-xs text-neutral-light">
                    Loading…
                  </div>
                ) : null}

                {!isLoadingImages &&
                !imagePresetLoadError &&
                imagePresets.length === 0 ? (
                  <div className="col-span-full text-xs text-neutral-light">
                    No image presets available.
                  </div>
                ) : null}

                <div className="col-span-full grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePresets.map((p) => {
                    const isSelected = selectedImageTemplateIds.includes(p._id);
                    const previewUrl = p.thumbnailUrl || p.mediaUrl || "";
                    const label = (p.label || "Image").trim();
                    const disabled = !previewUrl;

                    return (
                      <button
                        key={p._id}
                        className={`relative rounded-3xl overflow-hidden border aspect-[9/16] w-full transition-all duration-200 ${
                          disabled
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer"
                        } ${
                          isSelected
                            ? "border-purple-600 ring-2 ring-purple-600 shadow-[0_0_0_2px_rgba(104,0,215,0.12),0_0_18px_rgba(104,0,215,0.12)]"
                            : "border-[rgba(0,0,0,0.06)]"
                        } bg-[#F3EFF6]`}
                        aria-disabled={disabled}
                        tabIndex={disabled ? -1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          if (disabled) return;
                          toggleImageTemplateId(p._id);
                        }}
                      >
                        <div className="absolute inset-0 bg-[#1b1b1b]" />

                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : null}

                        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[rgba(0,0,0,0.85)] to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-white text-sm font-semibold tracking-100 whitespace-pre-line">
                            {label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
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
                        disabled ? "cursor-not-allowed" : "cursor-pointer"
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
                          poster={
                            showLocalVideoPresets
                              ? undefined
                              : c.preset.thumbnailImageUrl
                          }
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
            <div className="mt-4 text-xs text-neutral-light">Loading…</div>
          )}
        </div>
      </div>
    </div>
  );
}
