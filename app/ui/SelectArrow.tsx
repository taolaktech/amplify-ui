import { ArrowDown2 } from "iconsax-react";

export default function SelectArrow({
  size = 16,
  color = "#333",
  isOpen = false,
}: {
  size?: number;
  color?: string;
  isOpen?: boolean;
}) {
  return (
    <button className={`${isOpen ? "rotate-180" : ""}`}>
      <ArrowDown2 size={size} color={color} />
    </button>
  );
}
