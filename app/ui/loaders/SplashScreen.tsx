"use client";

import { useEffect, useState } from "react";
import SplashIcon from "@/public/splash.svg";
import SplashSMIcon from "@/public/splash-sm.svg";
import { useAuthStore } from "@/app/lib/stores/authStore";

export default function SplashScreen({
  isRefreshing,
}: {
  isRefreshing?: boolean;
}) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (isRefreshing) return;

    const maybeHydrated =
      typeof window !== "undefined" && !!localStorage.getItem("auth-storage");

    if (!maybeHydrated) {
      setHasHydrated(true);
      return;
    }

    const unsub = (useAuthStore as any).persist?.onFinishHydration?.(() => {
      setHasHydrated(true);
    });

    if ((useAuthStore as any).persist?.hasHydrated?.()) {
      setHasHydrated(true);
    }

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [isRefreshing]);

  useEffect(() => {
    // Keep splash visible if still refreshing
    if (isRefreshing) {
      setIsFadingOut(false);
      setShowSplash(true);
      return;
    }

    // Only fade out when hydrated AND not refreshing
    if (!hasHydrated) return;

    // Step 1: Start fade out after showing splash briefly
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 500); // show splash for at least 500ms

    // Step 2: Remove from DOM after fade completes
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1000); // 500ms delay + 500ms fade duration

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [hasHydrated, isRefreshing]);

  if (!showSplash) return null;

  return (
    <div
      className={`fixed top-0 z-50 flex items-center justify-center flex-col h-screen w-screen bg-white md:bg-background-2 transition-opacity duration-500 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="hidden md:block">
        <SplashIcon width={128} height={200} />
      </div>
      <div className="md:hidden">
        <SplashSMIcon width={128} height={148} />
      </div>
    </div>
  );
}
