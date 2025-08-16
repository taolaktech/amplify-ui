import Image from "next/image";
import PrimaryBrandExample from "@/public/brand-primary-logo-example.svg";
import SecondaryBrandExample from "@/public/brand-secondary-logo-example.svg";
import { ArrowForward, CloseCircle, GalleryImport } from "iconsax-react";
import { useRef } from "react";

type LogoProps = {
  primaryLogoPreview: string | null;
  primaryLogoHandleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  primaryLogoReset: () => void;
  secondaryLogoPreview: string | null;
  secondaryLogoHandleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  secondaryLogoReset: () => void;
}

export default function Logo({
  primaryLogoPreview,
  primaryLogoHandleFileChange,
  primaryLogoReset,
  secondaryLogoPreview,
  secondaryLogoHandleFileChange,
  secondaryLogoReset,
}: LogoProps) {
  return (
    <div className="">
      <div className="text-heading font-medium text-sm">1. Logos</div>
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex-1">
          <div className="text-xs text-[#595959]">Primary Logo</div>
          <div className="mt-2 bg-[rgba(230,230,230,0.25)] rounded-lg h-[320px] w-full flex flex-col items-center justify-center">
            {primaryLogoPreview ? (
              <Preview
                isPrimary
                preview={primaryLogoPreview}
                handleReset={primaryLogoReset}
                handleFileChange={primaryLogoHandleFileChange}
              />
            ) : (
              <NoPreview
                isPrimary
                handleFileChange={primaryLogoHandleFileChange}
              />
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-[#595959]">Secondary Logo</div>
          <div className="mt-2 bg-[rgba(230,230,230,0.25)] rounded-lg h-[320px] w-full flex flex-col items-center justify-center">
            {secondaryLogoPreview ? (
              <Preview
                preview={secondaryLogoPreview}
                handleReset={secondaryLogoReset}
                handleFileChange={secondaryLogoHandleFileChange}
              />
            ) : (
              <NoPreview handleFileChange={secondaryLogoHandleFileChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NoPreview({
  isPrimary,
  handleFileChange,
}: {
  isPrimary?: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-[301px]">
      {isPrimary ? (
        <PrimaryBrandExample width={122} height={95} />
      ) : (
        <SecondaryBrandExample width={122} height={95} />
      )}
      <div className="text-xs text-[#595959] mt-6 text-center tracking-100 leading-[150%]">
        Please upload your primary logo ({isPrimary ? "Light" : "Dark"}{" "}
        Background) in PNG, JPG, or SVG format. Ensure the file size does not
        exceed 10MB.
      </div>
      <div className="text-center mt-3">
        <button
          onClick={handleUploadBtnClick}
          className="h-[40px] w-[123px] text-sm md:text-base flex items-center gap-1 justify-center bg-[#E6E6E6] transition-all duration-300 hover:bg-[#E6E6E6]/80 rounded-full text-heading font-medium tracking-200"
        >
          <GalleryImport size="16" color="#000" /> <span>Upload</span>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden absolute top-0 left-0 w-8 h-8"
            ref={fileInputRef}
          />
        </button>
      </div>
    </div>
  );
}

function Preview({
  isPrimary,
  preview,
  handleReset,
  handleFileChange,
}: {
  isPrimary?: boolean;
  preview: string;
  handleReset: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`w-[205px] h-[205px] flex items-center rounded-lg justify-center ${
          isPrimary ? "bg-white" : "bg-black"
        }`}
      >
        <Image
          src={preview}
          alt="preview"
          width={109}
          height={109}
          className="rounded-[27px] object-cover object-center h-[109px] w-[109px]"
        />
      </div>
      <div className="flex items-center gap-2 justify-center mt-3">
        <button
          onClick={handleUploadBtnClick}
          className="bg-white px-4 py-2 rounded-full flex items-center gap-1"
        >
          <ArrowForward size="14" color="#555456" variant="Bold" className="" />
          <span className="text-xs">Re-Upload</span>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden absolute top-0 left-0 w-8 h-8"
            ref={fileInputRef}
          />
        </button>
        <button
          onClick={handleReset}
          className="bg-white px-4 py-2 rounded-full flex items-center gap-1"
        >
          <CloseCircle size="14" variant="Bold" color="#555456" />
          <span className="text-xs">Remove</span>
        </button>
      </div>
    </div>
  );
}
