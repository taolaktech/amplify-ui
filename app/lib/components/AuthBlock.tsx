"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = ["/auth", "/auth/login", "/auth/register"];

export default function AuthBlock({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    if (!isAuth && (pathname === "/" || !isPublic)) {
      router.replace("/auth/login");
    }
  }, [isAuth, pathname, router]);

  if (!isMounted) return null;

  return <>{children}</>;
}
