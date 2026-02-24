"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowForward } from "iconsax-react";
import Button from "@/app/ui/Button";
import { useModal } from "@/app/lib/hooks/useModal";
import { useToastStore } from "@/app/lib/stores/toastStore";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useAuthStore } from "@/app/lib/stores/authStore";
import {
  useAssetLibraryStore,
  type AssetFormat,
  type AssetPlatform,
} from "@/app/lib/stores/assetLibraryStore";
import { getAssetById, type Asset } from "@/app/lib/api/base/assets";
import { getSeededImageAdTemplates } from "../product-kit/ImageAdsTemplatesBrowser";

type ReadyCreative = {
  id: string;
  type: "video" | "image";
  title: string;
  url: string;
};

type AdCopy = {
  headline: string;
  bodyCopy: string;
  callToAction: string;
  brandName: string;
  websiteUrl: string;
  videoScript: string;
};

const AD_COPY_STORAGE_KEY = "creative-ready.ad-copy.v1";

const creativeKey = (c: ReadyCreative) => `${c.type}:${c.id}`;

const clamp = (value: string, max: number) => {
  const v = `${value || ""}`;
  if (v.length <= max) return v;
  return v.slice(0, max);
};

const svgDataUrl = (svg: string) => {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml,${encoded}`;
};

const buildImageCreativeSvg = (args: {
  baseImageUrl: string;
  copy: AdCopy;
}) => {
  const { baseImageUrl, copy } = args;

  const headline = clamp(copy.headline || "", 60);
  const body = clamp(copy.bodyCopy || "", 180);
  const cta = clamp(copy.callToAction || "", 30);
  const brand = clamp(copy.brandName || "", 30);
  const site = clamp(copy.websiteUrl || "", 60);

  // 1080x1920 (9:16). Use an external <image/> for the base image.
  // This is frontend-only. If the remote image blocks embedding, the layout still renders the ad copy.
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0.0)"/>
      <stop offset="55%" stop-color="rgba(0,0,0,0.15)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.80)"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="rgba(0,0,0,0.45)"/>
    </filter>
  </defs>

  <rect width="1080" height="1920" fill="#111"/>
  <image href="${baseImageUrl}" x="0" y="0" width="1080" height="1920" preserveAspectRatio="xMidYMid slice"/>
  <rect x="0" y="0" width="1080" height="1920" fill="url(#fade)"/>

  <g filter="url(#shadow)">
    <text x="80" y="1440" fill="#fff" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="72" font-weight="800">
      ${headline.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    </text>
  </g>

  <text x="80" y="1525" fill="rgba(255,255,255,0.92)" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="40" font-weight="500">
    ${body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
  </text>

  <g>
    <rect x="80" y="1655" rx="26" ry="26" width="420" height="92" fill="rgba(167,85,255,0.95)"/>
    <text x="290" y="1715" text-anchor="middle" fill="#fff" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="36" font-weight="800">
      ${cta.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    </text>
  </g>

  <text x="80" y="1788" fill="rgba(255,255,255,0.85)" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="30" font-weight="700">
    ${brand.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
  </text>
  <text x="80" y="1840" fill="rgba(255,255,255,0.72)" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="26" font-weight="500">
    ${site.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
  </text>
</svg>`;
};

function formatDuration(seconds?: number) {
  if (!seconds || !Number.isFinite(seconds)) return null;
  const s = Math.max(0, Math.round(seconds));
  const mm = Math.floor(s / 60);
  const ss = `${s % 60}`.padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function CreativeReadyPage() {
  const router = useRouter();
  const setToast = useToastStore((s) => s.setToast);
  const token = useAuthStore((s) => s.token);

  const { productSelection, adStyle } = useCreateCampaignStore((s) => s);
  const { campaignSnapshots } = useCreateCampaignStore((s) => s);
  const attachedAssets = useCreateCampaignStore((s) => s.attachedAssets);
  const assetActions = useAssetLibraryStore((s) => s.actions);

  const product = productSelection.products?.[0]?.node;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const [regeneratedCreatives, setRegeneratedCreatives] = useState<
    ReadyCreative[]
  >([]);

  const [generatedAssetByCreativeId, setGeneratedAssetByCreativeId] = useState<
    Record<
      string,
      {
        assetId: string;
        status: "pending" | "completed" | "failed";
        url?: string;
        error?: string;
      }
    >
  >({});

  const [copyGeneratedByCreativeId, setCopyGeneratedByCreativeId] = useState<
    Record<string, boolean>
  >({});

  const generationAbortControllersRef = useRef<Record<string, AbortController>>(
    {},
  );

  const [isSaving, setIsSaving] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoDuration, setVideoDuration] = useState<number | undefined>(
    undefined,
  );

  useModal(isBackModalOpen || isZoomOpen);

  const imageTemplates = useMemo(() => {
    return getSeededImageAdTemplates(null);
  }, []);

  const placeholderVideoUrl =
    "https://cdn.higgsfield.ai/veo3_motion/51748eea-5159-44b9-bbcb-f11a49cea887.mp4";

  const selectedProductImages = useMemo(() => {
    const edges = product?.media?.edges || [];
    return edges
      .filter((e) => {
        const type = (e?.node?.mediaContentType || "").toString().toUpperCase();
        return type === "IMAGE";
      })
      .map((e) => e?.node?.preview?.image?.url)
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
      .slice(0, 4);
  }, [product?.media?.edges]);

  const pollAssetUntilDone = async (args: {
    assetId: string;
    signal: AbortSignal;
  }): Promise<Asset> => {
    const startedAt = Date.now();
    const timeoutMs = 5 * 60 * 1000;
    while (true) {
      if (args.signal.aborted) {
        throw new Error("Polling aborted");
      }
      if (!token) {
        throw new Error("Missing auth token");
      }

      const res = await getAssetById({ token, assetId: args.assetId });
      const asset = res?.data;
      const status = asset?.status;

      if (status === "completed") {
        return asset;
      }

      if (status === "failed") {
        throw new Error("Asset generation failed.");
      }

      if (Date.now() - startedAt >= timeoutMs) {
        throw new Error(
          "Asset generation is taking longer than expected. Please try again.",
        );
      }

      await new Promise((r) => setTimeout(r, 10_000));
    }
  };

  const LoaderFrame = ({ className = "" }: { className?: string }) => {
    return (
      <div
        className={`absolute inset-0 bg-[#111] flex items-center justify-center ${className}`}
      >
        <div className="w-7 h-7 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  };

  const imageCreatives = useMemo((): ReadyCreative[] => {
    const ids = Array.isArray(adStyle.imageTemplateIds)
      ? adStyle.imageTemplateIds
      : [];

    const presetById = new Map(
      (Array.isArray(adStyle.imagePresets) ? adStyle.imagePresets : []).map(
        (p) => [p.id, p],
      ),
    );

    const fromPresets = ids
      .map((id) => {
        const p = presetById.get(id);
        const url = p?.mediaUrl || p?.thumbnailUrl || "";
        return {
          id,
          type: "image" as const,
          title: p?.label || "Image creative",
          url,
        };
      })
      .filter((c) => typeof c.url === "string" && c.url.trim().length > 0);

    if (fromPresets.length > 0) return fromPresets;

    const fromTemplates = ids
      .map((id) => {
        const t = imageTemplates.find((x) => x.id === id);
        const url = t?.previewImageUrl || "";
        return {
          id,
          type: "image" as const,
          title: t?.name || "Image creative",
          url,
        };
      })
      .filter((c) => typeof c.url === "string" && c.url.trim().length > 0);

    if (fromTemplates.length > 0) return fromTemplates;

    return selectedProductImages.map((url, idx) => ({
      id: `product-image-${idx}`,
      type: "image" as const,
      title: `Image Ad ${idx + 1}`,
      url,
    }));
  }, [adStyle.imageTemplateIds, imageTemplates, selectedProductImages]);

  const videoCreative = useMemo((): ReadyCreative | null => {
    const url =
      adStyle.videoPreset?.videoUrl ||
      (adStyle.templateId ? placeholderVideoUrl : "");
    if (!url) return null;

    return {
      id: adStyle.templateId || "video",
      type: "video",
      title: adStyle.videoPreset?.title || "Video creative",
      url,
    };
  }, [
    adStyle.templateId,
    adStyle.videoPreset?.title,
    adStyle.videoPreset?.videoUrl,
  ]);

  const baseCreatives = useMemo(() => {
    if (attachedAssets.complete && attachedAssets.assets.length > 0) {
      const list = attachedAssets.assets.map(
        (a): ReadyCreative => ({
          id: a.assetId,
          type: a.type,
          title:
            a.title || (a.type === "video" ? "Saved video" : "Saved image"),
          url: a.url,
        }),
      );

      list.sort((x, y) => {
        if (x.type === y.type) return 0;
        return x.type === "video" ? -1 : 1;
      });

      return list;
    }

    const list: ReadyCreative[] = [];
    if (videoCreative) list.push(videoCreative);
    list.push(...imageCreatives);
    return list;
  }, [
    attachedAssets.assets,
    attachedAssets.complete,
    imageCreatives,
    videoCreative,
  ]);

  const creatives = useMemo(() => {
    return [...baseCreatives, ...regeneratedCreatives];
  }, [baseCreatives, regeneratedCreatives]);

  useEffect(() => {
    if (activeIndex >= creatives.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, creatives.length]);

  const activeCreative = creatives[activeIndex] || null;

  const activeCreativeDisplayUrl = useMemo(() => {
    if (!activeCreative) return "";
    const generated = generatedAssetByCreativeId[activeCreative.id];
    return generated?.url || activeCreative.url;
  }, [activeCreative?.id, activeCreative?.url, generatedAssetByCreativeId]);

  const activeCreativeIsPending = useMemo(() => {
    if (!activeCreative) return false;
    return generatedAssetByCreativeId[activeCreative.id]?.status === "pending";
  }, [activeCreative?.id, generatedAssetByCreativeId]);

  const buildDefaultCopy = (c: ReadyCreative | null): AdCopy => {
    const fallbackBrand =
      (product as any)?.brandName || campaignSnapshots?.campaignName || "";
    const website =
      campaignSnapshots?.destinationUrl || product?.onlineStorePreviewUrl || "";
    const title = product?.title || "";
    const desc = product?.description || "";

    const baseHeadline = title ? `Introducing ${title}` : "New arrival";
    const baseBody = desc
      ? clamp(desc.replace(/\s+/g, " ").trim(), 220)
      : title
        ? `Discover ${title} and shop today.`
        : "Discover and shop today.";

    const script = title
      ? `Hook: Meet ${title}.\n\nProblem: You want something that stands out.\n\nSolution: ${title} delivers style and confidence.\n\nCTA: Tap to shop now.`
      : `Hook: Meet our latest drop.\n\nProblem: You want something that stands out.\n\nSolution: Designed to fit your lifestyle.\n\nCTA: Tap to shop now.`;

    return {
      headline: baseHeadline,
      bodyCopy: baseBody,
      callToAction: "Shop now",
      brandName: fallbackBrand,
      websiteUrl: website,
      videoScript: c?.type === "video" ? script : "",
    };
  };

  const generateVariantCopy = (c: ReadyCreative | null): AdCopy => {
    const defaults = buildDefaultCopy(c);
    const title = product?.title || "";
    const hooks = title
      ? [
          `Don’t miss ${title}`,
          `New: ${title}`,
          `${title} just dropped`,
          `Level up with ${title}`,
        ]
      : ["New drop", "Limited time", "Just launched", "Don’t miss this"];
    const ctas = ["Shop now", "Learn more", "Get yours", "Buy now"];
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]!;

    const headline = pick(hooks);
    const callToAction = pick(ctas);

    const bodyCopy = title
      ? `${title} is here. Designed to turn heads—tap to see details.`
      : `Designed to turn heads—tap to see details.`;

    const videoScript =
      c?.type === "video"
        ? `0–2s: Big hook text: “${headline}”\n2–7s: Show product close-ups + key benefit\n7–12s: Lifestyle shot + social proof\n12–15s: CTA on screen: “${callToAction}”\nWebsite: ${defaults.websiteUrl}`
        : defaults.videoScript;

    return {
      ...defaults,
      headline,
      bodyCopy,
      callToAction,
      videoScript,
    };
  };

  const [adCopyById, setAdCopyById] = useState<Record<string, AdCopy>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AD_COPY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setAdCopyById(parsed);
      }
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    const c = activeCreative;
    if (!c) return;
    const key = creativeKey(c);
    if (adCopyById[key]) return;
    setAdCopyById((prev) => ({
      ...prev,
      [key]: buildDefaultCopy(c),
    }));
  }, [activeCreative?.id, activeCreative?.type, adCopyById]);

  useEffect(() => {
    const presets = Array.isArray(adStyle.imagePresets)
      ? adStyle.imagePresets
      : [];
    if (presets.length === 0) return;

    const relevantCreatives = imageCreatives
      .filter((c) => c.type === "image")
      .filter((c) => presets.some((p) => p.id === c.id))
      .slice(0, 5);

    if (relevantCreatives.length === 0) return;

    setAdCopyById((prev) => {
      const next = { ...prev };
      for (const c of relevantCreatives) {
        const key = creativeKey(c);
        if (!next[key]) {
          next[key] = buildDefaultCopy(c);
        }
      }
      return next;
    });
  }, [adStyle.imagePresets, imageCreatives]);

  useEffect(() => {
    const presets = Array.isArray(adStyle.imagePresets)
      ? adStyle.imagePresets
      : [];
    if (presets.length === 0) return;

    const relevantCreatives = imageCreatives
      .filter((c) => c.type === "image")
      .filter((c) => presets.some((p) => p.id === c.id))
      .slice(0, 5);

    if (relevantCreatives.length === 0) return;

    setAdCopyById((prev) => {
      const next = { ...prev };
      for (const c of relevantCreatives) {
        const key = creativeKey(c);
        if (!next[key]) {
          next[key] = generateVariantCopy(c);
        }
      }
      return next;
    });

    setCopyGeneratedByCreativeId((prev) => {
      const next = { ...prev };
      for (const c of relevantCreatives) {
        if (!next[c.id]) next[c.id] = true;
      }
      return next;
    });
  }, [adStyle.imagePresets, imageCreatives]);

  useEffect(() => {
    if (!token) return;

    const assetIdsByPresetId =
      adStyle.imageAssetIdsByPresetId &&
      typeof adStyle.imageAssetIdsByPresetId === "object"
        ? adStyle.imageAssetIdsByPresetId
        : {};

    const entries = Object.entries(assetIdsByPresetId) as [string, string][];
    if (entries.length === 0) return;

    for (const [presetId, assetId] of entries) {
      if (!assetId) {
        setGeneratedAssetByCreativeId((prev) => ({
          ...prev,
          [presetId]: {
            assetId: "",
            status: "failed",
            error: "Missing generation job for this image.",
          },
        }));
        setToast({
          type: "error",
          title: "Image generation failed",
          message:
            "We couldn't start generating one or more images. Please go back and try again.",
        });
        continue;
      }

      if (generationAbortControllersRef.current[presetId]) continue;

      const controller = new AbortController();
      generationAbortControllersRef.current[presetId] = controller;

      setGeneratedAssetByCreativeId((prev) => ({
        ...prev,
        [presetId]: { assetId, status: "pending" },
      }));

      (async () => {
        try {
          const asset = await pollAssetUntilDone({
            assetId,
            signal: controller.signal,
          });

          const finalUrl = asset.mediaUrl || asset.url;
          if (asset.status === "completed" && finalUrl) {
            setGeneratedAssetByCreativeId((prev) => ({
              ...prev,
              [presetId]: { assetId, status: "completed", url: finalUrl },
            }));
            return;
          }

          setGeneratedAssetByCreativeId((prev) => ({
            ...prev,
            [presetId]: {
              assetId,
              status: "failed",
              error: "Image generation failed.",
            },
          }));
          setToast({
            type: "error",
            title: "Image generation failed",
            message:
              "We couldn't generate an image right now. Please try again.",
          });
        } catch (e: any) {
          if (controller.signal.aborted) return;
          const msg =
            typeof e?.message === "string" && e.message.trim().length > 0
              ? e.message
              : "We couldn't generate an image right now. Please try again.";
          setToast({
            type: "error",
            title: "Image generation failed",
            message: msg,
          });
          setGeneratedAssetByCreativeId((prev) => ({
            ...prev,
            [presetId]: { assetId, status: "failed", error: msg },
          }));
        } finally {
          delete generationAbortControllersRef.current[presetId];
        }
      })();
    }
  }, [token, adStyle.imageAssetIdsByPresetId]);

  useEffect(() => {
    return () => {
      const controllers = generationAbortControllersRef.current;
      for (const key of Object.keys(controllers)) {
        controllers[key]?.abort();
        delete controllers[key];
      }
    };
  }, []);

  const activeAdCopy = useMemo(() => {
    if (!activeCreative) return null;
    const key = creativeKey(activeCreative);
    return adCopyById[key] || buildDefaultCopy(activeCreative);
  }, [activeCreative?.id, activeCreative?.type, adCopyById]);

  const updateActiveAdCopy = (patch: Partial<AdCopy>) => {
    if (!activeCreative) return;
    const key = creativeKey(activeCreative);
    setAdCopyById((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || buildDefaultCopy(activeCreative)),
        ...patch,
      },
    }));

    if (activeCreative.type === "image") {
      setCopyGeneratedByCreativeId((prev) => ({
        ...prev,
        [activeCreative.id]: true,
      }));
    }
  };

  const persistAdCopy = () => {
    try {
      localStorage.setItem(AD_COPY_STORAGE_KEY, JSON.stringify(adCopyById));
      setToast({
        type: "success",
        title: "Saved",
        message: "Ad copy saved.",
      });
    } catch {
      setToast({
        type: "error",
        title: "Save failed",
        message: "Could not save ad copy.",
      });
    }
  };

  const regenerateActiveCreative = () => {
    if (!activeCreative) return;

    const key = creativeKey(activeCreative);
    const currentCopy = adCopyById[key] || buildDefaultCopy(activeCreative);

    const nextCopy = generateVariantCopy(activeCreative);

    const regenId = `${activeCreative.id}-regen-${Date.now()}`;
    const regen: ReadyCreative =
      activeCreative.type === "image"
        ? {
            id: regenId,
            type: "image",
            title: `${activeCreative.title} (Regenerated)`,
            url: svgDataUrl(
              buildImageCreativeSvg({
                baseImageUrl: activeCreativeDisplayUrl,
                copy: { ...currentCopy, ...nextCopy },
              }),
            ),
          }
        : {
            id: regenId,
            type: "video",
            title: `${activeCreative.title} (Regenerated)`,
            url: activeCreative.url,
          };

    const regenKey = creativeKey(regen);
    const mergedCopy: AdCopy = {
      ...currentCopy,
      ...nextCopy,
      // ensure video script is kept for video
      videoScript:
        regen.type === "video"
          ? nextCopy.videoScript || currentCopy.videoScript || ""
          : "",
    };

    setRegeneratedCreatives((prev) => [regen, ...prev]);
    setAdCopyById((prev) => ({
      ...prev,
      [regenKey]: mergedCopy,
    }));

    // Switch to the new creative (it will be appended after base creatives).
    setActiveIndex(baseCreatives.length);

    setToast({
      type: "success",
      title: "Regenerated",
      message:
        regen.type === "video"
          ? "Created a regenerated video variant (preview uses the same video URL in frontend-only mode)."
          : "Created a regenerated image variant.",
    });

    if (activeCreative.type === "image") {
      setCopyGeneratedByCreativeId((prev) => ({
        ...prev,
        [activeCreative.id]: true,
      }));
    }
  };

  const hasAssetGenerationErrors = useMemo(() => {
    const presets = Array.isArray(adStyle.imagePresets)
      ? adStyle.imagePresets
      : [];
    if (presets.length === 0) return false;
    const relevantIds = presets.map((p) => p.id).slice(0, 5);
    return relevantIds.some(
      (id) => generatedAssetByCreativeId[id]?.status === "failed",
    );
  }, [adStyle.imagePresets, generatedAssetByCreativeId]);

  const productImages = useMemo(() => {
    const edges = product?.media?.edges || [];
    const urls = edges
      .filter((e) => {
        const type = (e?.node?.mediaContentType || "").toString().toUpperCase();
        return type === "IMAGE";
      })
      .map((e) => e?.node?.preview?.image?.url)
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0);

    return Array.from(new Set(urls)).slice(0, 4);
  }, [product?.media?.edges]);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const description = product?.description || "";
  const truncatedDescription =
    description.length > 160 ? `${description.slice(0, 160)}…` : description;

  const canNavigate = creatives.length > 1;

  const goPrev = () => {
    if (!canNavigate) return;
    setActiveIndex((prev) => (prev - 1 + creatives.length) % creatives.length);
  };

  const goNext = () => {
    if (!canNavigate) return;
    setActiveIndex((prev) => (prev + 1) % creatives.length);
  };

  const handleSaveAds = async () => {
    const product = productSelection.products?.[0]?.node;
    const productId = product?.id;
    const productName = product?.title;

    if (!productId) {
      setToast({
        type: "error",
        title: "Missing product",
        message: "Select a product before saving ads.",
      });
      return;
    }

    if (creatives.length === 0) return;
    setIsSaving(true);
    try {
      const destinationUrl = campaignSnapshots.destinationUrl;
      const campaignName = campaignSnapshots.campaignName;
      const platform: AssetPlatform = "Other";

      for (const c of creatives) {
        const key = creativeKey(c);
        const copy = adCopyById[key] || buildDefaultCopy(c);
        const promptUsed =
          c.type === "video"
            ? `CTA: ${copy.callToAction}\nBrand: ${copy.brandName}\nWebsite: ${copy.websiteUrl}\n\nVideo Script:\n${copy.videoScript}`
            : `CTA: ${copy.callToAction}\nBrand: ${copy.brandName}\nWebsite: ${copy.websiteUrl}`;

        if (c.type === "video") {
          const format: AssetFormat = "Video";
          assetActions.upsertAsset({
            type: "video",
            source: "generated",
            storageUrl: c.url,
            thumbnailUrl: adStyle.videoPreset?.thumbnailImageUrl,
            productId,
            productName,
            campaignName,
            destinationUrl,
            platform,
            format,
            headlineUsed: copy.headline,
            descriptionUsed: copy.bodyCopy,
            promptUsed,
          });
          continue;
        }

        const format: AssetFormat = "Image";
        assetActions.upsertAsset({
          type: "image",
          source: "generated",
          url: c.url,
          productId,
          productName,
          campaignName,
          destinationUrl,
          platform,
          format,
          headlineUsed: copy.headline,
          descriptionUsed: copy.bodyCopy,
          promptUsed,
        });
      }

      setToast({
        type: "success",
        title: "Saved",
        message: `Saved ${creatives.length} ad${creatives.length === 1 ? "" : "s"} to Saved Ads.`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = videoMuted;
  }, [videoMuted]);

  const durationLabel = formatDuration(videoDuration);

  return (
    <div className="min-h-[calc(100vh-160px)] mt-10 pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-8 items-start">
        <div className="bg-[#F3F4F6] rounded-3xl custom-shadow-sm p-6 lg:sticky lg:top-24">
          <button
            className="w-10 h-10 rounded-2xl bg-[#F3EFF6] flex items-center justify-center"
            onClick={() => setIsBackModalOpen(true)}
          >
            <ArrowLeft size={18} color="#111" />
          </button>

          <div className="text-heading mt-8">
            <div className="text-[34px] leading-[40px] font-bold tracking-800">
              YOUR CREATIVE
              <br />
              IS READY
            </div>
            <p className="mt-3 text-sm text-neutral-light tracking-40 max-w-[320px]">
              Review your cloned creative. You can reuse it, edit inputs, or
              launch a campaign.
            </p>
          </div>

          <div className="mt-8">
            <div className="text-sm font-medium tracking-100 text-heading">
              Product details
            </div>

            <div className="mt-4 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-4">
              <div className="text-sm font-semibold text-heading">
                {product?.title || "Product"}
              </div>

              {description ? (
                <div className="mt-2 text-xs text-neutral-light leading-5">
                  {showFullDescription ? description : truncatedDescription}{" "}
                  {description.length > 160 && (
                    <button
                      className="text-purple-600 font-medium"
                      onClick={() => setShowFullDescription((p) => !p)}
                    >
                      {showFullDescription ? "Read less" : "Read more"}
                    </button>
                  )}
                </div>
              ) : null}

              {productImages.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {productImages.map((src) => (
                    <div
                      key={src}
                      className="w-12 h-12 rounded-xl overflow-hidden border border-[rgba(0,0,0,0.06)] bg-[#FBFAFC]"
                    >
                      <Image
                        src={src}
                        alt="Product"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] text-neutral-light">Source</div>
                  <div className="text-xs font-medium text-heading">
                    Cloned from template
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-light">
                    Creative type
                  </div>
                  <div className="text-xs font-medium text-heading">
                    {activeCreative?.type === "video" ? "Video" : "Image"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FBFAFC] md:bg-white rounded-3xl custom-shadow-sm p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-heading text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span>Preview</span>
            </div>

            {creatives.length > 1 && (
              <div className="text-xs text-neutral-light">
                {activeIndex + 1} / {creatives.length}
              </div>
            )}
          </div>

          <div className="mt-5 flex-1 flex flex-col">
            <div className="w-full max-w-[460px] mx-auto">
              <div className="relative rounded-3xl overflow-hidden aspect-[9/16] bg-[#1b1b1b]">
                {activeCreative?.type === "video" ? (
                  <>
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      controls
                      playsInline
                      muted={videoMuted}
                      preload="metadata"
                      src={activeCreative.url}
                      poster={adStyle.videoPreset?.thumbnailImageUrl}
                      onLoadedMetadata={(e) => {
                        const d = (e.currentTarget as HTMLVideoElement)
                          .duration;
                        if (Number.isFinite(d)) setVideoDuration(d);
                      }}
                      onEnded={() => {
                        if (canNavigate) goNext();
                      }}
                    />
                    <button
                      className="absolute top-3 left-3 h-9 px-3 rounded-2xl bg-[rgba(0,0,0,0.45)] text-white text-xs font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        setVideoMuted((p) => !p);
                      }}
                    >
                      {videoMuted ? "Unmute" : "Mute"}
                    </button>
                    {durationLabel && (
                      <div className="absolute top-3 right-3 h-9 px-3 rounded-2xl bg-[rgba(0,0,0,0.45)] text-white text-xs font-medium flex items-center">
                        {durationLabel}
                      </div>
                    )}
                  </>
                ) : activeCreative?.type === "image" ? (
                  <button
                    className="absolute inset-0"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsZoomOpen(true);
                    }}
                  >
                    {activeCreativeIsPending ? (
                      <LoaderFrame />
                    ) : (
                      <Image
                        src={activeCreativeDisplayUrl}
                        alt={activeCreative.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 720px"
                        className="absolute inset-0 w-full h-full object-contain bg-[#111]"
                      />
                    )}
                  </button>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-[rgba(255,255,255,0.70)]">
                    No preview available
                  </div>
                )}
              </div>

              {activeCreative?.type === "image" && (
                <>
                  {generatedAssetByCreativeId[activeCreative.id]?.status ===
                  "pending" ? (
                    <div className="mt-3 text-xs text-neutral-light">
                      Generating image…
                    </div>
                  ) : null}

                  {generatedAssetByCreativeId[activeCreative.id]?.status ===
                    "failed" &&
                  generatedAssetByCreativeId[activeCreative.id]?.error ? (
                    <div className="mt-3 text-xs text-red-600">
                      {generatedAssetByCreativeId[activeCreative.id]?.error}
                    </div>
                  ) : null}
                </>
              )}

              {activeCreative && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm font-medium text-heading">
                    {activeCreative.title}
                  </div>

                  {canNavigate && (
                    <div className="flex items-center gap-2">
                      <button
                        className="w-9 h-9 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white flex items-center justify-center"
                        onClick={(e) => {
                          e.preventDefault();
                          goPrev();
                        }}
                      >
                        <ArrowForward
                          size={16}
                          color="#111"
                          className="-scale-x-100"
                        />
                      </button>
                      <button
                        className="w-9 h-9 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white flex items-center justify-center"
                        onClick={(e) => {
                          e.preventDefault();
                          goNext();
                        }}
                      >
                        <ArrowForward size={16} color="#111" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {creatives.length > 1 && (
                <div className="mt-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {creatives.map((c, i) => {
                      const isActive = i === activeIndex;
                      const thumbAsset =
                        c.type === "image"
                          ? generatedAssetByCreativeId[c.id]
                          : null;
                      const thumbPending = thumbAsset?.status === "pending";
                      const thumbSrc =
                        c.type === "video"
                          ? adStyle.videoPreset?.thumbnailImageUrl
                          : thumbAsset?.url || c.url;
                      return (
                        <button
                          key={creativeKey(c)}
                          className={`relative flex-shrink-0 w-[72px] h-[72px] rounded-2xl overflow-hidden border ${
                            isActive
                              ? "border-purple-600 ring-2 ring-purple-600"
                              : "border-[rgba(0,0,0,0.08)]"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveIndex(i);
                          }}
                        >
                          {thumbPending ? (
                            <div className="w-full h-full bg-[#111] flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : thumbSrc ? (
                            <Image
                              src={thumbSrc}
                              alt={c.title}
                              width={72}
                              height={72}
                              unoptimized
                              className={`w-full h-full object-cover ${
                                c.type === "video" ? "brightness-75" : ""
                              }`}
                            />
                          ) : (
                            <div className="w-full h-full bg-[#111]" />
                          )}
                          {c.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-[rgba(0,0,0,0.55)] text-white text-xs flex items-center justify-center">
                                ▶
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 w-full max-w-[740px] mx-auto">
              <div className="rounded-3xl border border-[rgba(0,0,0,0.06)] bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-heading text-sm font-semibold tracking-100">
                    Ad Copy
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[120px]">
                      <Button
                        text="Save"
                        secondary
                        action={() => persistAdCopy()}
                      />
                    </div>
                    <div className="w-[150px]">
                      <Button
                        text="Regenerate"
                        action={() => regenerateActiveCreative()}
                        hasIconOrLoader
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCreative?.type === "video" ? (
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <label className="text-xs text-neutral-light">
                        Video Script
                      </label>
                      <textarea
                        className="min-h-[200px] text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full p-4 block font-medium focus:outline-none resize-none"
                        value={activeAdCopy?.videoScript || ""}
                        onChange={(e) =>
                          updateActiveAdCopy({ videoScript: e.target.value })
                        }
                        placeholder="Write your video script"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-neutral-light">
                          Headline
                        </label>
                        <input
                          className="h-[48px] text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full px-4 block font-medium focus:outline-none"
                          value={activeAdCopy?.headline || ""}
                          onChange={(e) =>
                            updateActiveAdCopy({ headline: e.target.value })
                          }
                          placeholder="Enter headline"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-neutral-light">
                          Call to Action
                        </label>
                        <input
                          className="h-[48px] text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full px-4 block font-medium focus:outline-none"
                          value={activeAdCopy?.callToAction || ""}
                          onChange={(e) =>
                            updateActiveAdCopy({ callToAction: e.target.value })
                          }
                          placeholder="Shop now"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-neutral-light">
                          Brand Name
                        </label>
                        <input
                          className="h-[48px] text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full px-4 block font-medium focus:outline-none"
                          value={activeAdCopy?.brandName || ""}
                          onChange={(e) =>
                            updateActiveAdCopy({ brandName: e.target.value })
                          }
                          placeholder="Your brand"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-neutral-light">
                          Website URL
                        </label>
                        <input
                          className="h-[48px] text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full px-4 block font-medium focus:outline-none"
                          value={activeAdCopy?.websiteUrl || ""}
                          onChange={(e) =>
                            updateActiveAdCopy({ websiteUrl: e.target.value })
                          }
                          placeholder="https://yourstore.com"
                        />
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-xs text-neutral-light">
                          Body Copy
                        </label>
                        <textarea
                          className="min-h-[110px] text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full p-4 block font-medium focus:outline-none resize-none"
                          value={activeAdCopy?.bodyCopy || ""}
                          onChange={(e) =>
                            updateActiveAdCopy({ bodyCopy: e.target.value })
                          }
                          placeholder="Enter body copy"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="w-full max-w-[560px] grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  text={isSaving ? "Saving…" : "Save Ads"}
                  secondary
                  action={() => {
                    if (!isSaving) void handleSaveAds();
                  }}
                  disabled={isSaving}
                />
                <Button
                  text="Continue"
                  action={() => {
                    if (hasAssetGenerationErrors) {
                      setToast({
                        type: "error",
                        title: "Fix errors before continuing",
                        message:
                          "One or more creatives failed to generate. Please retry before moving on.",
                      });
                      return;
                    }
                    router.push("/create-campaign/campaign-snapshots");
                  }}
                  hasIconOrLoader
                  disabled={hasAssetGenerationErrors}
                />
                <Button
                  text="Create another"
                  secondary
                  action={() => router.push("/create-campaign/choose-ad-style")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isBackModalOpen && (
        <div>
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-20"
            onClick={() => setIsBackModalOpen(false)}
          />
          <div className="bg-white fixed top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] w-[92vw] max-w-[520px] z-30 rounded-3xl p-6">
            <div className="text-heading text-lg font-semibold">
              Leave this page?
            </div>
            <div className="mt-2 text-sm text-neutral-light">
              You’ll return to template selection.
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <div className="w-[140px]">
                <Button
                  text="Cancel"
                  secondary
                  action={() => setIsBackModalOpen(false)}
                />
              </div>
              <div className="w-[160px]">
                <Button
                  text="Go back"
                  action={() => router.push("/create-campaign/choose-ad-style")}
                  hasIconOrLoader
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isZoomOpen && activeCreative?.type === "image" && (
        <div>
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.75)] z-20"
            onClick={() => setIsZoomOpen(false)}
          />
          <div className="fixed inset-0 z-30 p-6 flex items-center justify-center">
            <div className="max-w-[720px] w-full">
              <div className="relative rounded-3xl overflow-hidden bg-[#111]">
                <Image
                  src={activeCreative.url}
                  alt={activeCreative.title}
                  width={720}
                  height={1280}
                  unoptimized
                  className="w-full h-full object-contain max-h-[80vh]"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <div className="w-[140px]">
                  <Button
                    text="Close"
                    secondary
                    action={() => setIsZoomOpen(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
