// lib/components/ClientLayoutWrapper.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { useIdleTimer } from "react-idle-timer";
import Navbar from "@/app/ui/Navbar";
import AuthBlock from "./AuthBlock";
import SplashScreen from "@/app/ui/loaders/SplashScreen";
import { useRouter } from "next/navigation";
import useRefreshInitialize from "../hooks/useRefreshInitialize";
import { useDashboardPath } from "../hooks/useDashboardPath";
import DashboardSideBar from "@/app/ui/DashboardSidebar";
import DashboardChildren from "@/app/ui/dashboard/DashboardChildren";

const queryClient = new QueryClient();
const INACTIVITY_LIMIT = 24 * 60 * 60 * 1000; // 24 hours
// const INACTIVITY_LIMIT_D = 20 * 24 * 60 * 60 * 1000; // 20 days

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, isAuth } = useAuthStore();
  const router = useRouter();
  const { allPaths } = useDashboardPath();

  const inDashboard = allPaths.some((path) => path);

  const { loading } = useRefreshInitialize();
  const onIdle = () => {
    if (isAuth) {
      logout();
      router.push("/auth/login");
    }
  };
  useIdleTimer({
    timeout: INACTIVITY_LIMIT,
    onIdle,
    debounce: 500,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <AuthBlock>
        {inDashboard && isAuth ? (
          <div className="flex flex-col xl:flex-row xl:max-w-full">
            {/* Sidebar */}
            <DashboardSideBar />
            {/* Main Content */}
            <DashboardChildren>{children}</DashboardChildren>
          </div>
        ) : (
          <div>{children}</div>
        )}
      </AuthBlock>
      <SplashScreen isRefreshing={loading} />
    </QueryClientProvider>
  );
}
