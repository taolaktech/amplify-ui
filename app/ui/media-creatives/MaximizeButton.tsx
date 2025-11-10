import { Maximize4 } from "iconsax-react";

export default function MaximizeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-[48px] h-[40px] bg-white rounded-xl flex items-center justify-center"
    >
      <Maximize4 size="16" color="#000" />
    </button>
  );
}
