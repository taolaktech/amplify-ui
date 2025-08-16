import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

export default function BrandColors({
  brandColor,
  accentColor,
  setBrandColor,
  brandLabel = "Brand Colors",
  accentLabel = "Accent Color",
  isBrandAssets = false,
}: {
  brandColor: string;
  accentColor: string;
  setBrandColor: (key: "brandColor" | "accentColor", value: string) => void;
  brandLabel?: string;
  accentLabel?: string;
  isBrandAssets?: boolean;
}) {
  const [brandOpen, setBrandOpen] = useState(false);
  const brandColorPickerRef = useRef<HTMLDivElement | null>(null);
  const [accentOpen, setAccentOpen] = useState(false);
  const accentColorPickerRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  // const handleRgbaColorChange = (color: any, brand: boolean) => {
  //   console.log(color);
  //   if (brand) {
  //     setRgbaColorBrand(color);
  //     setBrandColor("brandColor", convertToString(color));
  //     console.log("convertToString(color)", convertToString(color));
  //   } else {
  //     setRgbaColorAccent(color);
  //     setBrandColor("accentColor", convertToString(color));
  //     console.log("convertToString(color)", convertToString(color));
  //   }
  // };

  useEffect(() => {
    if (accentOpen && accentColorPickerRef.current) {
      const rect = accentColorPickerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }

    if (brandOpen && brandColorPickerRef.current) {
      const rect = brandColorPickerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [brandOpen, accentOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accentColorPickerRef.current &&
        !accentColorPickerRef.current.contains(event.target as Node)
      ) {
        setAccentOpen(false);
        // setBrandOpen(false);
      }

      if (
        brandColorPickerRef.current &&
        !brandColorPickerRef.current.contains(event.target as Node)
      ) {
        setBrandOpen(false);
        // setAccentOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1">
      <div
        className={`w-full flex flex-col md:flex-row justify-between ${
          isBrandAssets ? "gap-4" : "gap-3"
        }`}
      >
        <div className="flex flex-col gap-2 w-full relative">
          <label className="text-xs">{brandLabel}</label>
          <div className="relative">
            <input
              placeholder="#000000"
              maxLength={7}
              className="h-[48px] 
                text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full px-4 block font-medium focus:outline-none"
              value={brandColor}
              onChange={(e) => setBrandColor("brandColor", e.target.value)}
            />
            <div
              onClick={() => setBrandOpen((prev) => !prev)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-[rgba(105,34,209,0.2)] rounded-full flex items-center justify-center"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: brandColor }}
              ></div>
            </div>
          </div>
          <div ref={brandColorPickerRef} className="w-full">
            {brandOpen && (
              <div
                className={`absolute ${
                  dropdownPosition === "top" ? "bottom-[250px]" : "top-full"
                } right-0  h-full z-20 custom-layout`}
              >
                <HexColorPicker
                  color={brandColor}
                  onChange={(color) => setBrandColor("brandColor", color)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full relative">
          <label className="text-xs">{accentLabel}</label>
          <div className="relative">
            <input
              placeholder="#FFFFFF"
              maxLength={7}
              className="h-[48px] 
                text-sm rounded-[20px] bg-[rgba(232,232,232,0.35)] w-full px-4 block font-medium focus:outline-none"
              value={accentColor}
              onChange={(e) => setBrandColor("accentColor", e.target.value)}
            />
            <div
              onClick={() => setAccentOpen((prev) => !prev)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-[rgba(0,0,0,0.2)] rounded-full flex items-center justify-center"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: accentColor }}
              ></div>
            </div>
          </div>
          <div className="w-full" ref={accentColorPickerRef}>
            {accentOpen && (
              <div
                className={`absolute ${
                  dropdownPosition === "top" ? "bottom-[250px]" : "top-full"
                } right-0  h-full z-20 custom-layout`}
              >
                <HexColorPicker
                  color={accentColor}
                  onChange={(color) => setBrandColor("accentColor", color)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
