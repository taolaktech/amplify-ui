"use client";

type ActivityItem = {
  label: string;
  credits: number;
};

export default function RecentCreditActivity({
  items,
}: {
  items: ActivityItem[];
}) {
  return (
    <div className="rounded-2xl border border-[#EFEFEF] bg-white p-5 custom-shadow-profile">
      <div className="text-lg font-semibold text-[#333]">Recent AI Activity</div>
      <div className="mt-4 flex flex-col gap-3">
        {items.map((it, idx) => (
          <div key={`${it.label}-${idx}`} className="flex items-center justify-between">
            <div className="text-sm text-[#333]">{it.label}</div>
            <div className="text-sm font-medium text-[#333]">-{it.credits} credits</div>
          </div>
        ))}
      </div>
    </div>
  );
}
