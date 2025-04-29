"use client";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="px-5">
      <h1 className="font-bold text-2xl pt-20 mb-3">Hello, {user?.name}</h1>

      <button
        className="bg-gray-100 py-2 px-3 rounded-xl "
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
}
