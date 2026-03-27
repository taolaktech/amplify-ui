"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type UsageMetric = {
  label: string;
  used: number;
  limit: number;
  icon: React.ReactNode;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatDate(value?: string | Date | null) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getUsageColor(pct: number) {
  if (pct < 0.7) return "bg-green-500";
  if (pct < 0.9) return "bg-yellow-400";
  return "bg-red-500";
}

function MetricRow({ metric }: { metric: UsageMetric }) {
  const pct = metric.limit > 0 ? clamp(metric.used / metric.limit, 0, 1) : 0;
  const barColor = getUsageColor(pct);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[#333]">
          <span className="w-5 h-5 flex items-center justify-center">
            {metric.icon}
          </span>
          <span className="font-medium">{metric.label}</span>
        </div>
        <div className="text-xs text-[#595959]">
          {metric.used} / {metric.limit}
        </div>
      </div>
      <div className="w-full h-2 rounded-full bg-[#EFEFEF] overflow-hidden">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function CreditUsageWidget({
  planName,
  nextResetDate,
  creditsRemaining: creditsRemainingProp,
  creditsLimit: creditsLimitProp,
  token,
}: {
  planName: string;
  nextResetDate?: string | Date | null;
  creditsRemaining: number;
  creditsLimit: number;
  token?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [creditsRemaining, setCreditsRemaining] =
    useState(creditsRemainingProp);
  const [creditsLimit, setCreditsLimit] = useState(creditsLimitProp);

  useEffect(() => {
    setCreditsRemaining(creditsRemainingProp);
  }, [creditsRemainingProp]);

  useEffect(() => {
    setCreditsLimit(creditsLimitProp);
  }, [creditsLimitProp]);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    const fetchUsage = async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        if (!apiHost) return;

        const res = await fetch(`${apiHost}/credit-ledger/subscription-usage`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) return;
        const json = await res.json();

        const remaining = Number(json?.data?.totalTokenBalance);
        const limit = Number(json?.data?.totalSubscriptionTokens);

        if (Number.isFinite(remaining)) setCreditsRemaining(remaining);
        if (Number.isFinite(limit)) setCreditsLimit(limit);
      } catch (e) {
        // swallow errors; header must never break
      }
    };

    fetchUsage();
    return () => controller.abort();
  }, [token]);

  const creditsUsed = useMemo(() => {
    const used = creditsLimit - creditsRemaining;
    return Math.max(0, used);
  }, [creditsLimit, creditsRemaining]);

  const isLowCredits = useMemo(() => {
    if (creditsLimit <= 0) return false;
    return creditsRemaining / creditsLimit <= 0.2;
  }, [creditsLimit, creditsRemaining]);

  const metrics = useMemo<UsageMetric[]>(() => {
    return [
      {
        label: "Credits",
        used: creditsUsed,
        limit: creditsLimit,
        icon: <span className="text-[#6800D7]">⚡</span>,
      },
    ];
  }, [creditsUsed, creditsLimit]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hidden xl:flex items-center gap-3 rounded-xl border border-[#EFEFEF] bg-white px-3 py-2 hover:bg-[#FBFAFC]"
      >
        <div className="flex items-center gap-3 text-xs text-[#595959]">
          <div className="flex items-center gap-1 relative">
            <span className="font-medium text-[#333]">⚡ Credits</span>
            <span>
              {creditsUsed} / {creditsLimit}
            </span>
            {isLowCredits && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full">
                Low
              </span>
            )}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="xl:hidden flex items-center gap-2 rounded-xl border border-[#EFEFEF] bg-white px-3 py-2 hover:bg-[#FBFAFC]"
      >
        <span className="text-[#6800D7]">⚡</span>
        <span className="text-sm font-medium text-[#333]">
          {creditsUsed} / {creditsLimit}
        </span>
        {isLowCredits && (
          <span className="bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full">
            Low
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] rounded-2xl bg-white border border-[#EFEFEF] custom-shadow-profile p-4 z-50">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-[#333]">
                Your Plan: {planName}
              </div>
              <div className="text-xs text-[#595959]">
                Next Reset: {formatDate(nextResetDate) || "—"}
              </div>
            </div>
          </div>

          {isLowCredits && (
            <div className="mt-3 rounded-xl bg-[#FFF5F5] border border-[#FFD6D6] p-3">
              <div className="text-sm font-semibold text-[#B42318]">
                You are running low on AI credits.
              </div>
              <div className="text-xs text-[#B42318] mt-1">
                Generate more ads by purchasing additional credits or upgrading
                your plan.
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-4">
            {metrics.map((m) => (
              <MetricRow key={m.label} metric={m} />
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/settings/usage"
              className="h-[40px] rounded-xl flex items-center justify-center text-sm font-medium gradient text-white"
              onClick={() => setOpen(false)}
            >
              Buy More Credits
            </Link>
            <Link
              href="/settings"
              className="h-[40px] rounded-xl flex items-center justify-center text-sm font-medium secondary border border-[#EFEFEF] text-[#333]"
              onClick={() => setOpen(false)}
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
