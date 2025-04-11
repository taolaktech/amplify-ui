"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../lib/stores/authStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = useAuthStore().isAuth;
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isAuth) {
      router.replace("/");
    } else {
      setChecked(true);
    }
  }, [isAuth]);

  if (!checked) return null;

  return <>{children}</>;
}
