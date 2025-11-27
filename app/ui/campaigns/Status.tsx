import { capitalize } from "lodash";

export default function Status({ status }: { status: string }) {
  const statusColors: { [key: string]: string } = {
    ACTIVE: "bg-[#EAF7EF] text-[#27AE60]",
    PENDING: "bg-[#FEF5EA] text-[#FA9B0C]",
    COMPLETED: "bg-[#F0E6FB] text-[#6800D7]",
    DRAFT: "bg-blue-100 text-blue-800",
    ARCHIVED: "bg-red-100 text-red-700",
  };

  const tagColors: { [key: string]: string } = {
    ACTIVE: "bg-[#27AE60]",
    PENDING: "bg-[#FA9B0C]",
    COMPLETED: "bg-[#6800D7]",
    DRAFT: "bg-blue-800",
    ARCHIVED: "bg-red-700",
  };
  const colorClasses = statusColors[status] || "bg-gray-100 text-gray-800";
  const tagClasses = tagColors[status] || "bg-gray-800";

  return (
    <span
      className={`px-2 inline-flex items-center gap-[3px] text-[8px] tracking-0 leading-5 font-semibold rounded-full ${colorClasses}`}
    >
      <span className={`w-[3.4px] h-[3.4px] rounded-full ${tagClasses}`} />
      {capitalize(status)}
    </span>
  );
}
