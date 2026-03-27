"use client";

import { useGetCurrentSubscriptionPlan } from "@/app/lib/hooks/stripe";
import { useAuthStore } from "@/app/lib/stores/authStore";
import useCampaignsStore, {
  CampaignStatus,
} from "@/app/lib/stores/campaignsStore";
import useCreativesStore from "@/app/lib/stores/creativesStore";
import { useMemo } from "react";
import CreditUsageDashboardCard from "@/app/ui/usage/CreditUsageDashboardCard";
import RecentCreditActivity from "@/app/ui/usage/RecentCreditActivity";
import { getUsageLimits } from "@/app/ui/usage/usageLimits";

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

  const creditsRemaining = useMemo(() => {
    // Placeholder until wired to backend ledger/wallet.
    // Keeps UI functional and consistent with the prompt mock.
    return Math.max(0, Math.min(limits.creditsLimit, 320));
  }, [limits]);

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
          creativesGenerated={creativesGenerated}
          activeCampaigns={activeCampaigns}
          storageUsedGb={1.4}
        />

        <RecentCreditActivity items={recentActivity} />
      </div>
    </div>
  );
}
