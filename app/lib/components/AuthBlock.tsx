"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";

export default function AuthBlock({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
    }
  }, [isAuth]);

  return <>{children}</>;
}
