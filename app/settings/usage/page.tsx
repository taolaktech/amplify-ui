"use client";

import { useGetCurrentSubscriptionPlan } from "@/app/lib/hooks/stripe";
import { useAuthStore } from "@/app/lib/stores/authStore";
import useCampaignsStore, {
  CampaignStatus,
} from "@/app/lib/stores/campaignsStore";
import useCreativesStore from "@/app/lib/stores/creativesStore";
import { useEffect, useMemo, useState } from "react";
import CreditUsageDashboardCard from "@/app/ui/usage/CreditUsageDashboardCard";
import { getUsageLimits } from "@/app/ui/usage/usageLimits";
import { getSubscriptionUsageSummary } from "@/app/lib/api/base";
import { handleGetMe } from "@/app/lib/api/integrations";

function countCreatives(
  data: Record<string, any[]> | null | undefined,
): number {
  if (!data) return 0;
  return Object.values(data).reduce(
    (acc, list) => acc + (list?.length || 0),
    0,
  );
}

export default function UsagePage() {
  useGetCurrentSubscriptionPlan();

  const subscriptionType = useAuthStore((s) => s.subscriptionType);
  const subscriptionEndDate = useAuthStore((s) => s.subscriptionEndDate);
  const token = useAuthStore((s) => s.token);

  const campaigns = useCampaignsStore((s) => s.data);
  const creatives = useCreativesStore((s) => s);

  const planName = useMemo(() => {
    const n = (subscriptionType as any)?.name;
    if (!n) return "Starter";
    if (typeof n === "string") return n;
    return "Starter";
  }, [subscriptionType]);

  const activeCampaigns = useMemo(() => {
    const list = campaigns || [];
    return list.filter((c: any) => {
      const status = String(c?.status || "").toUpperCase();
      return (
        status === CampaignStatus.ACTIVE ||
        status === "ACTIVE" ||
        status === "LIVE"
      );
    }).length;
  }, [campaigns]);

  const creativesGenerated = useMemo(() => {
    return (
      countCreatives((creatives as any).Google) +
      countCreatives((creatives as any).Facebook)
    );
  }, [creatives]);

  const limits = useMemo(() => getUsageLimits(planName), [planName]);

  const [creditsRemaining, setCreditsRemaining] = useState<number>(
    limits.creditsLimit,
  );
  const [creditsLimit, setCreditsLimit] = useState<number>(limits.creditsLimit);
  const [storageUsedMb, setStorageUsedMb] = useState<number>(0);
  const [storageLimitMb, setStorageLimitMb] = useState<number>(
    limits.storageLimitGb * 1024,
  );

  useEffect(() => {
    setCreditsRemaining(limits.creditsLimit);
    setCreditsLimit(limits.creditsLimit);
    setStorageLimitMb(limits.storageLimitGb * 1024);
  }, [limits.creditsLimit, limits.storageLimitGb]);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    const fetchUsage = async () => {
      const summary = await getSubscriptionUsageSummary({
        token,
        signal: controller.signal,
      });
      if (summary) {
        if (
          typeof summary.creditsRemaining === "number" &&
          Number.isFinite(summary.creditsRemaining)
        ) {
          setCreditsRemaining(summary.creditsRemaining);
        }
        if (
          typeof summary.creditsLimit === "number" &&
          Number.isFinite(summary.creditsLimit)
        ) {
          setCreditsLimit(summary.creditsLimit);
        }
      }

      try {
        const me = await handleGetMe(token);
        const usedMb = Number(me?.memoryUsedInMB ?? 0);
        setStorageUsedMb(Number.isFinite(usedMb) ? usedMb : 0);

        const limitMb = Number(me?.memoryLimitInMB);
        if (Number.isFinite(limitMb)) {
          setStorageLimitMb(limitMb);
        }
      } catch (e) {
        // swallow errors; page should still render
      }
    };

    fetchUsage();
    return () => controller.abort();
  }, [token]);

  const recentActivity = useMemo(
    () => [
      { label: "Generate Image Ad", credits: 15 },
      { label: "Generate Video Ad", credits: 120 },
      { label: "Generate Google Ad Copy", credits: 2 },
    ],
    [],
  );

  return (
    <div className="w-full max-w-[1152px] mx-auto px-4 xl:px-0 py-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-[#333]">Usage</div>
          <div className="text-sm text-[#595959] mt-1">
            Track credits, creatives and campaign limits.
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <CreditUsageDashboardCard
          planName={planName}
          nextResetDate={subscriptionEndDate}
          creditsRemaining={creditsRemaining}
          creditsLimit={creditsLimit}
          storageUsedMb={storageUsedMb}
          storageLimitMb={storageLimitMb}
        />
      </div>
    </div>
  );
}
