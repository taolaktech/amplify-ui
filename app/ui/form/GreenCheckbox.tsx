import CheckIcon from "@/public/check.svg";

export function GreenCheckbox({
  ticked,
  borderWidth = 1.5,
  borderColor = "#535353",
}: {
  ticked: boolean;
  borderWidth?: number;
  borderColor?: string;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
      }}
      style={{
        borderWidth: `${borderWidth}px`,
        borderColor: ticked ? "#27ae60" : borderColor,
      }}
      className={`flex items-center justify-center cursor-pointer p-0 ${
        ticked ? "border-[#27ae60] bg-[#27ae60]" : " bg-inherit"
      } rounded-[5px] w-[16px] h-[16px]`}
    >
      {ticked && <CheckIcon width={10} height={10} fill="white" />}
    </button>
  );
}
