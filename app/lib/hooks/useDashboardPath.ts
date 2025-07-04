import { usePathname } from "next/navigation";

export const useDashboardPath = () => {
  const pathname = usePathname().trim().replace(/\/$/, "");
  console.log("pathname", pathname);
  const isDashboard = pathname === "/dashboard";
  const isInsights = pathname.includes("/dashboard/insights");
  const isCampaigns = pathname.includes("/dashboard/campaigns");
  const isCompany = pathname.includes("/dashboard/company");
  const isSupport = pathname.includes("/dashboard/support");
  const isSettings = pathname.includes("/dashboard/settings");
  const isIntegrations = pathname.includes("/dashboard/integrations");

  return {
    isDashboard,
    isInsights,
    isCampaigns,
    isCompany,
    isSupport,
    isSettings,
    isIntegrations,
  };
};
