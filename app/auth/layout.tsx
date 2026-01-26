"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../lib/stores/authStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = useAuthStore().isAuth;
  const router = useRouter();
  const path = usePathname().trim().replace(/\/$/, "");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const validated =
        path === "/auth/signup/create/verify-account" ||
        path === "/auth/signup/create/verify-account?verified=true";

      if (isAuth && !validated) {
        router.replace("/");
      }
    }
  }, [isAuth, hasMounted]);

  if (!hasMounted) return null;

  return <>{children}</>;
}
