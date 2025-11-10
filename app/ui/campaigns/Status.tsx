import { capitalize } from "lodash";

export default function Status({ status }: { status: string }) {
  const statusColors: { [key: string]: string } = {
    Active: "bg-green-100 text-green-800",
    Paused: "bg-yellow-100 text-yellow-800",
    Completed: "bg-gray-100 text-gray-800",
    Draft: "bg-blue-100 text-blue-800",
  };

  const tagColors: { [key: string]: string } = {
    Active: "bg-green-800",
    Paused: "bg-yellow-800",
    Completed: "bg-gray-800",
    Draft: "bg-blue-800",
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
