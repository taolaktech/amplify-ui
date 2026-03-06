"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/app/ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
import { type VideoPreset } from "@/app/lib/api/base/video-presets";
import { listMediaPresets } from "@/app/lib/api/base/media-presets";
import { type MediaPreset } from "@/app/lib/api/base/media-presets";
import {
  generateCopy,
  generateImageAsset,
  generateVideoAsset,
} from "@/app/lib/api/base/assets";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useToastStore } from "@/app/lib/stores/toastStore";
import TemplateFilterBar from "./TemplateFilterBar";
import {
  type FilterState,
  EMPTY_FILTERS,
  hasActiveFilters,
} from "./templateFilters";

function normalizeLabel(input?: string) {
  return (input || "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function parseImageAdCopy(raw: string) {
  const text = (raw || "").toString();
  const headlineMatch = text.match(/Headline:\s*([\s\S]*?)(?:\n+Body:|$)/i);
  const bodyMatch = text.match(/Body:\s*([\s\S]*?)(?:\n+CTA:|$)/i);
  const ctaMatch = text.match(/CTA:\s*([\s\S]*)$/i);
  return {
    headline: (headlineMatch?.[1] || "").trim(),
    body: (bodyMatch?.[1] || "").trim(),
    cta: (ctaMatch?.[1] || "").trim(),
  };
}

export default function ChooseAdStylePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const setToast = useToastStore((s) => s.setToast);
  const { productSelection, adStyle } = useCreateCampaignStore((s) => s);
  const storeAdStyle = useCreateCampaignStore((s) => s.actions.storeAdStyle);
  const campaignSnapshots = useCreateCampaignStore((s) => s.campaignSnapshots);

  const selectedProductNode = productSelection.products?.[0]?.node;

  const mode = "standard" as const;
  const [presetType, setPresetType] = useState<"video" | "image">("video");
  const [selectedVideoTemplateId, setSelectedVideoTemplateId] = useState<
    string | null
  >(null);
  const [selectedImageTemplateIds, setSelectedImageTemplateIds] = useState<
    string[]
  >([]);
  const [presetLoadError, setPresetLoadError] = useState<string | null>(null);

  const [generatedCopy, setGeneratedCopy] = useState("");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [includeMusic, setIncludeMusic] = useState(true);
  const [includeVoiceOver, setIncludeVoiceOver] = useState(true);
  const [isEditingCopy, setIsEditingCopy] = useState(false);
  const [isCopySaved, setIsCopySaved] = useState(false);

  const [imageCopyById, setImageCopyById] = useState<Record<string, string>>(
    {},
  );
  const [imageCaptionById, setImageCaptionById] = useState<
    Record<string, string>
  >({});
  const [imageEditingId, setImageEditingId] = useState<string | null>(null);
  const [imageCopySavedById, setImageCopySavedById] = useState<
    Record<string, boolean>
  >({});
  const [isGeneratingImageCopy, setIsGeneratingImageCopy] = useState<
    Record<string, boolean>
  >({});

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const [isLoading, setIsLoading] = useState(false);
  const [presets, setPresets] = useState<VideoPreset[]>([]);
  const [videoTotal, setVideoTotal] = useState<number | null>(null);

  const [imagePresets, setImagePresets] = useState<MediaPreset[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [imagePresetLoadError, setImagePresetLoadError] = useState<
    string | null
  >(null);
  const [imageTotal, setImageTotal] = useState<number | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);
  const hasNextPageRef = useRef(true);
  const pageRef = useRef(1);

  const didHydrateFromStoreRef = useRef(false);

  const canContinue =
    Boolean(selectedVideoTemplateId) || selectedImageTemplateIds.length > 0;

  const getImagePresetLabelById = useCallback(
    (id: string, fallback: string) => {
      const fromFetched = imagePresets.find((p) => p._id === id);
      const label = (fromFetched?.label || "").trim();
      return label || fallback;
    },
    [imagePresets],
  );

  const getVideoPresetTitle = useCallback(() => {
    if (!selectedVideoTemplateId) return "";
    const fromFetched = presets.find((p) => p._id === selectedVideoTemplateId);
    const title = (fromFetched?.title || fromFetched?.label || "").trim();
    return title;
  }, [presets, selectedVideoTemplateId]);

  useEffect(() => {
    if (!productSelection.complete) {
      router.push("/create-campaign/");
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (didHydrateFromStoreRef.current) return;

    const nextPresetType = adStyle?.presetType;
    if (nextPresetType === "video" || nextPresetType === "image") {
      setPresetType(nextPresetType);
    }

    if (
      typeof adStyle?.templateId === "string" ||
      adStyle?.templateId === null
    ) {
      setSelectedVideoTemplateId(adStyle.templateId ?? null);
    }

    if (Array.isArray(adStyle?.imageTemplateIds)) {
      setSelectedImageTemplateIds(adStyle.imageTemplateIds);
    }

    if (typeof adStyle?.videoScript === "string") {
      setGeneratedCopy(adStyle.videoScript);
    }
    if (typeof adStyle?.videoCaption === "string") {
      setGeneratedCaption(adStyle.videoCaption);
    }

    if (typeof adStyle?.includeMusic === "boolean") {
      setIncludeMusic(adStyle.includeMusic);
    }
    if (typeof adStyle?.includeVoiceOver === "boolean") {
      setIncludeVoiceOver(adStyle.includeVoiceOver);
    }

    if (
      adStyle?.imageCopyByPresetId &&
      typeof adStyle.imageCopyByPresetId === "object"
    ) {
      setImageCopyById(adStyle.imageCopyByPresetId);
    }
    if (
      adStyle?.imageCaptionsByPresetId &&
      typeof adStyle.imageCaptionsByPresetId === "object"
    ) {
      setImageCaptionById(adStyle.imageCaptionsByPresetId);
    }

    didHydrateFromStoreRef.current = true;
  }, [adStyle, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!didHydrateFromStoreRef.current) return;

    storeAdStyle({
      presetType,
      templateId: selectedVideoTemplateId,
      imageTemplateIds: selectedImageTemplateIds,
      includeMusic,
      includeVoiceOver,
      videoCaption: generatedCaption,
      videoScript: generatedCopy,
      imageCopyByPresetId: imageCopyById,
      imageCaptionsByPresetId: imageCaptionById,
    });
  }, [
    hasHydrated,
    storeAdStyle,
    presetType,
    selectedVideoTemplateId,
    selectedImageTemplateIds,
    includeMusic,
    includeVoiceOver,
    generatedCaption,
    generatedCopy,
    imageCopyById,
    imageCaptionById,
  ]);

  const getOrderedProductImages = useCallback((): string[] => {
    const selected = (campaignSnapshots as any)?.selectedProductImages;
    const primary = (campaignSnapshots as any)?.primaryProductImageUrl;
    if (Array.isArray(selected) && selected.length > 0) {
      const deduped = selected.filter(
        (u: any): u is string => typeof u === "string" && u.trim().length > 0,
      );
      if (typeof primary === "string" && primary.trim().length > 0) {
        return [primary, ...deduped.filter((u) => u !== primary)];
      }
      return deduped;
    }

    const edges = selectedProductNode?.media?.edges || [];
    return edges
      .filter((e: any) => {
        const type = (e?.node?.mediaContentType || "").toString().toUpperCase();
        return type === "IMAGE";
      })
      .map((e: any) => e?.node?.preview?.image?.url)
      .filter(
        (u: any): u is string => typeof u === "string" && u.trim().length > 0,
      )
      .slice(0, 4);
  }, [campaignSnapshots, selectedProductNode?.media?.edges]);

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
        const res = await listMediaPresets({
          token,
          type: "video",
          page: nextPage,
          perPage: 12,
          ...(filters.creativeDirections.length > 0
            ? { creativeDirections: filters.creativeDirections }
            : {}),
          ...(filters.niches.length > 0 ? { niches: filters.niches } : {}),
          ...(filters.tags.length > 0 ? { tags: filters.tags } : {}),
        });

        const nextPresets: VideoPreset[] = (res?.data?.presets || []).map(
          (p) => {
            const title = p?.label;
            const videoUrl = p?.mediaUrl || "";
            const thumbnailImageUrl = p?.thumbnailUrl || "";
            const thumbnailVideoUrl = p?.mediaUrl || "";

            return {
              _id: p?._id,
              title,
              label: title,
              templateId: p?._id,
              videoUrl,
              thumbnailImageUrl,
              thumbnailVideoUrl,
              duration: p?.duration,
              resolution: p?.resolution,
              createdAt: p?.createdAt,
              updatedAt: p?.updatedAt,
            };
          },
        );

        const pagination = res?.data?.pagination;
        setVideoTotal(
          typeof pagination?.total === "number" ? pagination.total : null,
        );

        setPresets((prev) =>
          nextPage === 1 ? nextPresets : [...prev, ...nextPresets],
        );

        const nextHasNext = Boolean(pagination?.hasNextPage);
        hasNextPageRef.current = nextHasNext;

        const nextPageValue = pagination?.page ?? nextPage;
        pageRef.current = nextPageValue;
      } catch (e: any) {
        setPresets([]);
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
    [token, presetType, filters],
  );

  useEffect(() => {
    if (!token) return;
    if (presetType !== "video") return;
    hasNextPageRef.current = true;
    pageRef.current = 1;
    fetchPage(1);
  }, [token, fetchPage, presetType, filters]);

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
          ...(filters.creativeDirections.length > 0
            ? { creativeDirections: filters.creativeDirections }
            : {}),
          ...(filters.niches.length > 0 ? { niches: filters.niches } : {}),
          ...(filters.tags.length > 0 ? { tags: filters.tags } : {}),
        });
        if (cancelled) return;
        const pagination = res?.data?.pagination;
        setImageTotal(
          typeof pagination?.total === "number" ? pagination.total : null,
        );
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
        setImageTotal(null);
      } finally {
        if (cancelled) return;
        setIsLoadingImages(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, presetType, filters]);

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
    return presets.map((preset) => {
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
  }, [presets, presetType]);

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
    if (!token) {
      setToast({
        type: "error",
        title: "Missing login",
        message: "Please log in again to generate copy.",
      });
      return;
    }
    if (!selectedVideoTemplateId) {
      setToast({
        type: "error",
        title: "Missing template",
        message: "Please select a video style before generating copy.",
      });
      return;
    }

    setIsGeneratingCopy(true);
    setGeneratedCopy("");
    setGeneratedCaption("");

    const productId = selectedProductNode?.id || "";
    const productName = selectedProductNode?.title || "";
    const productDescription =
      selectedProductNode?.description ||
      selectedProductNode?.productType ||
      selectedProductNode?.category?.name ||
      "";
    const productCategory = selectedProductNode?.category?.name || undefined;
    const productImages = getOrderedProductImages();

    if (!productId || !productName) {
      setToast({
        type: "error",
        title: "Missing product details",
        message:
          "Please select a product with title and description before generating copy.",
      });
      setIsGeneratingCopy(false);
      return;
    }

    const safeProductDescription =
      productDescription.trim().length > 0 ? productDescription : "—";

    if (productImages.length === 0) {
      setToast({
        type: "error",
        title: "Missing product images",
        message:
          "Please select a product with at least one image before generating copy.",
      });
      setIsGeneratingCopy(false);
      return;
    }

    try {
      const res = await generateCopy({
        token,
        dto: {
          productId,
          productName,
          productDescription: safeProductDescription,
          productImages,
          productCategory: productCategory || "",
          mediaPresetId: selectedVideoTemplateId,
        },
      });

      const caption = res?.data?.caption || "";
      const script = res?.data?.script || "";

      setGeneratedCaption(caption);
      if (includeVoiceOver) {
        setGeneratedCopy(script);
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "We couldn’t generate copy right now. Please try again.";
      setToast({
        type: "error",
        title: "Copy generation failed",
        message: msg,
      });
    } finally {
      setIsGeneratingCopy(false);
    }
  }, [
    isGeneratingCopy,
    token,
    setToast,
    selectedVideoTemplateId,
    includeVoiceOver,
    selectedProductNode?.title,
    selectedProductNode?.description,
    selectedProductNode?.id,
    selectedProductNode?.productType,
    selectedProductNode?.category?.name,
    selectedProductNode?.media?.edges,
  ]);

  const handleGenerateImageCopy = useCallback(
    async (templateId: string, index: number) => {
      if (isGeneratingImageCopy[templateId]) return;
      setIsGeneratingImageCopy((prev) => ({ ...prev, [templateId]: true }));

      if (!token) {
        setToast({
          type: "error",
          title: "Missing login",
          message: "Please log in again to generate copy.",
        });
        setIsGeneratingImageCopy((prev) => ({ ...prev, [templateId]: false }));
        return;
      }

      const productId = selectedProductNode?.id || "";
      const productName = selectedProductNode?.title || "";
      const productDescription =
        selectedProductNode?.description ||
        selectedProductNode?.productType ||
        selectedProductNode?.category?.name ||
        "";
      const productCategory = selectedProductNode?.category?.name || undefined;
      const productImages = getOrderedProductImages();

      if (!productId || !productName) {
        setToast({
          type: "error",
          title: "Missing product details",
          message:
            "Please select a product with title and description before generating copy.",
        });
        setIsGeneratingImageCopy((prev) => ({ ...prev, [templateId]: false }));
        return;
      }

      const safeProductDescription =
        productDescription.trim().length > 0 ? productDescription : "—";

      if (productImages.length === 0) {
        setToast({
          type: "error",
          title: "Missing product images",
          message:
            "Please select a product with at least one image before generating copy.",
        });
        setIsGeneratingImageCopy((prev) => ({ ...prev, [templateId]: false }));
        return;
      }

      try {
        const res = await generateCopy({
          token,
          dto: {
            productId,
            productName,
            productDescription: safeProductDescription,
            productImages,
            productCategory: productCategory || "",
            mediaPresetId: templateId,
          },
        });

        const headline = (res?.data?.headline || "").trim();
        const description = (res?.data?.description || "").trim();
        const cta = (res?.data?.cta || "").trim();
        const caption = (res?.data?.caption || "").trim();

        const copy = `Headline: ${headline}\n\nBody: ${description}\n\nCTA: ${cta}`;

        setImageCopyById((prev) => ({ ...prev, [templateId]: copy }));
        setImageCaptionById((prev) => ({ ...prev, [templateId]: caption }));
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "We couldn’t generate copy right now. Please try again.";
        setToast({
          type: "error",
          title: "Copy generation failed",
          message: msg,
        });
      } finally {
        setIsGeneratingImageCopy((prev) => ({ ...prev, [templateId]: false }));
      }
    },
    [
      isGeneratingImageCopy,
      token,
      setToast,
      selectedProductNode?.title,
      selectedProductNode?.description,
      selectedProductNode?.id,
      selectedProductNode?.productType,
      selectedProductNode?.category?.name,
      selectedProductNode?.media?.edges,
    ],
  );

  const handleGenerateAllImageCopies = useCallback(async () => {
    for (let i = 0; i < selectedImageTemplateIds.length; i++) {
      const templateId = selectedImageTemplateIds[i];
      if (!imageCopyById[templateId] || !imageCaptionById[templateId]) {
        await handleGenerateImageCopy(templateId, i);
      }
    }
  }, [
    selectedImageTemplateIds,
    imageCopyById,
    imageCaptionById,
    handleGenerateImageCopy,
  ]);

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
                  selectedProductNode?.description ||
                  selectedProductNode?.productType ||
                  selectedProductNode?.category?.name ||
                  "";
                const productImages = getOrderedProductImages();

                const selectedImagePresetIds = selectedImageTemplateIds.slice(
                  0,
                  5,
                );

                let imageAssetIdsByPresetId: Record<string, string> = {};
                if (selectedImagePresetIds.length > 0) {
                  if (!productId || !productName) {
                    setToast({
                      type: "error",
                      title: "Missing product details",
                      message:
                        "Please select a product with title and description before generating images.",
                    });
                    return;
                  }

                  const safeProductDescription =
                    productDescription.trim().length > 0
                      ? productDescription
                      : "—";

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
                        const presetLabel = getImagePresetLabelById(
                          presetId,
                          `Image ${idx + 1}`,
                        );
                        const copy = imageCopyById[presetId] || "";
                        const headlineMatch = copy.match(
                          /Headline:\s*([\s\S]*?)(?:\n+Body:|$)/i,
                        );
                        const bodyMatch = copy.match(
                          /Body:\s*([\s\S]*?)(?:\n+CTA:|$)/i,
                        );
                        const ctaMatch = copy.match(/CTA:\s*([\s\S]*)$/i);

                        const headline = (headlineMatch?.[1] || "").trim();
                        const bodyCopy = (bodyMatch?.[1] || "").trim();
                        const cta = (ctaMatch?.[1] || "").trim();

                        if (!headline || !bodyCopy) {
                          throw new Error(
                            `Generate copy for ${presetLabel} before generating assets.`,
                          );
                        }

                        const res = await generateImageAsset({
                          token,
                          dto: {
                            productId,
                            productName,
                            productDescription: safeProductDescription,
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
                            `Image generation failed for ${presetLabel}. Please try again.`,
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

                let videoAssetId: string | null = null;
                if (selectedVideoTemplateId) {
                  const videoTitle = getVideoPresetTitle();
                  if (
                    includeVoiceOver &&
                    (!generatedCopy || generatedCopy.trim().length === 0)
                  ) {
                    setToast({
                      type: "error",
                      title: videoTitle
                        ? `Missing copy (${videoTitle})`
                        : "Missing copy",
                      message:
                        "Generate your video script before generating assets.",
                    });
                    return;
                  }

                  if (
                    !includeVoiceOver &&
                    (!generatedCaption || generatedCaption.trim().length === 0)
                  ) {
                    setToast({
                      type: "error",
                      title: videoTitle
                        ? `Missing copy (${videoTitle})`
                        : "Missing copy",
                      message:
                        "Generate your caption before generating assets.",
                    });
                    return;
                  }

                  if (!productId || !productName) {
                    setToast({
                      type: "error",
                      title: "Missing product details",
                      message:
                        "Please select a product with title and description before generating videos.",
                    });
                    return;
                  }

                  const safeProductDescription =
                    productDescription.trim().length > 0
                      ? productDescription
                      : "—";

                  if (productImages.length === 0) {
                    setToast({
                      type: "error",
                      title: "Missing product images",
                      message:
                        "Please select a product with at least one image before generating video ads.",
                    });
                    return;
                  }

                  try {
                    const res = await generateVideoAsset({
                      token,
                      dto: {
                        productId,
                        productName,
                        productDescription: safeProductDescription,
                        productImages,
                        videoPresetId: selectedVideoTemplateId,
                        includeMusic,
                        includeVoiceOver,
                        cta: undefined,
                      },
                    });
                    videoAssetId = res?.data?.assetId || null;
                  } catch (e: any) {
                    const msg =
                      e?.response?.data?.message ||
                      e?.message ||
                      "We couldn’t generate a video right now. Please try again.";
                    setToast({
                      type: "error",
                      title: "Video generation failed",
                      message: msg,
                    });
                    return;
                  }
                }

                storeAdStyle({
                  templateId: selectedVideoTemplateId,
                  imageTemplateIds: selectedImageTemplateIds,
                  imageAssetIdsByPresetId,
                  imageCaptionsByPresetId: selectedImageTemplateIds.reduce(
                    (acc, id) => {
                      const c = imageCaptionById[id];
                      if (typeof c === "string" && c.trim().length > 0) {
                        acc[id] = c;
                      }
                      return acc;
                    },
                    {} as Record<string, string>,
                  ),
                  videoAssetId,
                  videoCaption:
                    typeof generatedCaption === "string"
                      ? generatedCaption
                      : "",
                  videoScript:
                    includeVoiceOver && typeof generatedCopy === "string"
                      ? generatedCopy
                      : "",
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

              {(generatedCopy || generatedCaption) && (
                <div className="mt-3">
                  {isEditingCopy ? (
                    <>
                      {generatedCopy ? (
                        <div>
                          <div className="text-[11px] font-semibold text-heading mb-1">
                            Script
                          </div>
                          <textarea
                            className="w-full p-3 bg-white rounded-xl border border-purple-400 text-xs text-heading whitespace-pre-wrap min-h-[140px] max-h-[200px] overflow-y-auto resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
                            value={generatedCopy}
                            onChange={(e) => {
                              setGeneratedCopy(e.target.value);
                              setIsCopySaved(false);
                            }}
                            autoFocus
                          />
                        </div>
                      ) : null}

                      {generatedCaption ? (
                        <div className={generatedCopy ? "mt-2" : ""}>
                          <div className="text-[11px] font-semibold text-heading mb-1">
                            Caption
                          </div>
                          <textarea
                            className="w-full p-3 bg-white rounded-xl border border-purple-400 text-xs text-heading whitespace-pre-wrap min-h-[110px] max-h-[180px] overflow-y-auto resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
                            value={generatedCaption}
                            onChange={(e) => {
                              setGeneratedCaption(e.target.value);
                              setIsCopySaved(false);
                            }}
                          />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {generatedCopy ? (
                        <div>
                          <div className="text-[11px] font-semibold text-heading mb-1">
                            Script
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E8E8E8] text-xs text-neutral-light whitespace-pre-wrap max-h-[140px] overflow-y-auto">
                            {generatedCopy}
                          </div>
                        </div>
                      ) : null}
                      {generatedCaption ? (
                        <div className="mt-2">
                          <div className="text-[11px] font-semibold text-heading mb-1">
                            Caption
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E8E8E8] text-xs text-neutral-light whitespace-pre-wrap">
                            {generatedCaption}
                          </div>
                        </div>
                      ) : null}
                    </>
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
                        onClick={() => {
                          if (!generatedCopy && !generatedCaption) return;
                          setIsEditingCopy(true);
                        }}
                        disabled={!generatedCopy && !generatedCaption}
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
                    onClick={() => setIncludeVoiceOver((v) => !v)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                      includeVoiceOver ? "bg-purple-600" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        includeVoiceOver ? "translate-x-4" : "translate-x-0"
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
                  (id) => imageCopyById[id] && imageCaptionById[id],
                )}
                className="w-full h-[44px] rounded-[22px] bg-white border border-[#E0E0E0] text-sm font-medium text-heading flex items-center justify-center gap-2 hover:bg-[#FAFAFA] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-3"
              >
                Generate All Copy
              </button>

              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {selectedImageTemplateIds.map((templateId, idx) => {
                  const copy = imageCopyById[templateId] || "";
                  const caption = imageCaptionById[templateId] || "";
                  const isEditing = imageEditingId === templateId;
                  const isGenerating = isGeneratingImageCopy[templateId];
                  const isSaved = imageCopySavedById[templateId];
                  const parsed = parseImageAdCopy(copy);
                  const displayName = getImagePresetLabelById(
                    templateId,
                    `Image ${idx + 1}`,
                  );

                  return (
                    <div
                      key={templateId}
                      className="bg-white rounded-xl border border-[#E8E8E8] p-3"
                    >
                      <div className="text-xs font-medium text-heading mb-2">
                        {displayName}
                      </div>

                      {!copy && !caption && !isGenerating && (
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

                      {(copy || caption) && !isGenerating && (
                        <>
                          {isEditing ? (
                            <>
                              <div className="text-[11px] font-semibold text-heading mb-1">
                                Ad Copy
                              </div>
                              <div className="text-[11px] font-semibold text-heading mb-1">
                                Headline
                              </div>
                              <input
                                className="w-full p-2 bg-[#FAFAFA] rounded-lg border border-purple-400 text-xs text-heading focus:outline-none"
                                value={parsed.headline}
                                onChange={(e) => {
                                  const nextHeadline = e.target.value;
                                  setImageCopyById((prev) => {
                                    const current = parseImageAdCopy(
                                      prev[templateId] || "",
                                    );
                                    const next = `Headline: ${nextHeadline}\n\nBody: ${current.body}\n\nCTA: ${current.cta}`;
                                    return { ...prev, [templateId]: next };
                                  });
                                  setImageCopySavedById((prev) => ({
                                    ...prev,
                                    [templateId]: false,
                                  }));
                                }}
                                autoFocus
                              />

                              <div className="mt-2 text-[11px] font-semibold text-heading mb-1">
                                Body
                              </div>
                              <textarea
                                className="w-full p-2 bg-[#FAFAFA] rounded-lg border border-purple-400 text-xs text-heading whitespace-pre-wrap min-h-[90px] resize-none focus:outline-none"
                                value={parsed.body}
                                onChange={(e) => {
                                  const nextBody = e.target.value;
                                  setImageCopyById((prev) => {
                                    const current = parseImageAdCopy(
                                      prev[templateId] || "",
                                    );
                                    const next = `Headline: ${current.headline}\n\nBody: ${nextBody}\n\nCTA: ${current.cta}`;
                                    return { ...prev, [templateId]: next };
                                  });
                                  setImageCopySavedById((prev) => ({
                                    ...prev,
                                    [templateId]: false,
                                  }));
                                }}
                              />

                              <div className="mt-2 text-[11px] font-semibold text-heading mb-1">
                                CTA
                              </div>
                              <input
                                className="w-full p-2 bg-[#FAFAFA] rounded-lg border border-purple-400 text-xs text-heading focus:outline-none"
                                value={parsed.cta}
                                onChange={(e) => {
                                  const nextCta = e.target.value;
                                  setImageCopyById((prev) => {
                                    const current = parseImageAdCopy(
                                      prev[templateId] || "",
                                    );
                                    const next = `Headline: ${current.headline}\n\nBody: ${current.body}\n\nCTA: ${nextCta}`;
                                    return { ...prev, [templateId]: next };
                                  });
                                  setImageCopySavedById((prev) => ({
                                    ...prev,
                                    [templateId]: false,
                                  }));
                                }}
                              />

                              <div className="mt-2 text-[11px] font-semibold text-heading mb-1">
                                Caption
                              </div>
                              <textarea
                                className="w-full p-2 bg-[#FAFAFA] rounded-lg border border-purple-400 text-xs text-heading whitespace-pre-wrap min-h-[80px] resize-none focus:outline-none"
                                value={caption}
                                onChange={(e) => {
                                  setImageCaptionById((prev) => ({
                                    ...prev,
                                    [templateId]: e.target.value,
                                  }));
                                  setImageCopySavedById((prev) => ({
                                    ...prev,
                                    [templateId]: false,
                                  }));
                                }}
                              />
                            </>
                          ) : (
                            <>
                              {copy ? (
                                <>
                                  <div className="text-[11px] font-semibold text-heading mb-1">
                                    Ad Copy
                                  </div>
                                  <div className="text-xs text-neutral-light whitespace-pre-wrap max-h-[80px] overflow-y-auto">
                                    {copy}
                                  </div>
                                </>
                              ) : null}

                              {caption ? (
                                <>
                                  <div className="mt-2 text-[11px] font-semibold text-heading mb-1">
                                    Caption
                                  </div>
                                  <div className="text-xs text-neutral-light whitespace-pre-wrap max-h-[60px] overflow-y-auto">
                                    {caption}
                                  </div>
                                </>
                              ) : null}
                            </>
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

          <div className="mt-4">
            <TemplateFilterBar
              filters={filters}
              onChange={setFilters}
              resultCount={
                presetType === "image"
                  ? (imageTotal ?? imagePresets.length)
                  : (videoTotal ?? presets.length)
              }
            />
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
                (imageTotal ?? imagePresets.length) === 0 &&
                hasActiveFilters(filters) ? (
                  <div className="col-span-full text-xs text-neutral-light">
                    No templates match your filters.
                  </div>
                ) : null}

                {!isLoadingImages &&
                !imagePresetLoadError &&
                (imageTotal ?? imagePresets.length) === 0 &&
                !hasActiveFilters(filters) ? (
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
                          <Image
                            src={previewUrl}
                            alt={label}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="absolute inset-0 w-full h-full object-cover"
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
                {(videoTotal ?? presets.length) === 0 &&
                !isLoading &&
                hasActiveFilters(filters) ? (
                  <div className="col-span-full mt-8 rounded-2xl border border-dashed border-input-border p-8 text-center animate-fadeIn">
                    <div className="text-2xl mb-2">🎬</div>
                    <div className="text-sm font-medium text-heading">
                      No templates match your filters
                    </div>
                    <div className="mt-1 text-xs text-neutral-light">
                      Try adjusting your Creative Direction, Niche, or Tags.
                    </div>
                    <button
                      onClick={() => setFilters(EMPTY_FILTERS)}
                      className="mt-4 h-[36px] px-5 rounded-xl bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : null}

                {(videoTotal ?? presets.length) === 0 &&
                !isLoading &&
                !hasActiveFilters(filters) ? (
                  <div className="col-span-full text-xs text-neutral-light">
                    No video presets available.
                  </div>
                ) : null}

                {cards.map((c) => {
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
                          poster={c.preset.thumbnailImageUrl}
                          src={c.preset.videoUrl}
                        />
                      ) : c.preset?.thumbnailImageUrl ? (
                        <Image
                          src={c.preset.thumbnailImageUrl}
                          alt={c.label}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
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
