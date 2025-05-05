import CheckIcon from "@/public/check.svg";

export function GreenCheckbox({ ticked }: { ticked: boolean }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
      }}
      className={`flex items-center justify-center cursor-pointer p-0 ${
        ticked
          ? "border-[1.5px] border-[#27ae60] bg-[#27ae60]"
          : "border-[1.5px] border-[#535353] bg-inherit"
      } rounded-[5px] w-[16px] h-[16px]`}
    >
      {ticked && <CheckIcon width={10} height={10} fill="white" />}
    </button>
  );
}
