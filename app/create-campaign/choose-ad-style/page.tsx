"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/ui/Button";
import { ArrowCircleRight2, ArrowLeft } from "iconsax-react";
import { listVideoPresets, VideoPreset } from "@/app/lib/api/base/video-presets";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";

type Mode = "standard" | "pro";

type TemplateCard = {
  label: string;
  templateId: string;
};

const TEMPLATE_MAP: TemplateCard[] = [
  { label: "SIMPLE UGC", templateId: "ugc_simple_v1" },
  { label: "CLEAN\nMINIMAL", templateId: "studio_minimal_v1" },
  { label: "UNBOXING", templateId: "unboxing_v1" },
  { label: "CUSTOMER\nREVIEWS", templateId: "ugc_testimonial_v1" },
  { label: "VIRAL CHAOS", templateId: "viral_fastcuts_v1" },
  { label: "LUXURY", templateId: "luxury_macro_v1" },
  { label: "PRODUCT\nSTORY", templateId: "product_story_v1" },
  { label: "COZY\nMORNING", templateId: "ugc_skincare_demo_v1" },
];

const COST_BY_MODE: Record<Mode, number> = {
  standard: 38,
  pro: 76,
};

export default function ChooseAdStylePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { productSelection } = useCreateCampaignStore((s) => s);

  const [mode, setMode] = useState<Mode>("standard");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [presets, setPresets] = useState<VideoPreset[]>([]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const canGenerate = Boolean(selectedTemplateId);

  useEffect(() => {
    if (!productSelection.complete) {
      router.push("/create-campaign/");
    }
  }, []);

  const fetchPage = useCallback(
    async (nextPage: number) => {
      if (!token) return;
      if (isLoading) return;
      if (!hasNextPage && nextPage !== 1) return;

      setIsLoading(true);
      try {
        const res = await listVideoPresets({ token, page: nextPage, perPage: 12 });
        const nextPresets = res.data.presets || [];
        const pagination = res.data.pagination;

        setPresets((prev) =>
          nextPage === 1 ? nextPresets : [...prev, ...nextPresets],
        );
        setHasNextPage(Boolean(pagination?.hasNextPage));
        setPage(pagination?.page ?? nextPage);
      } finally {
        setIsLoading(false);
      }
    },
    [token, isLoading, hasNextPage],
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (!hasNextPage) return;
        fetchPage(page + 1);
      },
      { rootMargin: "240px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchPage, hasNextPage, page]);

  const cards = useMemo(() => {
    // Pair UI labels + templateIds with backend presets, best-effort matching
    const presetByIndex = presets;
    return TEMPLATE_MAP.map((t, idx) => ({
      ...t,
      preset: presetByIndex[idx],
    }));
  }, [presets]);

  return (
    <div className="min-h-[calc(100vh-160px)] mt-10 pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
        <div className="bg-[#111] rounded-3xl p-8 lg:sticky lg:top-24">
          <button
            className="w-10 h-10 rounded-2xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center"
            onClick={() => router.push("/create-campaign/product-kit")}
          >
            <ArrowLeft size={18} color="#FFFFFF" />
          </button>

          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-[3px] rounded-full transition-all ${
                  i === 0
                    ? "w-10 bg-white"
                    : "w-6 bg-[rgba(255,255,255,0.20)]"
                }`}
              />
            ))}
          </div>

          <div className="text-white mt-10">
            <div className="text-[34px] leading-[40px] font-bold tracking-800">
              CHOOSE YOUR AD
              <br />
              STYLE
            </div>
            <p className="mt-3 text-sm text-[rgba(255,255,255,0.70)] tracking-40 max-w-[320px]">
              Select a style to generate your ad. Each preset includes optimized visuals, captions, and pacing for social media.
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.06)] p-1 rounded-2xl">
              <button
                className={`px-4 h-[36px] rounded-xl text-sm font-medium ${
                  mode === "standard"
                    ? "bg-white text-black"
                    : "text-[rgba(255,255,255,0.70)]"
                }`}
                onClick={() => setMode("standard")}
              >
                Standard
              </button>
              <button
                className={`px-4 h-[36px] rounded-xl text-sm font-medium ${
                  mode === "pro"
                    ? "bg-white text-black"
                    : "text-[rgba(255,255,255,0.70)]"
                }`}
                onClick={() => setMode("pro")}
              >
                Pro
              </button>
            </div>
          </div>

          <div className="mt-5">
            <Button
              text={`Generate video ✨ ${COST_BY_MODE[mode]}`}
              action={() => {
                if (!canGenerate) return;
                // Next step will trigger generation job (POST /api/generations)
                router.push("/create-campaign/campaign-snapshots");
              }}
              disabled={!canGenerate}
              hasIconOrLoader
              icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
              iconPosition="right"
              iconSize={16}
            />
          </div>
        </div>

        <div className="bg-[#0f0f0f] rounded-3xl p-6 custom-shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#C6FF00]" />
            <span>Presets</span>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 pink-scroll">
            {cards.map((c) => {
              const isSelected = selectedTemplateId === c.templateId;
              const disabled = !c.preset;

              return (
                <button
                  key={c.templateId}
                  className={`relative rounded-3xl overflow-hidden aspect-[9/16] transition-all duration-200 ${
                    disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:scale-[1.01]"
                  } ${
                    isSelected
                      ? "ring-2 ring-[#C6FF00] shadow-[0_0_0_2px_rgba(198,255,0,0.25),0_0_22px_rgba(198,255,0,0.25)]"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (disabled) return;
                    setSelectedTemplateId(c.templateId);
                  }}
                >
                  {c.preset?.thumbnailVideoUrl ? (
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                      playsInline
                      loop
                      autoPlay
                      poster={c.preset.thumbnailImageUrl}
                      src={c.preset.thumbnailVideoUrl}
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
            <div ref={sentinelRef} />
          </div>

          {isLoading && (
            <div className="mt-4 text-xs text-[rgba(255,255,255,0.65)]">Loading…</div>
          )}
        </div>
      </div>
    </div>
  );
}
