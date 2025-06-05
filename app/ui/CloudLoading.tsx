import { motion } from "motion/react";
import React from "react";
import CloudIcon from "@/public/cloud.svg";
import CloudIconSM from "@/public/cloud-sm.svg";

function CloudLoading({
  fetchingProgress,
  headingText,
  subText = "This might take a few minutes",
}: {
  fetchingProgress: number;
  headingText: string;
  subText: string;
}) {
  return (
    <div className="w-[90%] max-w-[467px] mx-auto flex-1 flex flex-col justify-center gap-4 md:gap-9 items-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <span className="hidden md:inline-block">
          <CloudIcon height={100} width={100} />
        </span>
        <span className="md:hidden">
          <CloudIconSM height={72} width={72} />
        </span>
      </motion.div>
      <div className="text-[#595959] text-sm md:text-base text-center -mt-2">
        {headingText}
      </div>

      <div>
        <div className="w-[289px] bg-[#E6E6E6] h-[3px] rounded-[2.5px]">
          <div
            className="bg-[#27AE60] h-[3px] rounded-[2.5px] transition-all duration-200"
            style={{
              width: `${fetchingProgress}%`,
            }}
          ></div>
        </div>
        <div className="text-center text-[#595959] mt-3 text-xs">{subText}</div>
      </div>
    </div>
  );
}

export default CloudLoading;
