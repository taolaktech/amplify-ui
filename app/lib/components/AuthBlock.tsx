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
  console.log(route);

  const paths = ["", "login", "signup"];

  useEffect(() => {
    if (!isAuth) {
      if (path.trim() === "/") router.push("/login");

      if (!paths.some((p) => route[1] === p)) router.push("/login");
    }
  }, [isAuth, path]);

  return <>{children}</>;
}
