"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { useLayoutEffect } from "react";

const PUBLIC_ROUTES = ["/auth", "/auth/login", "/auth/register"];

export default function AuthBlock({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isAuth && pathname.trim() === "/") {
      router.replace("/auth/login");
    }
  }, [isAuth, pathname, router]);

  if (!isAuth && !PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return <>{children}</>;
}
