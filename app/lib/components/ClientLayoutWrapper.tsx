// lib/components/ClientLayoutWrapper.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/app/ui/Navbar";
import AuthBlock from "./AuthBlock";
import { useDashboardPath } from "../hooks/useDashboardPath";
import DashboardSideBar from "@/app/ui/DashboardSidebar";
import DashboardChildren from "@/app/ui/dashboard/DashboardChildren";
import useClickOutside from "../hooks/useClickOutside";

// DEV MODE: Auth bypassed
const BYPASS_AUTH = true;

const queryClient = new QueryClient();

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { allPaths } = useDashboardPath();
  const inDashboard = allPaths.some((path) => path);

  useClickOutside();

  // DEV MODE: Skip auth checks and always show dashboard
  if (BYPASS_AUTH) {
    return (
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <AuthBlock>
          {inDashboard ? (
            <div className="flex flex-col xl:flex-row xl:max-w-full">
              <DashboardSideBar />
              <DashboardChildren>{children}</DashboardChildren>
            </div>
          ) : (
            <div>{children}</div>
          )}
        </AuthBlock>
      </QueryClientProvider>
    );
  }

  // Original code commented out for reference
  /*
  import { useAuthStore } from "../stores/authStore";
  import { useIdleTimer } from "react-idle-timer";
  import SplashScreen from "@/app/ui/loaders/SplashScreen";
  import { useRouter } from "next/navigation";
  import useRefreshInitialize from "../hooks/useRefreshInitialize";
  
  const INACTIVITY_LIMIT = 24 * 60 * 60 * 1000;
  const { logout, isAuth } = useAuthStore();
  const router = useRouter();
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
            <DashboardSideBar />
            <DashboardChildren>{children}</DashboardChildren>
          </div>
        ) : (
          <div>{children}</div>
        )}
      </AuthBlock>
      <SplashScreen isRefreshing={loading} />
    </QueryClientProvider>
  );
  */

  return null;
}
