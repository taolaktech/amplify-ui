"use client";
import Logo from "@/app/ui/brand-assets/Logo";
import FolderOpenIcon from "@/public/folder-open.svg";
import useBrandAssets from "@/app/lib/hooks/useBrandAssets";
import ColorPalette from "@/app/ui/brand-assets/ColorPalette";
import Fonts from "@/app/ui/brand-assets/Fonts";
import BrandGuide from "@/app/ui/brand-assets/BrandGuide";
import { TickCircle } from "iconsax-react";
import DefaultButton from "@/app/ui/Button";

export default function BrandAssetsPage() {
  const {
    primaryLogoPreview,
    primaryLogoHandleFileChange,
    primaryLogoReset,
    secondaryLogoPreview,
    secondaryLogoHandleFileChange,
    secondaryLogoReset,
    primaryColor,
    secondaryColor,
    handleFontChange,
    setPrimaryColor,
    setSecondaryColor,
    primaryFont,
    handleSubmit,
    secondaryFont,
    toneOfVoice,
    brandGuide,
    setToneOfVoice,
    handleBrandGuideChange,
  } = useBrandAssets();
  return (
    <div className="pb-4">
      <div className="flex gap-1 items-center">
        <FolderOpenIcon width={24} height={24} />
        <h1 className="text-lg tracking-250 heading font-bold">Brand Assets</h1>
      </div>
      <p className="text-sm tracking-60 text-[#555456]">
        View and manage your company brand’s assets
      </p>
      <div className="mt-12">
        <Logo
          primaryLogoPreview={primaryLogoPreview}
          primaryLogoHandleFileChange={primaryLogoHandleFileChange}
          primaryLogoReset={primaryLogoReset}
          secondaryLogoPreview={secondaryLogoPreview}
          secondaryLogoHandleFileChange={secondaryLogoHandleFileChange}
          secondaryLogoReset={secondaryLogoReset}
        />
      </div>
      <div className="mt-12">
        <ColorPalette
          brandColor={primaryColor}
          accentColor={secondaryColor}
          setPrimaryColor={setPrimaryColor}
          setSecondaryColor={setSecondaryColor}
        />
      </div>
      <div className="mt-12">
        <Fonts
          primaryFont={primaryFont}
          secondaryFont={secondaryFont}
          handleFontChange={handleFontChange}
        />
      </div>
      <div className="mt-12">
        <BrandGuide
          tone={toneOfVoice}
          brandGuide={brandGuide}
          handleToneChange={setToneOfVoice}
          handleBrandGuideChange={handleBrandGuideChange}
        />
      </div>

      <div className="sm:max-w-[205px] mx-auto mt-16 md:mt-20">
        <DefaultButton
          hasIconOrLoader
          text="Save Changes"
          height={49}
          action={handleSubmit}
          icon={<TickCircle size="16" color="#fff" variant="Bold" />}
        />
      </div>
    </div>
  );
}
