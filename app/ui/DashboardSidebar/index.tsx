"use client";

import { useEffect, useState } from "react";
import useUIStore from "@/app/lib/stores/uiStore";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useRouter } from "next/navigation";
import { useDashboardPath } from "@/app/lib/hooks/useDashboardPath";
import DesktopSideBar from "./desktop";
import MobileSideBar from "./mobile";
import { useToastStore } from "@/app/lib/stores/toastStore";

export default function DashboardSideBar() {
  const logout = useAuthStore((state) => state.logout);
  const reset = useSetupStore((state) => state.reset);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const { toggleSidebar } = useUIStore((state) => state.actions);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const router = useRouter();
  const {
    isDashboard,
    isInsights,
    isCampaigns,
    isCompany,
    isSupport,
    isSettings,
    isIntegrations,
  } = useDashboardPath();

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  console.log("isSidebarOpen", isSidebarOpen);

  const marketingGoals = useSetupStore((state) => state.marketingGoals);

  const setToast = useToastStore((state) => state.setToast);

  useEffect(() => {
    console.log("useEffect");
    const handleResize = () => {
      console.log("handleResize");
      setIsSmallScreen(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleIsCompanyOpen = () => {
    setIsCompanyOpen((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    // setIsCompanyOpen(false);
    toggleSidebar();
  };

  const handleCreateCampaign = () => {
    if (marketingGoals.complete) {
      router.push("/pricing?route=campaigns");
      return;
    }
    setToast({
      title: "👋 Let's Get You Set Up First",
      message:
        "You need to complete onboarding before launching your first campaign. It only takes a minute!",
      type: "warning",
    });
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
          isDashboard={isDashboard}
          isInsights={isInsights}
          isCampaigns={isCampaigns}
          isCompany={isCompany}
          isSupport={isSupport}
          isSettings={isSettings}
          // isIntegrations={isIntegrations}
          handleCreateCampaign={handleCreateCampaign}
          isCompanyOpen={isCompanyOpen}
          toggleIsCompanyOpen={toggleIsCompanyOpen}
        />
      )}
      {isSmallScreen && (
        <MobileSideBar
          isSidebarOpen={isSidebarOpen}
          handleToggleSidebar={handleToggleSidebar}
          handleLogout={handleLogout}
          isDashboard={isDashboard}
          isInsights={isInsights}
          isCampaigns={isCampaigns}
          isCompany={isCompany}
          isSupport={isSupport}
          isSettings={isSettings}
          isIntegrations={isIntegrations}
          handleCreateCampaign={handleCreateCampaign}
          isCompanyOpen={isCompanyOpen}
          toggleIsCompanyOpen={toggleIsCompanyOpen}
        />
      )}
    </>
  );
}
