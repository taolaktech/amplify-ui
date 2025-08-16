import React from "react";

function ProgressBar({ width }: { width: number }) {
  return (
    <div className="h-[2px] z-10 right-0 w-full rounded-lg">
      <div
        className="bg-gradient h-[2px] rounded-lg"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;
