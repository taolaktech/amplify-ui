// import { useAuthStore } from "@/app/lib/stores/authStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { roboto } from "../fonts";

export default function GoogleCreatives({
  storeLink,
  headline,
  description,
  isThumbnail,
}: {
  storeLink?: string;
  headline: string;
  description: string;
  isThumbnail?: boolean;
}) {
  const storeUrl = useSetupStore((state) => state.connectStore.storeUrl);

  const link = storeLink || storeUrl;
  return (
    <div
      className={`flex ${
        isThumbnail
          ? "h-[42px] md:h-[102px] p-3 gap-[1px] w-full rounded-[3px] md:rounded-[9px]"
          : "h-[189px] md:h-[280px] p-6 w-full md:p-8 gap-2 md:gap-4 rounded-[12px] md:rounded-3xl"
      } items-start flex-col  bg-white  ${roboto.className}`}
    >
      <div className="flex gap-1 md:gap-3 items-center  ">
        <span
          className={`text-[#333] ${
            isThumbnail ? "text-[3px] md:text-[10px]" : "text-sm md:text-base"
          } font-bold ${roboto.className}`}
        >
          Ad.
        </span>
        <span
          className={`${
            isThumbnail ? "text-[2.64px] md:text-[8px]" : "text-sm md:text-sm "
          } ${roboto.className}`}
        >
          {link}
        </span>
      </div>
      <div
        className={`${
          isThumbnail
            ? "text-[3.64px] md:text-[10.77px]"
            : "text-lg md:text-2xl"
        } text-left  text-green-500 ${roboto.className}`}
      >
        {headline}
      </div>
      <div
        className={`${
          isThumbnail ? "text-[2.64px] md:text-[7px]" : "text-sm md:text-xl"
        } text-left ${roboto.className}`}
      >
        {description}
      </div>
    </div>
  );
}
