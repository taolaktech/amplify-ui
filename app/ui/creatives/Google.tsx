// import { useAuthStore } from "@/app/lib/stores/authStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { roboto } from "../fonts";

export default function GoogleCreatives({
  storeLink,
  headline,
  description,
}: {
  storeLink?: string;
  headline: string;
  description: string;
}) {
  const storeUrl = useSetupStore((state) => state.connectStore.storeUrl);

  const link = storeLink || storeUrl;
  return (
    <div
      style={{ width: 350 }}
      className={`p-8 flex flex-col gap-2 bg-white rounded-3xl ${roboto.className}`}
    >
      <div className="flex gap-3 items-center ">
        <span className={`text-[#333] font-bold ${roboto.className}`}>Ad.</span>
        <span className={`text-sm ${roboto.className}`}>{link}</span>
      </div>
      <div className={`text-xl text-green-500 ${roboto.className}`}>
        {headline}
      </div>
      <div className={`text-sm ${roboto.className}`}>{description}</div>
    </div>
  );
}
