"use client";

export default function InspirationsV2Page() {
  return (
    <div className="min-h-[calc(100vh-56px)] relative flex flex-col flex-shrink-0 lg:gap-6">
      <div className="mb-3 lg:hidden font-semibold text-lg">Inspirations</div>
      <div className="flex flex-col gap-7">
        <div className="flex w-full flex-col-reverse gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="font-medium tracking-150 text-sm lg:text-base">
            Get inspired with creative campaign ideas
          </div>
        </div>
        <div className="bg-[rgba(246,246,246,0.75)] p-6 rounded-3xl min-h-[300px]">
          <p className="text-gray-500">Inspirations content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
