import GoogleAdsIcon from "@/public/google_ads-small.svg";
import IGIcon from "@/public/ig-small.svg";

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
        <IGIcon />
      ) : name === "INSTAGRAM" ? (
        <IGIcon />
      ) : null}
    </span>
  );
}
