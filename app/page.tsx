"use client";
import { useAuthStore } from "./lib/stores/authStore";

export default function Home() {
  const user = useAuthStore().user;
  return (
    <h1 className="flex font-bold text-4xl justify-center pt-20">
      Hello, {user?.name}
    </h1>
  );
}
