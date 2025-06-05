import { CloseCircle } from "iconsax-react";

export default function SalesLocationView({
  salesLocation,
  toggleSalesLocation,
}: {
  salesLocation: string[];
  toggleSalesLocation: (location: string) => void;
}) {
  return (
    <div className="py-4 flex items-start gap-3 flex-wrap">
      {salesLocation.map((location, index) => (
        <div
          onClick={() => toggleSalesLocation(location)}
          className="flex flex-shrink-0 items-center rounded-[24px] gap-2 py-4 px-3 cursor-pointer bg-[#F7F7F7]"
          key={index}
        >
          <span className="text-sm text-heading font-medium">{location}</span>
          <span className="flex-shrink-0">
            <CloseCircle size={16} color="#333" />
          </span>
        </div>
      ))}
    </div>
  );
}
