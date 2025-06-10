import { CloseCircle } from "iconsax-react";

export default function ProductSelected({
  number,
  handleClearSelection,
}: {
  number: number;
  handleClearSelection: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-[#f4f4f4] py-3 px-4">
      <span className="flex items-center gap-3 sm:justify-between">
        <span className="bg-[#F0E6FB] num text-sm flex-shrink-0 text-purple-600 rounded-full min-w-[30px] h-[30px] flex items-center justify-center">
          {number.toString().length === 1 ? `0${number}` : number}
        </span>
        <span className="text-sm font-medium tracking-100">
          Product Selected
        </span>
      </span>
      <span onClick={handleClearSelection}>
        <CloseCircle size={20} color="#333" />
      </span>
    </div>
  );
}
