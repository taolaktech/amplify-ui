import CheckIcon from "@/public/tick-gradient-square.svg";

export default function GreenCheckbox({ ticked }: { ticked: boolean }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
      }}
      className={`flex items-center justify-center cursor-pointer ${
        ticked ? "" : "border-[1.5px] border-[#535353] bg-inherit"
      } rounded-[5px] w-[16px] h-[16px]`}
    >
      {ticked && <CheckIcon width={16} height={16} />}
    </button>
  );
}
