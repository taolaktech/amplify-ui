import { useAuthStore } from "@/app/lib/stores/authStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { roboto } from "../fonts";

export default function GoogleCreatives({
  storeLink,
  title,
  subText,
}: {
  storeLink?: string;
  title: string;
  subText: string;
}) {
  const storeUrl = useSetupStore((state) => state.connectStore.storeUrl);

  const link = storeLink || storeUrl;
  return (
    <div
      className={`p-8 flex flex-col gap-2 bg-white rounded-3xl ${roboto.className}`}
    >
      <div className="flex gap-3 items-center ">
        <span className={`text-[#333] font-bold ${roboto.className}`}>Ad.</span>
        <span className={`text-sm ${roboto.className}`}>{link}</span>
      </div>
      <div className={`text-xl text-green-500 ${roboto.className}`}>
        {title}
      </div>
      <div className={`text-sm ${roboto.className}`}>{subText}</div>
    </div>
  );
}
