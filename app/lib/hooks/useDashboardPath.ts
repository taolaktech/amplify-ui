import { usePathname } from "next/navigation";

export const useDashboardPath = () => {
  const pathname = usePathname().trim().replace(/\/$/, "");

  const pathName1 = pathname.split("/")[1] ?? "";
  const isDashboard = pathname === "/";
  const isDashboardRoot = pathname === "";
  const isInsights = pathName1.includes("insights");
  const isCampaigns = pathName1.includes("campaigns");
  const isCompany = pathName1.includes("company");
  const isBrandAssets = pathname.includes("/brand-assets");
  const isSupport = pathName1.includes("support");
  const isSettings = pathName1.includes("settings");
  const isPricing = pathname === "/settings";
  const isStoreDetails = pathname === "/company";
  const isIntegrations = pathname.includes("/integrations");

  const allPaths = [
    isDashboard,
    isInsights,
    isCampaigns,
    isCompany,
    isDashboardRoot,
    isSupport,
    isSettings,
    isPricing,
    isBrandAssets,
    isStoreDetails,
    isIntegrations,
  ];

  const isInDashboard = allPaths.some((path) => path);

  return {
    isDashboard,
    isInsights,
    isCampaigns,
    isCompany,
    isBrandAssets,
    isStoreDetails,
    isSupport,
    isSettings,
    isPricing,
    isIntegrations,
    allPaths,
    isDashboardRoot,
    isInDashboard,
  };
};
