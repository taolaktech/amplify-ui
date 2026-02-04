"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Button from "@/app/ui/Button";
import { ArrowCircleRight2, ArrowLeft } from "iconsax-react";
import {
  getGeneration,
  GetGenerationResponse,
} from "@/app/lib/api/base/generations";
import { useAuthStore } from "@/app/lib/stores/authStore";

export default function GenerationStatusPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const generationId = (params as any)?.generationId as string | undefined;
  const token = useAuthStore((s) => s.token);

  const nextRoute = searchParams?.get("next") || "/create-campaign/campaign-snapshots";

  const [job, setJob] = useState<GetGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const isTerminal = useMemo(() => {
    return job?.status === "completed" || job?.status === "failed";
  }, [job?.status]);

  useEffect(() => {
    if (!token) return;
    if (!generationId) return;

    let mounted = true;
    let intervalId: any;

    const tick = async () => {
      setIsPolling(true);
      try {
        const res = await getGeneration({ token, generationId });
        if (!mounted) return;
        setJob(res);
        if (res.status === "failed") {
          setError(res.errorMessage || "Generation failed");
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(
          e?.response?.data?.message || e?.message || "Failed to load generation",
        );
      } finally {
        if (!mounted) return;
        setIsPolling(false);
      }
    };

    tick();
    intervalId = setInterval(tick, 2000);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [token, generationId]);

  return (
    <div className="min-h-[calc(100vh-160px)] mt-10 pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-start">
        <div className="bg-[#111] rounded-3xl p-8 lg:sticky lg:top-24">
          <button
            className="w-10 h-10 rounded-2xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center"
            onClick={() => router.push("/create-campaign/choose-ad-style")}
          >
            <ArrowLeft size={18} color="#FFFFFF" />
          </button>

          <div className="text-white mt-10">
            <div className="text-[34px] leading-[40px] font-bold tracking-800">
              GENERATING
              <br />
              YOUR VIDEO
            </div>
            <p className="mt-3 text-sm text-[rgba(255,255,255,0.70)] tracking-40 max-w-[320px]">
              We’re generating your ad shot-by-shot and assembling the final
              video. You can leave this page open.
            </p>
          </div>

          <div className="mt-10">
            <div className="text-white text-sm font-medium">
              Status: <span className="text-[rgba(255,255,255,0.70)]">{job?.status || "queued"}</span>
            </div>
            {error && (
              <p className="mt-3 text-xs text-[rgba(255,255,255,0.70)]">
                {error}
              </p>
            )}

            <div className="mt-6">
              <Button
                text={isTerminal ? "Continue" : "Working…"}
                action={() => {
                  if (job?.status === "completed") {
                    router.push(nextRoute);
                    return;
                  }
                  if (job?.status === "failed") {
                    router.push("/create-campaign/choose-ad-style");
                  }
                }}
                disabled={!isTerminal}
                hasIconOrLoader
                icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
                iconPosition="right"
                iconSize={16}
                loading={!isTerminal && isPolling}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#0f0f0f] rounded-3xl p-6 custom-shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#C6FF00]" />
            <span>Preview</span>
          </div>

          <div className="mt-5">
            {job?.status === "completed" && job.outputVideoUrl ? (
              <div className="w-full max-w-[420px] mx-auto">
                <div className="relative rounded-3xl overflow-hidden aspect-[9/16] bg-[#1b1b1b]">
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    playsInline
                    src={job.outputVideoUrl}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[420px] mx-auto">
                <div className="relative rounded-3xl overflow-hidden aspect-[9/16] bg-[#1b1b1b] flex items-center justify-center">
                  <div className="text-xs text-[rgba(255,255,255,0.65)]">
                    {job?.status === "failed"
                      ? "Generation failed"
                      : "Preparing preview…"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
