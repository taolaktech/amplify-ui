"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowForward, Magicpen } from "iconsax-react";
import Button from "@/app/ui/Button";
import { useModal } from "@/app/lib/hooks/useModal";
import { useToastStore } from "@/app/lib/stores/toastStore";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { getSeededImageAdTemplates } from "../product-kit/ImageAdsTemplatesBrowser";

type ReadyCreative = {
  id: string;
  type: "video" | "image";
  title: string;
  url: string;
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

  const { productSelection, adStyle } = useCreateCampaignStore((s) => s);

  const product = productSelection.products?.[0]?.node;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const [isRecloning, setIsRecloning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoDuration, setVideoDuration] = useState<number | undefined>(undefined);

  useModal(isBackModalOpen || isZoomOpen);

  const imageTemplates = useMemo(() => {
    return getSeededImageAdTemplates(null);
  }, []);

  const imageCreatives = useMemo((): ReadyCreative[] => {
    const ids = Array.isArray(adStyle.imageTemplateIds)
      ? adStyle.imageTemplateIds
      : [];

    return ids
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
  }, [adStyle.imageTemplateIds, imageTemplates]);

  const videoCreative = useMemo((): ReadyCreative | null => {
    const url = adStyle.videoPreset?.videoUrl;
    if (!url) return null;

    return {
      id: adStyle.templateId || "video",
      type: "video",
      title: adStyle.videoPreset?.title || "Video creative",
      url,
    };
  }, [adStyle.templateId, adStyle.videoPreset?.title, adStyle.videoPreset?.videoUrl]);

  const creatives = useMemo(() => {
    const list: ReadyCreative[] = [];
    if (videoCreative) list.push(videoCreative);
    list.push(...imageCreatives);
    return list;
  }, [imageCreatives, videoCreative]);

  useEffect(() => {
    if (activeIndex >= creatives.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, creatives.length]);

  const activeCreative = creatives[activeIndex] || null;

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

  const handleSaveToLibrary = async () => {
    if (!activeCreative) return;
    setIsSaving(true);
    try {
      setToast({
        type: "success",
        title: "Coming soon",
        message: "Save to library will be available once the backend is connected.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReclone = async () => {
    setIsRecloning(true);
    try {
      setToast({
        type: "success",
        title: "Coming soon",
        message: "Re-clone will be available once the backend is connected.",
      });
    } finally {
      setIsRecloning(false);
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
        <div className="bg-[#FBFAFC] md:bg-white rounded-3xl custom-shadow-sm p-6 lg:sticky lg:top-24">
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
              Review your cloned creative. You can reuse it, edit inputs, or launch
              a campaign.
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
                  <div className="text-[11px] text-neutral-light">Creative type</div>
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
                        const d = (e.currentTarget as HTMLVideoElement).duration;
                        if (Number.isFinite(d)) setVideoDuration(d);
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
                    <img
                      src={activeCreative.url}
                      className="absolute inset-0 w-full h-full object-contain bg-[#111]"
                    />
                  </button>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-[rgba(255,255,255,0.70)]">
                    No preview available
                  </div>
                )}
              </div>

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
                <div className="mt-3 flex items-center justify-center gap-2">
                  {creatives.map((_, i) => (
                    <button
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full ${
                        i === activeIndex ? "bg-purple-600" : "bg-[#D9D9D9]"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveIndex(i);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-end gap-2">
              <div className="w-[160px]">
                <Button
                  text="Continue"
                  action={() => router.push("/create-campaign/campaign-snapshots")}
                  hasIconOrLoader
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
                  isRecloning
                    ? "bg-[#ECECEC] border-[#E0E0E0] cursor-not-allowed"
                    : "bg-white border-[rgba(0,0,0,0.06)]"
                }`}
                disabled={isRecloning}
                onClick={(e) => {
                  e.preventDefault();
                  handleReclone();
                }}
                aria-label="Re-clone"
              >
                <Magicpen size={18} color="#111" />
              </button>

              <div className="w-[160px]">
                <Button
                  text="Create another"
                  secondary
                  action={() => router.push("/create-campaign/choose-ad-style")}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              <div className="w-[160px]">
                <Button
                  text="Edit Product Kit"
                  secondary
                  action={() => router.push("/create-campaign/product-kit")}
                />
              </div>
              <div className="w-[160px]">
                <Button
                  text={isSaving ? "Saving…" : "Go to Library"}
                  secondary
                  action={() => {
                    if (!isSaving) {
                      setToast({
                        type: "success",
                        title: "Coming soon",
                        message:
                          "The asset library page will be wired up once the backend is connected.",
                      });
                    }
                  }}
                  disabled={isSaving}
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
                <img
                  src={activeCreative.url}
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
