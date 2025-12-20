"use client";

import { useEffect, useState } from "react";
import useUIStore from "@/app/lib/stores/uiStore";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useRouter } from "next/navigation";
import { useDashboardPath } from "@/app/lib/hooks/useDashboardPath";
import DesktopSideBar from "./desktop";
import MobileSideBar from "./mobile";
import { useCampaignsActions } from "@/app/lib/hooks/campaigns";

export default function DashboardSideBar() {
  const logout = useAuthStore((state) => state.logout);
  const { navigateToCreateCampaign } = useCampaignsActions();
  const reset = useSetupStore((state) => state.reset);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const { toggleSidebar } = useUIStore((state) => state.actions);
  const router = useRouter();
  const {
    isDashboard,
    isInsights,
    isCampaigns,
    isCompany,
    isBrandAssets,
    isSupport,
    isSettings,
    isPricing,
    isIntegrations,
    isDashboardRoot,
    isStoreDetails,
    isVersion2,
    isDashboardV2,
    isInspirationsV2,
    isCampaignsV2,
  } = useDashboardPath();

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSettingTabOpen, setIsSettingTabOpen] = useState(false);
  const [isCompanyTabOpen, setIsCompanyTabOpen] = useState(false);
  const [isVersion2TabOpen, setIsVersion2TabOpen] = useState(false);

  // const marketingGoals = useSetupStore((state) => state.marketingGoals);

  const toggleIsSettingTab = () => {
    setIsSettingTabOpen((prev) => !prev);
    setIsCompanyTabOpen(false);
  };

  // const setToast = useToastStore((state) => state.setToast);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleIsCompanyOpen = () => {
    setIsCompanyTabOpen((prev) => !prev);
    setIsSettingTabOpen(false);
    setIsVersion2TabOpen(false);
  };

  const toggleIsVersion2Open = () => {
    setIsVersion2TabOpen((prev) => !prev);
    setIsSettingTabOpen(false);
    setIsCompanyTabOpen(false);
  };

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  const handleCreateCampaign = () => {
    navigateToCreateCampaign();
    return;
  };

  const handleLogout = () => {
    logout();
    reset();
    router.replace("/auth/login");
  };

  return (
    <>
      {!isSmallScreen && (
        <DesktopSideBar
          isSidebarOpen={isSidebarOpen}
          handleToggleSidebar={handleToggleSidebar}
          handleLogout={handleLogout}
          isDashboard={isDashboard || isDashboardRoot}
          isInsights={isInsights}
          isCampaigns={isCampaigns}
          isCompany={isCompany}
          isSupport={isSupport}
          isPricing={isPricing}
          isStoreDetails={isStoreDetails}
          isBrandAssets={isBrandAssets}
          isIntegrations={isIntegrations}
          isSettings={isSettings}
          toggleIsSettingTabOpen={toggleIsSettingTab}
          isSettingTabOpen={isSettingTabOpen}
          toggleIsCompanyTabOpen={toggleIsCompanyOpen}
          isCompanyTabOpen={isCompanyTabOpen}
          handleCreateCampaign={handleCreateCampaign}
          isVersion2={isVersion2}
          isDashboardV2={isDashboardV2}
          isInspirationsV2={isInspirationsV2}
          isCampaignsV2={isCampaignsV2}
          isVersion2TabOpen={isVersion2TabOpen}
          toggleIsVersion2TabOpen={toggleIsVersion2Open}
        />
      )}
      {isSmallScreen && (
        <MobileSideBar
          isSidebarOpen={isSidebarOpen}
          isStoreDetails={isStoreDetails}
          handleToggleSidebar={handleToggleSidebar}
          handleLogout={handleLogout}
          isDashboard={isDashboard || isDashboardRoot}
          isInsights={isInsights}
          isCampaigns={isCampaigns}
          isSettingTabOpen={isSettingTabOpen}
          toggleIsSettingTabOpen={toggleIsSettingTab}
          isCompany={isCompany}
          isSupport={isSupport}
          isSettings={isSettings}
          isPricing={isPricing}
          isBrandAssets={isBrandAssets}
          isIntegrations={isIntegrations}
          isCompanyTabOpen={isCompanyTabOpen}
          toggleIsCompanyTabOpen={toggleIsCompanyOpen}
          handleCreateCampaign={handleCreateCampaign}
        />
      )}
    </>
  );
}
