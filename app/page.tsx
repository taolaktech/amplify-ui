"use client";

import { useAuthStore } from "./lib/stores/authStore";
import DefaultLink from "./ui/DefaultLink";

export default function HomePage() {
  const isAuth = useAuthStore((state) => state.isAuth);
  return (
    <div className="px-5 max-w-1512px mx-auto">
      <h1 className="font-bold text-2xl pt-20 mb-3">HOME PAGE</h1>
      <div className="flex gap-3 items-center justify-start">
        <div>
          <DefaultLink
            href={isAuth ? "/dashboard" : "/auth/login"}
            text="Login"
          />
        </div>
        <div>
          <DefaultLink
            href={isAuth ? "/dashboard" : "/auth/signup"}
            text="Sign up"
            secondary
          />
        </div>
      </div>
    </div>
  );
}
