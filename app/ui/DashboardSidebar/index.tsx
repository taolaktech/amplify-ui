"use client";

import { useState } from "react";
import useUIStore from "@/app/lib/stores/uiStore";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useRouter } from "next/navigation";
import { useDashboardPath } from "@/app/lib/hooks/useDashboardPath";
import DesktopSideBar from "./desktop";
import MobileSideBar from "./mobile";

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
    isIntegrations,
  } = useDashboardPath();

  const toggleIsCompanyOpen = () => {
    setIsCompanyOpen((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    setIsCompanyOpen(false);
    toggleSidebar();
  };

  const handleLogout = () => {
    logout();
    reset();
    router.replace("/auth/login");
  };

  return (
    <>
      <DesktopSideBar
        isSidebarOpen={isSidebarOpen}
        handleToggleSidebar={handleToggleSidebar}
        handleLogout={handleLogout}
        isDashboard={isDashboard}
        isInsights={isInsights}
        isCampaigns={isCampaigns}
        isCompany={isCompany}
        isSupport={isSupport}
        isIntegrations={isIntegrations}
        isCompanyOpen={isCompanyOpen}
        toggleIsCompanyOpen={toggleIsCompanyOpen}
      />
      <MobileSideBar
        isSidebarOpen={isSidebarOpen}
        handleToggleSidebar={handleToggleSidebar}
        handleLogout={handleLogout}
        isDashboard={isDashboard}
        isInsights={isInsights}
        isCampaigns={isCampaigns}
        isCompany={isCompany}
        isSupport={isSupport}
        isIntegrations={isIntegrations}
        isCompanyOpen={isCompanyOpen}
        toggleIsCompanyOpen={toggleIsCompanyOpen}
      />
    </>
  );
}
