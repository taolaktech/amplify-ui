import React from "react";

const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => {
  return (
    <button
      className={`cursor-pointer w-[33px] h-[20px] rounded-[64.514px] ${
        on ? "bg-[#34C759]" : "bg-[rgba(120,120,128,0.16)]"
      }`}
      onClick={toggle}
    >
      <span
        className={`toggle block w-[17.9px] h-[17.9px] bg-white duration-300 transition-transform rounded-full ${
          on ? "translate-x-[13.4px]" : "translate-x-[1.4px]"
        }`}
      ></span>
    </button>
  );
};

export default Toggle;
