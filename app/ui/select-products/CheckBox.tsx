import CheckIcon from "@/public/check-white.svg";

const CheckBox = ({ checked }: { checked: boolean }) => {
  return (
    <div className="md:w-[21px] md:h-[21px] bg-[#fff] rounded-[5px] flex items-center justify-center">
      <div
        className={`md:w-[18px] md:h-[18px] w-[20px] h-[20px]  rounded-[5px] border-[1.5px]  flex items-center justify-center ${
          checked ? "bg-gradient border-white" : "border-black"
        }`}
      >
        {/* <span className="w-[16px] h-[16px] bg-white rounded-[4px]"></span> */}
        {/* <img src="/check-white.svg" alt="check" className="w-[8px] h-[8px]" /> */}
        {checked && <CheckIcon width={9} height={9} fill="#fff" />}
      </div>
    </div>
  );
};

export default CheckBox;
