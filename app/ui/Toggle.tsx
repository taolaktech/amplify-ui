import React from "react";

const Toggle = ({
  on,
  toggle,
  large,
}: {
  on?: boolean;
  toggle: () => void;
  large?: boolean;
}) => {
  return (
    <button
      className={`cursor-pointer transition-all duration-300 ease-in-out w-[33px] h-[20px] rounded-[64.514px] ${
        large ? "w-[51px] h-[31px]" : ""
      } ${on ? "bg-[#34C759]" : "bg-[rgba(120,120,128,0.16)]"}`}
      onClick={toggle}
    >
      <span
        className={`toggle block w-[17.9px] h-[17.9px] bg-white duration-300 transition-transform rounded-full ${
          large ? "w-[27.9px] h-[27.9px]" : ""
        }
          ${
            on
              ? `${large ? "translate-x-[21.4px]" : "translate-x-[13.4px]"}`
              : "translate-x-[1.4px]"
          }
        `}
      ></span>
    </button>
  );
};

export default Toggle;
