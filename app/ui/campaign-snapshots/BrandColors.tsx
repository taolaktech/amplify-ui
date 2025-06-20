export default function BrandColors({
  brandColor,
  accentColor,
  setBrandColor,
}: {
  brandColor: string;
  accentColor: string;
  setBrandColor: (key: "brandColor" | "accentColor", value: string) => void;
}) {
  return (
    <div className="flex-1">
      <div className="w-full flex justify-between gap-3">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs">Brand Colors</label>
          <div className="relative">
            <input
              placeholder="#000000"
              maxLength={7}
              className="h-[48px] 
                text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full px-4 block font-medium focus:outline-none"
              value={brandColor}
              onChange={(e) => setBrandColor("brandColor", e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-[rgba(105,34,209,0.2)] rounded-full flex items-center justify-center">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: brandColor }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs">Accent Color</label>
          <div className="relative">
            <input
              placeholder="#FFFFFF"
              maxLength={7}
              className="h-[48px] 
                text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full px-4 block font-medium focus:outline-none"
              value={accentColor}
              onChange={(e) => setBrandColor("accentColor", e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-[rgba(0,0,0,0.2)] rounded-full flex items-center justify-center">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: accentColor }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
