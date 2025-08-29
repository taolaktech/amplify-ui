"use client";
import { useInitialize } from "./lib/hooks/useLoginHooks";
// import { useAuthStore } from "@/app/lib/stores/authStore";
// import { useRouter } from "next/navigation";
import GettingStarted from "./ui/dashboard/GettingStarted";
import Metrics from "./ui/dashboard/metrics";

export default function DashboardPage() {
  const { loading } = useInitialize();

  return (
    <main className="">
      <GettingStarted />
      <Metrics />
    </main>
  );
}
