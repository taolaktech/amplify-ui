"use client";
import GettingStarted from "./ui/dashboard/GettingStarted";
import Metrics from "./ui/dashboard/metrics";

export default function DashboardPage() {
  return (
    <main className="">
      <GettingStarted />
      <Metrics />
    </main>
  );
}
