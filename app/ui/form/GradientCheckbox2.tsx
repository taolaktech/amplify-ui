import CheckWhiteIcon from "@/public/check-white.svg";

export default function GradientCheckbox({ ticked }: { ticked: boolean }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
      }}
      className={`flex items-center justify-center cursor-pointer ${
        ticked ? "bg-gradient" : "border-[1.5px] border-[#535353] bg-inherit"
      } rounded-[5px] w-[16px] h-[16px]`}
    >
      {ticked && <CheckWhiteIcon fill="white" width={8} height={10} />}
    </button>
  );
}
