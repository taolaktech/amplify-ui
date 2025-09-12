"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { useEffect, useState } from "react";
import SplashScreen from "@/app/ui/loaders/SplashScreen";

const PUBLIC_ROUTES = ["/auth", "/auth/login", "/auth/signup"];

export default function AuthBlock({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isAuth = useAuthStore((state) => state.isAuth); // Make sure your store supports loading state
  const pathname = usePathname();
  const router = useRouter();
  const loginDate = useAuthStore((state) => state.loginDate);
  const rememberMe = useAuthStore((state) => state.rememberMe);
  const logout = useAuthStore((state) => state.logout);

  const [isMounted, setIsMounted] = useState(false);

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
      router.replace("/"); // Redirect to dashboard if already authenticated
    }
  }, [isMounted, isAuth, pathname, router]);

  const isPublicRoute = checkIsPublicRoute();

  if (!isMounted || (!isPublicRoute && !isAuth)) {
    return <SplashScreen />; // or return a <LoadingScreen />
  }

  return <>{children}</>;
}
