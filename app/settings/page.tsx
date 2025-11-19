"use client";
import Pricing from "@/app/ui/pricing";
import { useGetCurrentSubscriptionPlan } from "../lib/hooks/stripe";

export default function SettingsPage() {
  useGetCurrentSubscriptionPlan();

  return <Pricing isDashboard />;
}
