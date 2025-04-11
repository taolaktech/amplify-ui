// lib/components/ClientLayoutWrapper.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { useIdleTimer } from "react-idle-timer";
import Navbar from "@/app/ui/Navbar";
import AuthBlock from "./AuthBlock";
import SplashScreen from "@/app/ui/loaders/SplashScreen";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient();
const INACTIVITY_LIMIT = 24 * 60 * 60 * 1000; // 24 hours

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, isAuth } = useAuthStore();
  const router = useRouter();

  const onIdle = () => {
    console.log("User is idle");
    if (isAuth) {
      logout();
      router.push("/auth/login");
    }
  };

  const { getRemainingTime, reset } = useIdleTimer({
    timeout: INACTIVITY_LIMIT,
    onIdle,
    debounce: 500,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <AuthBlock>
        <div>{children}</div>
      </AuthBlock>
      <SplashScreen />
    </QueryClientProvider>
  );
}
