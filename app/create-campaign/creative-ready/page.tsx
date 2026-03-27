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
  regenerateImageAsset,
  generateVideoAsset,
  getAssetById,
  type Asset,
} from "@/app/lib/api/base/assets";
import { createSavedAd } from "@/app/lib/api/base/saved-ads";
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
  caption: string;
  callToAction: string;
  brandName: string;
  websiteUrl: string;
  videoScript: string;
};

const AD_COPY_STORAGE_KEY = "creative-ready.ad-copy.v1";
const REGENERATED_CREATIVES_STORAGE_KEY =
  "creative-ready.regenerated-creatives.v1";
const GENERATED_ASSETS_STORAGE_KEY = "creative-ready.generated-assets.v1";

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

function sleepWithAbort(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error("Polling aborted"));
      return;
    }

    let id: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      if (id) clearTimeout(id);
      signal.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      cleanup();
      reject(new Error("Polling aborted"));
    };

    signal.addEventListener("abort", onAbort);

    id = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);
  });
}

export default function CreativeReadyPage() {
  const router = useRouter();
  const setToast = useToastStore((s) => s.setToast);
  const token = useAuthStore((s) => s.token);

  const { productSelection, adStyle } = useCreateCampaignStore((s) => s);
  const { campaignSnapshots } = useCreateCampaignStore((s) => s);
  const attachedAssets = useCreateCampaignStore((s) => s.attachedAssets);
  const attachAssetsToDraft = useCreateCampaignStore(
    (s) => s.actions.attachAssetsToDraft,
  );
  const storeAdStyle = useCreateCampaignStore((s) => s.actions.storeAdStyle);

  const product = productSelection.products?.[0]?.node;

  const productImageUrl = useMemo(() => {
    const edges = product?.media?.edges || [];
    const url = edges
      .map((e) => e?.node?.preview?.image?.url)
      .find((u): u is string => typeof u === "string" && u.trim().length > 0);
    return url;
  }, [product?.media?.edges]);

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
        type?: "video" | "image";
        status: "pending" | "completed" | "failed";
        url?: string;
        error?: string;
      }
    >
  >({});

  useEffect(() => {
    try {
      const rawCreatives = localStorage.getItem(
        REGENERATED_CREATIVES_STORAGE_KEY,
      );
      if (rawCreatives) {
        const parsed = JSON.parse(rawCreatives);
        if (Array.isArray(parsed)) {
          const next = parsed
            .filter(
              (c: any) =>
                c &&
                typeof c.id === "string" &&
                (c.type === "image" || c.type === "video") &&
                typeof c.title === "string" &&
                typeof c.url === "string",
            )
            .map(
              (c: any): ReadyCreative => ({
                id: c.id,
                type: c.type,
                title: c.title,
                url: c.url,
              }),
            );
          if (next.length > 0) {
            setRegeneratedCreatives(next);
          }
        }
      }
    } catch {
      // ignore
    }

    try {
      const rawAssets = localStorage.getItem(GENERATED_ASSETS_STORAGE_KEY);
      if (rawAssets) {
        const parsed = JSON.parse(rawAssets);
        if (parsed && typeof parsed === "object") {
          setGeneratedAssetByCreativeId((prev) => ({
            ...parsed,
            ...prev,
          }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        REGENERATED_CREATIVES_STORAGE_KEY,
        JSON.stringify(regeneratedCreatives),
      );
    } catch {
      // ignore
    }
  }, [regeneratedCreatives]);

  useEffect(() => {
    try {
      localStorage.setItem(
        GENERATED_ASSETS_STORAGE_KEY,
        JSON.stringify(generatedAssetByCreativeId),
      );
    } catch {
      // ignore
    }
  }, [generatedAssetByCreativeId]);

  const [copyGeneratedByCreativeId, setCopyGeneratedByCreativeId] = useState<
    Record<string, boolean>
  >({});

  const generationAbortControllersRef = useRef<Record<string, AbortController>>(
    {},
  );
  const videoPollingStartedRef = useRef(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoDuration, setVideoDuration] = useState<number | undefined>(
    undefined,
  );

  const [includeMusic, setIncludeMusic] = useState(true);
  const [includeVoiceOver, setIncludeVoiceOver] = useState(true);

  useEffect(() => {
    if (typeof adStyle.includeMusic === "boolean") {
      setIncludeMusic(adStyle.includeMusic);
    }
    if (typeof adStyle.includeVoiceOver === "boolean") {
      setIncludeVoiceOver(adStyle.includeVoiceOver);
    }
  }, [adStyle.includeMusic, adStyle.includeVoiceOver]);

  useModal(isBackModalOpen || isZoomOpen);

  const imageTemplates = useMemo(() => {
    return getSeededImageAdTemplates(null);
  }, []);

  const placeholderVideoUrl =
    "https://cdn.higgsfield.ai/veo3_motion/51748eea-5159-44b9-bbcb-f11a49cea887.mp4";

  const pollAssetUntilDone = async (args: {
    assetId: string;
    signal: AbortSignal;
  }): Promise<Asset> => {
    const startedAt = Date.now();
    const timeoutMs = 10 * 60 * 1000;
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

    if (ids.length === 0) return [];

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
      .map((id, idx) => {
        const t = imageTemplates.find((x) => x.id === id);
        const fallbackTemplate = imageTemplates[idx % imageTemplates.length];
        const url =
          t?.previewImageUrl || fallbackTemplate?.previewImageUrl || "";
        return {
          id,
          type: "image" as const,
          title: t?.name || fallbackTemplate?.name || `Image Ad ${idx + 1}`,
          url,
        };
      })
      .filter((c) => typeof c.url === "string" && c.url.trim().length > 0);

    if (fromTemplates.length > 0) return fromTemplates;

    return [];
  }, [adStyle.imageTemplateIds, imageTemplates]);

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
      caption: "",
      callToAction: "Shop now",
      brandName: fallbackBrand,
      websiteUrl: website,
      videoScript: c?.type === "video" ? script : "",
    };
  };

  const parseGeneratedImageCopy = (raw: string) => {
    const text = (raw || "").toString();
    const headlineMatch = text.match(/Headline:\s*([\s\S]*?)(?:\n+Body:|$)/i);
    const bodyMatch = text.match(/Body:\s*([\s\S]*?)(?:\n+CTA:|$)/i);
    const ctaMatch = text.match(/CTA:\s*([\s\S]*)$/i);
    const headline = (headlineMatch?.[1] || "").trim();
    const bodyCopy = (bodyMatch?.[1] || "").trim();
    const callToAction = (ctaMatch?.[1] || "").trim();
    return { headline, bodyCopy, callToAction };
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

    const seededCaption =
      c.type === "video"
        ? adStyle.videoCaption || ""
        : (adStyle.imageCaptionsByPresetId || {})[c.id] || "";

    const seededImageCopyRaw =
      c.type === "image"
        ? (adStyle as any)?.imageCopyByPresetId?.[c.id] || ""
        : "";
    const seededImageCopy =
      c.type === "image" ? parseGeneratedImageCopy(seededImageCopyRaw) : null;

    setAdCopyById((prev) => ({
      ...prev,
      [key]: (() => {
        const base = buildDefaultCopy(c);
        const existing = prev[key] || null;

        const seededVideoScript =
          c.type === "video" ? adStyle.videoScript || "" : "";

        const seededImagePatch =
          c.type === "image"
            ? {
                headline: seededImageCopy?.headline || "",
                bodyCopy: seededImageCopy?.bodyCopy || "",
                callToAction: seededImageCopy?.callToAction || "",
              }
            : null;

        return {
          ...base,
          ...(existing || {}),
          ...(seededImagePatch
            ? {
                ...(seededImagePatch.headline
                  ? { headline: seededImagePatch.headline }
                  : null),
                ...(seededImagePatch.bodyCopy
                  ? { bodyCopy: seededImagePatch.bodyCopy }
                  : null),
                ...(seededImagePatch.callToAction
                  ? { callToAction: seededImagePatch.callToAction }
                  : null),
              }
            : null),
          ...(seededCaption ? { caption: seededCaption } : null),
          ...(seededVideoScript ? { videoScript: seededVideoScript } : null),
        };
      })(),
    }));
  }, [
    activeCreative?.id,
    activeCreative?.type,
    adStyle.videoCaption,
    adStyle.videoScript,
    adStyle.imageCaptionsByPresetId,
    (adStyle as any)?.imageCopyByPresetId,
  ]);

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
          const seededCaption =
            (adStyle.imageCaptionsByPresetId || {})[c.id] || "";
          next[key] = {
            ...buildDefaultCopy(c),
            caption: seededCaption,
          };
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
        [presetId]: { assetId, type: "image", status: "pending" },
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
              [presetId]: {
                assetId,
                type: "image",
                status: "completed",
                url: finalUrl,
              },
            }));
            return;
          }

          setGeneratedAssetByCreativeId((prev) => ({
            ...prev,
            [presetId]: {
              assetId,
              type: "image",
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
            [presetId]: {
              assetId,
              type: "image",
              status: "failed",
              error: msg,
            },
          }));
        } finally {
          delete generationAbortControllersRef.current[presetId];
        }
      })();
    }
  }, [token, adStyle.imageAssetIdsByPresetId]);

  useEffect(() => {
    if (!token) return;
    if (!adStyle.videoAssetId) return;
    if (videoPollingStartedRef.current) return;

    videoPollingStartedRef.current = true;

    const videoKey = adStyle.templateId || "video";
    const assetId = adStyle.videoAssetId;

    const controller = new AbortController();
    generationAbortControllersRef.current[videoKey] = controller;

    setGeneratedAssetByCreativeId((prev) => ({
      ...prev,
      [videoKey]: { assetId, type: "video", status: "pending" },
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
            [videoKey]: {
              assetId,
              type: "video",
              status: "completed",
              url: finalUrl,
            },
          }));
          return;
        }

        setGeneratedAssetByCreativeId((prev) => ({
          ...prev,
          [videoKey]: {
            assetId,
            type: "video",
            status: "failed",
            error: "Video generation failed.",
          },
        }));
        setToast({
          type: "error",
          title: "Video generation failed",
          message: "We couldn't generate a video right now. Please try again.",
        });
      } catch (e: any) {
        if (controller.signal.aborted) return;
        const msg =
          typeof e?.message === "string" && e.message.trim().length > 0
            ? e.message
            : "We couldn't generate a video right now. Please try again.";
        setToast({
          type: "error",
          title: "Video generation failed",
          message: msg,
        });
        setGeneratedAssetByCreativeId((prev) => ({
          ...prev,
          [videoKey]: { assetId, type: "video", status: "failed", error: msg },
        }));
      } finally {
        delete generationAbortControllersRef.current[videoKey];
      }
    })();
  }, [token, adStyle.videoAssetId, adStyle.templateId]);

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

  const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);

  const saveActiveCreativeToLibrary = async () => {
    if (!activeCreative) return;
    if (!token) {
      setToast({
        type: "error",
        title: "Missing login",
        message: "Please log in again to save this ad.",
      });
      return;
    }

    const key = creativeKey(activeCreative);
    const currentCopy = adCopyById[key] || buildDefaultCopy(activeCreative);

    const entry = generatedAssetByCreativeId[activeCreative.id];
    const completedAssetId =
      entry && entry.status === "completed" ? entry.assetId : "";

    const looksLikeMongoId = /^[a-f0-9]{24}$/i.test(activeCreative.id);
    const assetIdToSave =
      completedAssetId || (looksLikeMongoId ? activeCreative.id : "");

    if (!assetIdToSave) {
      setToast({
        type: "error",
        title: "Asset not ready",
        message:
          "Please wait for the creative to finish generating before saving.",
      });
      return;
    }

    try {
      setIsSavingToLibrary(true);
      await createSavedAd({
        token,
        dto: {
          assetId: assetIdToSave,
          productId: product?.id || undefined,
          productTitle: product?.title || undefined,
          productHandle: product?.handle || undefined,
          productType: product?.productType || undefined,
          productCategory: product?.category?.fullName || undefined,
          productTags: Array.isArray(product?.tags) ? product?.tags : undefined,
          productImageUrl,
          headline: currentCopy.headline,
          bodyCopy: currentCopy.bodyCopy,
          cta: currentCopy.callToAction,
          caption: currentCopy.caption,
          script: currentCopy.videoScript,
          brandName: currentCopy.brandName,
          websiteUrl: currentCopy.websiteUrl,
        },
      });

      setToast({
        type: "success",
        title: "Saved",
        message: "Saved to Saved Ads.",
      });
    } catch (e: any) {
      const msg =
        typeof e?.response?.data?.message === "string"
          ? e.response.data.message
          : typeof e?.message === "string" && e.message.trim().length > 0
            ? e.message
            : "Could not save this ad right now.";
      setToast({
        type: "error",
        title: "Save failed",
        message: msg,
      });
    } finally {
      setIsSavingToLibrary(false);
    }
  };

  const regenerateActiveCreative = () => {
    if (!activeCreative) return;

    if (activeCreative.type === "video") {
      if (!token) {
        setToast({
          type: "error",
          title: "Missing login",
          message: "Please log in again to regenerate your video.",
        });
        return;
      }

      const videoPresetId = adStyle.templateId;
      if (!videoPresetId) {
        setToast({
          type: "error",
          title: "Missing template",
          message: "Please select a video style before regenerating.",
        });
        return;
      }

      const productId = product?.id || "";
      const productName = product?.title || "";
      const productDescription =
        product?.description || (product as any)?.productType || "";

      if (!productId || !productName) {
        setToast({
          type: "error",
          title: "Missing product details",
          message:
            "Please select a product with title and description before regenerating videos.",
        });
        return;
      }

      if (productImages.length === 0) {
        setToast({
          type: "error",
          title: "Missing product images",
          message:
            "Please select a product with at least one image before regenerating videos.",
        });
        return;
      }

      const safeProductDescription =
        productDescription.trim().length > 0 ? productDescription : "—";

      const key = creativeKey(activeCreative);
      const currentCopy = adCopyById[key] || buildDefaultCopy(activeCreative);
      const script = (currentCopy.videoScript || "").trim();
      const caption = (currentCopy.caption || "").trim();

      if (includeVoiceOver && script.length === 0) {
        setToast({
          type: "error",
          title: "Missing video script",
          message:
            "Add a video script (or disable Voiceover) before regenerating.",
        });
        return;
      }

      if (!includeVoiceOver && caption.length === 0) {
        setToast({
          type: "error",
          title: "Missing caption",
          message: "Add a caption (or enable Voiceover) before regenerating.",
        });
        return;
      }

      storeAdStyle({
        includeMusic,
        includeVoiceOver,
        videoScript: script,
        videoCaption: caption,
      });

      (async () => {
        try {
          const res = await generateVideoAsset({
            token,
            dto: {
              productId,
              productName,
              productDescription: safeProductDescription,
              productImages,
              videoPresetId,
              includeMusic,
              includeVoiceOver,
              cta: undefined,
            },
          });

          const assetId = res?.data?.assetId;
          if (!assetId) {
            throw new Error("Video regeneration failed. Please try again.");
          }

          const regen: ReadyCreative = {
            id: assetId,
            type: "video",
            title: `${activeCreative.title} (Regenerated)`,
            url: activeCreative.url,
          };

          const regenKey = creativeKey(regen);
          setRegeneratedCreatives((prev) => [regen, ...prev]);
          setAdCopyById((prev) => ({
            ...prev,
            [regenKey]: {
              ...currentCopy,
              videoScript: script,
              caption,
            },
          }));

          setActiveIndex(baseCreatives.length);

          const controller = new AbortController();
          generationAbortControllersRef.current[assetId] = controller;

          setGeneratedAssetByCreativeId((prev) => ({
            ...prev,
            [assetId]: { assetId, type: "video", status: "pending" },
          }));

          setToast({
            type: "success",
            title: "Regenerating",
            message: "Generating a new video variant…",
          });
          const asset = await pollAssetUntilDone({
            assetId,
            signal: controller.signal,
          });

          const finalUrl = asset.mediaUrl || asset.url;
          if (asset.status === "completed" && finalUrl) {
            setGeneratedAssetByCreativeId((prev) => ({
              ...prev,
              [assetId]: {
                assetId,
                type: "video",
                status: "completed",
                url: finalUrl,
              },
            }));
            return;
          }

          setGeneratedAssetByCreativeId((prev) => ({
            ...prev,
            [assetId]: {
              assetId,
              type: "video",
              status: "failed",
              error: "Video generation failed.",
            },
          }));
          setToast({
            type: "error",
            title: "Video generation failed",
            message:
              "We couldn't generate a video right now. Please try again.",
          });
        } catch (e: any) {
          const msg =
            typeof e?.message === "string" && e.message.trim().length > 0
              ? e.message
              : "We couldn't generate a video right now. Please try again.";
          setToast({
            type: "error",
            title: "Video generation failed",
            message: msg,
          });
        }
      })();

      return;
    }

    if (!token) {
      setToast({
        type: "error",
        title: "Missing login",
        message: "Please log in again to regenerate your image.",
      });
      return;
    }

    const presetId = activeCreative.id;
    const baseAssetId =
      generatedAssetByCreativeId[presetId]?.assetId ||
      ((adStyle.imageAssetIdsByPresetId as any)?.[presetId] as string) ||
      "";

    if (!baseAssetId) {
      setToast({
        type: "error",
        title: "Missing generated image",
        message:
          "Please generate this image first before regenerating a variant.",
      });
      return;
    }

    const productId = product?.id || "";
    const productName = product?.title || "";
    const productDescription =
      product?.description || (product as any)?.productType || "";

    if (!productId || !productName) {
      setToast({
        type: "error",
        title: "Missing product details",
        message:
          "Please select a product with title and description before regenerating images.",
      });
      return;
    }

    const safeProductDescription =
      productDescription.trim().length > 0 ? productDescription : "—";

    const key = creativeKey(activeCreative);
    const currentCopy = adCopyById[key] || buildDefaultCopy(activeCreative);

    const headline = (currentCopy.headline || "").trim();
    const bodyCopy = (currentCopy.bodyCopy || "").trim();
    const cta = (currentCopy.callToAction || "").trim();

    if (!headline || !bodyCopy) {
      setToast({
        type: "error",
        title: "Missing ad copy",
        message:
          "Please add a headline and body copy before regenerating this image.",
      });
      return;
    }

    const regenProductImages = Array.from(
      new Set(
        [activeCreativeDisplayUrl, ...productImages]
          .filter(
            (u): u is string => typeof u === "string" && u.trim().length > 0,
          )
          .map((u) => u.trim()),
      ),
    ).slice(0, 4);

    (async () => {
      try {
        const res = await regenerateImageAsset({
          token,
          dto: {
            assetId: baseAssetId,
            productId,
            productName,
            productDescription: safeProductDescription,
            productImages: regenProductImages,
            headline,
            bodyCopy,
            cta: cta.length > 0 ? cta : undefined,
          },
        });

        const assetId = res?.data?.assetId;
        if (!assetId) {
          throw new Error("Image regeneration failed. Please try again.");
        }

        const regen: ReadyCreative = {
          id: assetId,
          type: "image",
          title: `${activeCreative.title} (Regenerated)`,
          url: activeCreativeDisplayUrl,
        };

        const regenKey = creativeKey(regen);
        setRegeneratedCreatives((prev) => [regen, ...prev]);
        setAdCopyById((prev) => ({
          ...prev,
          [regenKey]: {
            ...currentCopy,
            headline,
            bodyCopy,
            callToAction: cta,
          },
        }));

        setActiveIndex(baseCreatives.length);

        const controller = new AbortController();
        generationAbortControllersRef.current[assetId] = controller;

        setGeneratedAssetByCreativeId((prev) => ({
          ...prev,
          [assetId]: { assetId, type: "image", status: "pending" },
        }));

        setToast({
          type: "success",
          title: "Regenerating",
          message: "Generating a new image variant…",
        });
        const asset = await pollAssetUntilDone({
          assetId,
          signal: controller.signal,
        });

        const finalUrl = asset.mediaUrl || asset.url;
        if (asset.status === "completed" && finalUrl) {
          setGeneratedAssetByCreativeId((prev) => ({
            ...prev,
            [assetId]: {
              assetId,
              type: "image",
              status: "completed",
              url: finalUrl,
            },
          }));
          return;
        }

        setGeneratedAssetByCreativeId((prev) => ({
          ...prev,
          [assetId]: {
            assetId,
            type: "image",
            status: "failed",
            error: "Image generation failed.",
          },
        }));
        setToast({
          type: "error",
          title: "Image generation failed",
          message:
            "We couldn't regenerate an image right now. Please try again.",
        });
      } catch (e: any) {
        const msg =
          typeof e?.message === "string" && e.message.trim().length > 0
            ? e.message
            : "We couldn't regenerate an image right now. Please try again.";
        setToast({
          type: "error",
          title: "Image generation failed",
          message: msg,
        });
      }
    })();
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
    const selected = (campaignSnapshots as any)?.selectedProductImages;
    const primary = (campaignSnapshots as any)?.primaryProductImageUrl;
    if (Array.isArray(selected) && selected.length > 0) {
      const deduped = Array.from(
        new Set(
          selected.filter(
            (u: any): u is string =>
              typeof u === "string" && u.trim().length > 0,
          ),
        ),
      );
      if (typeof primary === "string" && primary.trim().length > 0) {
        return [primary, ...deduped.filter((u) => u !== primary)].slice(0, 4);
      }
      return deduped.slice(0, 4);
    }

    const edges = product?.media?.edges || [];
    const urls = edges
      .filter((e) => {
        const type = (e?.node?.mediaContentType || "").toString().toUpperCase();
        return type === "IMAGE";
      })
      .map((e) => e?.node?.preview?.image?.url)
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0);

    return Array.from(new Set(urls)).slice(0, 4);
  }, [campaignSnapshots, product?.media?.edges]);

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

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = videoMuted;
  }, [videoMuted]);

  const durationLabel = formatDuration(videoDuration);

  const isActiveAssetPending = useMemo(() => {
    if (!activeCreative) return false;
    if (activeCreative.type === "image") {
      return (
        generatedAssetByCreativeId[activeCreative.id]?.status === "pending"
      );
    }

    const entry = generatedAssetByCreativeId[activeCreative.id];
    const isPending = !entry || entry.status === "pending";
    return Boolean(adStyle.videoAssetId) && isPending;
  }, [activeCreative, adStyle.videoAssetId, generatedAssetByCreativeId]);

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
                  (() => {
                    const videoAssetEntry = activeCreative.id
                      ? generatedAssetByCreativeId[activeCreative.id]
                      : undefined;
                    const videoIsPending =
                      adStyle.videoAssetId &&
                      (!videoAssetEntry ||
                        videoAssetEntry.status === "pending");
                    const videoFinalUrl =
                      videoAssetEntry?.status === "completed"
                        ? videoAssetEntry.url
                        : undefined;

                    if (videoIsPending) {
                      return <LoaderFrame />;
                    }

                    if (!videoFinalUrl) {
                      return (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-[rgba(255,255,255,0.50)]">
                          No video available
                        </div>
                      );
                    }

                    return (
                      <>
                        <video
                          ref={videoRef}
                          className="absolute inset-0 w-full h-full object-cover"
                          controls
                          playsInline
                          muted={videoMuted}
                          preload="metadata"
                          src={videoFinalUrl}
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
                    );
                  })()
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

              {activeCreative?.type === "video" && adStyle.videoAssetId && (
                <>
                  {(() => {
                    const entry = generatedAssetByCreativeId[activeCreative.id];
                    const isPending = !entry || entry.status === "pending";
                    const isFailed = entry?.status === "failed";
                    if (isPending) {
                      return (
                        <div className="mt-3 text-xs text-neutral-light">
                          Generating video… this may take up to 15 minutes.
                        </div>
                      );
                    }
                    if (isFailed && entry?.error) {
                      return (
                        <div className="mt-3 text-xs text-red-600">
                          {entry.error}
                        </div>
                      );
                    }
                    return null;
                  })()}
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
                        action={() => saveActiveCreativeToLibrary()}
                        disabled={isActiveAssetPending || isSavingToLibrary}
                      />
                    </div>
                    <div className="w-[150px]">
                      <Button
                        text="Regenerate"
                        action={() => regenerateActiveCreative()}
                        hasIconOrLoader
                        disabled={isActiveAssetPending || isSavingToLibrary}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCreative?.type === "video" ? (
                    <>
                      <div className="md:col-span-2 flex gap-12">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div
                            onClick={() => {
                              const next = !includeMusic;
                              setIncludeMusic(next);
                              storeAdStyle({ includeMusic: next });
                            }}
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
                          <span className="text-sm text-heading">
                            Include Music
                          </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <div
                            onClick={() => {
                              const next = !includeVoiceOver;
                              setIncludeVoiceOver(next);
                              storeAdStyle({ includeVoiceOver: next });
                            }}
                            className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                              includeVoiceOver
                                ? "bg-purple-600"
                                : "bg-[#D1D5DB]"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                includeVoiceOver
                                  ? "translate-x-4"
                                  : "translate-x-0"
                              }`}
                            />
                          </div>
                          <span className="text-sm text-heading">
                            Include Voiceover
                          </span>
                        </label>
                      </div>

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
                          disabled={!includeVoiceOver}
                        />
                      </div>
                      <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-xs text-neutral-light">
                          Caption
                        </label>
                        <textarea
                          className="min-h-[110px] text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full p-4 block font-medium focus:outline-none resize-none"
                          value={activeAdCopy?.caption || ""}
                          onChange={(e) =>
                            updateActiveAdCopy({ caption: e.target.value })
                          }
                          placeholder="Write your caption"
                        />
                      </div>
                    </>
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

                      <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-xs text-neutral-light">
                          Caption
                        </label>
                        <textarea
                          className="min-h-[110px] text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full p-4 block font-medium focus:outline-none resize-none"
                          value={activeAdCopy?.caption || ""}
                          onChange={(e) =>
                            updateActiveAdCopy({ caption: e.target.value })
                          }
                          placeholder="Write your caption"
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

                    const nextAssets = Object.values(generatedAssetByCreativeId)
                      .filter(
                        (a) =>
                          a.status === "completed" &&
                          typeof a.url === "string" &&
                          a.url.trim().length > 0 &&
                          typeof a.assetId === "string" &&
                          a.assetId.trim().length > 0,
                      )
                      .map((a) => {
                        return {
                          assetId: a.assetId,
                          type: (a.type ||
                            (a.assetId === adStyle.videoAssetId
                              ? "video"
                              : "image")) as "video" | "image",
                          url: a.url as string,
                        };
                      });

                    if (nextAssets.length > 0) {
                      attachAssetsToDraft(nextAssets);
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
