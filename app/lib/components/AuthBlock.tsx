"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SplashScreen from "@/app/ui/loaders/SplashScreen";
import { useAuthStore } from "../stores/authStore";

const PUBLIC_ROUTES = ["/auth", "/auth/login", "/auth/signup"];

export default function AuthBlock({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isMounted, setIsMounted] = useState(false);
  const isAuth = useAuthStore((state) => state.isAuth);
  const pathname = usePathname().trim().replace(/\/$/, "");
  const router = useRouter();
  const loginDate = useAuthStore((state) => state.loginDate);
  const rememberMe = useAuthStore((state) => state.rememberMe);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setIsMounted(true);

    if (!rememberMe && loginDate) {
      const loginDateObj = new Date(loginDate);
      const timeDiff = Date.now() - loginDateObj?.getTime();
      if (timeDiff > 24 * 60 * 60 * 1000) {
        logout();
        return;
      }
    }
  }, []);

  const checkIsPublicRoute = () => {
    return PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
  };

  useEffect(() => {
    if (!isMounted) return;

    const isPublicRoute = checkIsPublicRoute();
    const validated =
      pathname.includes("/auth/signup/create/verify-account") ||
      pathname.includes("/auth/signup/create/verify-account?verified=true");

    if (!isPublicRoute && !isAuth) {
      router.replace("/auth/login");
    } else if (isPublicRoute && isAuth && !validated) {
      router.replace("/dashboard-v2");
    }
  }, [isMounted, isAuth, pathname, router]);

  const isPublicRoute = checkIsPublicRoute();
  const showSplashScreen = !isMounted || (!isPublicRoute && !isAuth);
  return showSplashScreen ? <SplashScreen /> : <>{children}</>;
}
