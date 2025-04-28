import CheckIcon from "@/public/check.svg";

export function GreenCheckbox({ ticked }: { ticked: boolean }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
      }}
      className={`flex items-center justify-center cursor-pointer p-0 ${
        ticked
          ? "border-0 bg-[#27ae60]"
          : "border-[1.4px] border-[#545454] bg-inherit"
      } rounded-md w-[16px] h-[16px]`}
    >
      {ticked && <CheckIcon width={10} height={10} fill="white" />}
    </button>
  );
}
