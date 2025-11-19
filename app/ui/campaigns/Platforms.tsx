import GoogleAdsIcon from "@/public/google_ads-small.svg";
import IGIcon from "@/public/ig-small.svg";
import FBIcon from "@/public/facebook-sm.svg";

export default function Platforms({ platform }: { platform: string[] }) {
  return (
    <div className="flex items-center gap-[2px]">
      {platform?.map((name) => (
        <PlatformItem key={name} name={name} />
      ))}
    </div>
  );
}

export function PlatformItem({ name }: { name: string }) {
  return (
    <span>
      {name === "GOOGLE" ? (
        <GoogleAdsIcon />
      ) : name === "FACEBOOK" ? (
        <FBIcon width={15} height={18} />
      ) : name === "INSTAGRAM" ? (
        <IGIcon />
      ) : null}
    </span>
  );
}
