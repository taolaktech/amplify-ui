"use client";
import GettingStarted from "./ui/dashboard/GettingStarted";
import Metrics from "./ui/dashboard/metrics";
import CreativeTemplates from "./ui/dashboard/CreativeTemplates";

export default function DashboardPage() {
  return (
    <main className="">
      <GettingStarted />
      <CreativeTemplates />
    </main>
  );
}
