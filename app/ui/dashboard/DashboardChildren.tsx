"use client";
import useUIStore from "@/app/lib/stores/uiStore";

export default function DashboardChildren({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  return (
    <div
      className={` ${
        isSidebarOpen ? "xl:ml-[279px]" : "xl:ml-[91px]"
      } px-5 flex-1 flex `}
    >
      <div className="flex-1 flex flex-col pt-3 w-full xl:pt-10 max-w-[1106px] mx-auto mb-5">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
