"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getUsageLimits } from "./usageLimits";

type Metric = {
  label: string;
  used: number;
  limit: number;
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

function MetricBar({ metric }: { metric: Metric }) {
  const pct = metric.limit > 0 ? clamp(metric.used / metric.limit, 0, 1) : 0;
  const barColor = getUsageColor(pct);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-[#333]">{metric.label}</div>
        <div className="text-xs text-[#595959]">
          {metric.used} / {metric.limit}
        </div>
      </div>
      <div className="w-full h-2 rounded-full bg-[#EFEFEF] overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}

export default function CreditUsageDashboardCard({
  planName,
  nextResetDate,
  creditsRemaining,
  creativesGenerated,
  activeCampaigns,
  storageUsedGb,
}: {
  planName: string;
  nextResetDate?: string | Date | null;
  creditsRemaining: number;
  creativesGenerated: number;
  activeCampaigns: number;
  storageUsedGb?: number;
}) {
  const limits = useMemo(() => getUsageLimits(planName), [planName]);

  const creditsUsed = Math.max(0, limits.creditsLimit - creditsRemaining);

  const metrics: Metric[] = useMemo(
    () => [
      { label: "Credits Remaining", used: creditsUsed, limit: limits.creditsLimit },
      { label: "Creatives Generated", used: creativesGenerated, limit: limits.creativesLimit },
      { label: "Active Campaigns", used: activeCampaigns, limit: limits.campaignsLimit },
      {
        label: "Storage Used",
        used: storageUsedGb ?? 0,
        limit: limits.storageLimitGb,
      },
    ],
    [creditsUsed, limits, creativesGenerated, activeCampaigns, storageUsedGb],
  );

  const isAnyLimitReached = useMemo(() => {
    return (
      creativesGenerated >= limits.creativesLimit ||
      activeCampaigns >= limits.campaignsLimit ||
      creditsRemaining <= 0
    );
  }, [creativesGenerated, activeCampaigns, creditsRemaining, limits]);

  return (
    <div className="rounded-2xl border border-[#EFEFEF] bg-white p-5 custom-shadow-profile">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-[#595959]">Plan</div>
          <div className="text-lg font-semibold text-[#333]">{planName}</div>
          <div className="text-xs text-[#595959] mt-1">
            Next Reset: {formatDate(nextResetDate) || "—"}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/create-campaign/fund-campaign"
            className="h-[40px] px-4 rounded-xl flex items-center justify-center text-sm font-medium gradient text-white"
          >
            Buy Credits
          </Link>
          <Link
            href="/settings"
            className="h-[40px] px-4 rounded-xl flex items-center justify-center text-sm font-medium border border-[#EFEFEF]"
          >
            Upgrade
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {metrics.map((m) => (
          <MetricBar key={m.label} metric={m} />
        ))}
      </div>

      {isAnyLimitReached && (
        <div className="mt-5 rounded-xl bg-[#FBFAFC] border border-[#EFEFEF] p-4">
          <div className="text-sm font-semibold text-[#333]">
            You are close to (or have reached) a plan limit.
          </div>
          <div className="text-xs text-[#595959] mt-1">
            Upgrade to increase monthly credits and unlock higher creative and campaign limits.
          </div>
          <div className="mt-3">
            <Link
              href="/settings"
              className="inline-flex h-[40px] px-4 rounded-xl items-center justify-center text-sm font-medium gradient text-white"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
