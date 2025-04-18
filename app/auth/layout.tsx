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
  let path = usePathname();
  const [checked, setChecked] = useState(false);

  path = path.trim().replace(/\/$/, ""); // Remove trailing slash

  const validated = path === "/auth/signup/create/verify-account";
  const validated2 =
    path === "/auth/signup/create/verify-account?verified=true";

  useEffect(() => {
    if (isAuth && !(validated || validated2)) {
      router.replace("/");
    } else {
      setChecked(true);
    }
  }, [isAuth]);

  if (!checked) return null;

  return <>{children}</>;
}
