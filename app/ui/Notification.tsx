import { Notification as NotificationIcon } from "iconsax-react";

export default function Notification() {
  return (
    <button className="relative h-[24px] w-[24px] md:h-[32px] md:w-[32px] flex items-center justify-center rounded-full bg-[#F3EFF6] hover:bg-[#f3eff6] transition-all duration-200 ease-in-out">
      <span className="relative">
        <NotificationIcon size="20" color="#333333" />
        <span className="absolute top-[-2px] right-[-2px] bg-red-500 text-white text-xs font-bold rounded-full w-3 h-3 flex items-center justify-center"></span>
      </span>
    </button>
  );
}
