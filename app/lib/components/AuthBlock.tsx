"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";

export default function AuthBlock({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuth } = useAuthStore();
  const path = usePathname();
  const router = useRouter();

  const route = path.trim().split("/");

  const paths = ["", "auth"];

  useEffect(() => {
    if (!isAuth) {
      if (path.trim() === "/") router.push("/auth/login");

      if (!paths.some((p) => route[1] === p)) router.push("/auth/login");
    }
  }, [isAuth, path]);

  return <>{children}</>;
}
