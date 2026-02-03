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
import { ArrowCircleRight2, ArrowLeft } from "iconsax-react";
import {
  listVideoPresets,
  VideoPreset,
} from "@/app/lib/api/base/video-presets";
import { createGeneration } from "@/app/lib/api/base/generations";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import CircleLoaderModal from "@/app/ui/modals/CircleLoaderModal";

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

type CreditBalanceResponse = {
  balance?: number;
};

export default function ChooseAdStylePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { productSelection } = useCreateCampaignStore((s) => s);
  const storeAdStyle = useCreateCampaignStore((s) => s.actions.storeAdStyle);

  const [mode, setMode] = useState<Mode>("standard");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [presets, setPresets] = useState<VideoPreset[]>([]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const canGenerate = Boolean(selectedTemplateId);

  const requiredCredits = COST_BY_MODE[mode];
  const hasEnoughCredits =
    creditBalance === null ? true : creditBalance >= requiredCredits;

  useEffect(() => {
    if (!productSelection.complete) {
      router.push("/create-campaign/");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    let mounted = true;

    (async () => {
      setIsLoadingCredits(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/credits`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data: CreditBalanceResponse = await res.json();
        if (!mounted) return;
        setCreditBalance(typeof data?.balance === "number" ? data.balance : 0);
      } catch {
        if (!mounted) return;
        setCreditBalance(null);
      } finally {
        if (!mounted) return;
        setIsLoadingCredits(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

  const fetchPage = useCallback(
    async (nextPage: number) => {
      if (!token) return;
      if (isLoading) return;
      if (!hasNextPage && nextPage !== 1) return;

      setIsLoading(true);
      try {
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
    const presetByTemplateId = new Map<string, VideoPreset>();
    presets.forEach((p) => {
      if (p?.templateId) {
        presetByTemplateId.set(p.templateId, p);
      }
    });

    return TEMPLATE_MAP.map((t) => ({
      ...t,
      preset: presetByTemplateId.get(t.templateId),
    }));
  }, [presets]);

  return (
    <div className="min-h-[calc(100vh-160px)] mt-10 pb-14">
      {isCreating && <CircleLoaderModal text="Starting generation…" />}

      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-start">
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
                  i === 0 ? "w-10 bg-white" : "w-6 bg-[rgba(255,255,255,0.20)]"
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
              Select a style to generate your ad. Each preset includes optimized
              visuals, captions, and pacing for social media.
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
              action={async () => {
                if (!canGenerate) return;
                if (!token) return;
                if (!selectedTemplateId) return;

                if (!hasEnoughCredits) {
                  router.push("/pricing");
                  return;
                }

                setError(null);
                setIsCreating(true);
                try {
                  storeAdStyle({
                    templateId: selectedTemplateId,
                    mode,
                    complete: true,
                  });

                  const productKitId =
                    productSelection?.products?.[0]?.node?.id;

                  if (!productKitId) {
                    throw new Error("Missing productKitId");
                  }

                  const res = await createGeneration({
                    token,
                    dto: {
                      productKitId,
                      templateId: selectedTemplateId,
                      mode,
                    },
                  });

                  if (res?.generationId) {
                    router.push(`/create-campaign/generation/${res.generationId}`);
                  } else {
                    router.push("/create-campaign/campaign-snapshots");
                  }
                } catch (e: any) {
                  setError(
                    e?.response?.data?.message ||
                      e?.message ||
                      "Failed to start generation",
                  );
                } finally {
                  setIsCreating(false);
                }
              }}
              disabled={!canGenerate || isCreating || isLoadingCredits || !hasEnoughCredits}
              hasIconOrLoader
              icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
              iconPosition="right"
              iconSize={16}
            />
            {creditBalance !== null && (
              <p className="mt-3 text-xs text-[rgba(255,255,255,0.70)]">
                Credits: {creditBalance} / {requiredCredits}
              </p>
            )}
            {creditBalance !== null && !hasEnoughCredits && (
              <p className="mt-2 text-xs text-[rgba(255,255,255,0.70)]">
                Not enough credits. Upgrade to generate.
              </p>
            )}
            {error && (
              <p className="mt-3 text-xs text-[rgba(255,255,255,0.70)]">
                {error}
              </p>
            )}
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
            <div className="mt-4 text-xs text-[rgba(255,255,255,0.65)]">
              Loading…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
