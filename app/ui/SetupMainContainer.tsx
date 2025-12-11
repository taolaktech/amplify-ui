"use client";

import { GoBack } from "./SetupSideBar";
import useUIStore from "../lib/stores/uiStore";

export default function SetupMainContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const fromDashboardStep = useUIStore((state) => state.fromDashboardStep);
  return (
    <div
      className={`px-5 flex-1 flex ${fromDashboardStep ? "" : "xl:ml-[402px]"}`}
    >
      <div className="flex-1 flex flex-col pt-3 w-full xl:pt-10 max-w-[836px] mx-auto mb-5">
        <div className="hidden xl:block mb-3">
          <GoBack />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
