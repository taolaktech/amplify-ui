"use client";
import { useEffect } from "react";
import useGetCampaigns from "./lib/hooks/campaigns";
import GettingStarted from "./ui/dashboard/GettingStarted";
import Metrics from "./ui/dashboard/metrics";

export default function DashboardPage() {
  // const { fetchCampaigns } = useGetCampaigns();

  // useEffect(() => {
  //   fetchCampaigns();
  // }, []);

  return (
    <main className="">
      <GettingStarted />
      <Metrics />
    </main>
  );
}
