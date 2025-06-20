import React from "react";

export const cycle: Cycle[] = ["monthly", "quarterly", "yearly"];
export type Cycle = "monthly" | "quarterly" | "yearly";

const ModelHeader = ({
  selected,
  handleCycleChange,
}: {
  selected: Cycle;
  handleCycleChange: (cycle: Cycle) => void;
}) => {
  return (
    <div>
      <div className="w-full max-w-[564px] mx-auto py-2 px-2 flex gap-2 items-center justify-center bg-[#F6F6F6] rounded-xl mt-12">
        {cycle.map((item) => (
          <div
            key={item}
            onClick={() => handleCycleChange(item)}
            className={`cursor-pointer h-[46px] px-2 flex-shrink-0 flex-1 rounded-lg ${
              selected === item
                ? "bg-white custom-shadow-pricing-models"
                : "bg-transparent"
            } w-full flex items-center justify-center gap-2`}
          >
            {/* <span> */}
            <span
              className={`${
                selected === item ? "text-[#333]" : "text-[#999]"
              } font-medium text-sm `}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
            {item !== "monthly" && (
              <span
                className={`text-[8px] md:text-xs num font-bold tracking-[-0.2px] w-[40px] md:w-[56px] h-[24px] flex items-center justify-center rounded-3xl ${
                  item === "quarterly"
                    ? "bg-[#E8D9F9] text-purple-700"
                    : item === "yearly"
                    ? "text-[#268B4F] bg-[#BFE6CF]"
                    : ""
                }`}
              >
                {item === "quarterly"
                  ? "5% off"
                  : item === "yearly"
                  ? "15% off"
                  : ""}
              </span>
            )}
            {/* </span> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelHeader;
