"use client";

import { useEffect, useState } from "react";
import SplashScreen from "@/app/ui/loaders/SplashScreen";

// DEV MODE: Auth bypassed - showing dashboard directly
const BYPASS_AUTH = true;

export default function AuthBlock({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Bypass auth - just wait for mount then show children
  if (BYPASS_AUTH) {
    return !isMounted ? <SplashScreen /> : <>{children}</>;
  }

  // Original auth logic commented out below for reference
  /*
  import { useRouter, usePathname } from "next/navigation";
  import { useAuthStore } from "../stores/authStore";
  
  const PUBLIC_ROUTES = ["/auth", "/auth/login", "/auth/signup"];
  
  const isAuth = useAuthStore((state) => state.isAuth);
  const pathname = usePathname();
  const router = useRouter();
  const loginDate = useAuthStore((state) => state.loginDate);
  const rememberMe = useAuthStore((state) => state.rememberMe);
  const logout = useAuthStore((state) => state.logout);

  const checkIsPublicRoute = () => {
    return PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
  };

  useEffect(() => {
    setIsMounted(true);
    if (!rememberMe && loginDate) {
      const loginDateObj = new Date(loginDate);
      const timeDiff = Date.now() - loginDateObj?.getTime();
      if (timeDiff < 24 * 60 * 60 * 1000) {
        logout();
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isPublicRoute = checkIsPublicRoute();
    const validated =
      pathname.includes("/auth/signup/create/verify-account") ||
      pathname.includes("/auth/signup/create/verify-account?verified=true");

    if (!isPublicRoute && !isAuth) {
      router.replace("/auth/login");
    } else if (isPublicRoute && isAuth && !validated) {
      router.replace("/");
    }
  }, [isMounted, isAuth, pathname, router]);

  const isPublicRoute = checkIsPublicRoute();
  const showSplashScreen = !isMounted || (!isPublicRoute && !isAuth);
  return showSplashScreen ? <SplashScreen /> : <>{children}</>;
  */
  
  return <>{children}</>;
}
