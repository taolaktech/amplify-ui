import React from "react";
import BrandColors from "../campaign-snapshots/BrandColors";

function ColorPalette({
  brandColor,
  accentColor,
  setPrimaryColor,
  setSecondaryColor,
}: {
  brandColor: string;
  accentColor: string;
  setPrimaryColor: (value: string) => void;
  setSecondaryColor: (value: string) => void;
}) {
  const handleBrandColors = (
    key: "brandColor" | "accentColor",
    value: string
  ) => {
    if (key === "brandColor") {
      setPrimaryColor(value);
    } else if (key === "accentColor") {
      setSecondaryColor(value);
    }
  };

  return (
    <div className="">
      <div className="text-heading font-medium text-sm mb-4">
        2. Color Palette
      </div>
      <BrandColors
        brandColor={brandColor}
        accentColor={accentColor}
        setBrandColor={handleBrandColors}
        brandLabel="Primary Colors - For buttons, links, and your main brand feel."
        accentLabel="Secondary Color - Used for supporting elements like tabs or outlines."
        isBrandAssets
      />
    </div>
  );
}

export default ColorPalette;
