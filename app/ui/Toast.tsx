"use client";

import {
  CalendarRemove,
  CloseSquare,
  InfoCircle,
  Magicpen,
  TickCircle,
} from "iconsax-react";
import { useToastStore } from "../lib/stores/toastStore";
import { useEffect } from "react";

export default function Toast() {
  const { toast, closeToast, active } = useToastStore((state) => state);

  let bgColor = "#F0E6FB";
  let borderColor = "#EAF7EF";
  let titleColor = "#1F2937";

  let icon = <TickCircle size="24" color="#27AE60" variant="Bold" />;
  switch (toast?.type) {
    case "success":
      bgColor = "#EAF7EF";
      titleColor = "#103D23";
      borderColor = "#27AE60";
      icon = <TickCircle size="24" color="#27AE60" variant="Bold" />;
      break;
    case "error":
      bgColor = "#FFECED";
      titleColor = "#59181B";
      borderColor = "#FF4949";
      icon = <CalendarRemove size="24" color="#FF4949" variant="Bold" />;
      break;
    case "warning":
      bgColor = "#FEF5EA";
      titleColor = "#57360F";
      borderColor = "#FA9B0C";
      icon = <Magicpen size="24" color="#FA9B0C" variant="Bold" />;
      break;
    case "info":
      bgColor = "#F0E6FB";
      titleColor = "#1D0B30";
      borderColor = "#A755FF";
      icon = <InfoCircle size="24" color="#A755FF" variant="Bold" />;
      break;
    default:
      bgColor = "#F0E6FB";
      titleColor = "#1D0B30";
      borderColor = "#A755FF";
      icon = <InfoCircle size="24" color="#A755FF" variant="Bold" />;
      break;
  }

  useEffect(() => {
    if (active) {
      setTimeout(() => {
        closeToast();
      }, 5000);
    }
  }, [active]);

  return (
    <div
      className={`p-4 rounded-xl flex translate-x-1/2  md:translate-x-0 justify-between items-start gap-3 fixed z-[1000] top-5 transition-all duration-500 ease-in-out ${
        active
          ? "right-[50%] md:right-[24px]"
          : "top-[-1000px] md:top-5 right-[50%] md:-right-full"
      } border w-[356px] md:w-[436px]`}
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <p
              className="md:text-xl  font-medium"
              style={{ color: titleColor }}
            >
              {toast?.title}
            </p>
          </div>
        </div>
        <p className="text-sm  pl-2" style={{}}>
          {toast?.message}
        </p>
      </div>
      <button onClick={closeToast}>
        <CloseSquare size="32" color="#1F2937" variant="Outline" />
      </button>
    </div>
  );
}
