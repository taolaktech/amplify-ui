"use client";
// import { useAuthStore } from "@/app/lib/stores/authStore";
// import { useRouter } from "next/navigation";
import GettingStarted from "../ui/dashboard/GettingStarted";

export default function DashboardPage() {
  // const { user, logout } = useAuthStore();
  // const router = useRouter();

  return (
    <main className="">
      <GettingStarted />
    </main>
  );
}
