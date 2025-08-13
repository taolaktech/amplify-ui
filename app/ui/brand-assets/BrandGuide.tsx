import { Dispatch, SetStateAction, useRef } from "react";
import SelectInput from "../form/SelectInput";
import PdfIcon from "@/public/pdf.svg";
import { DocumentDownload } from "iconsax-react";
// import Image from "next/image";
import { Document, Page } from "react-pdf";
import { options } from "@/app/lib/hooks/useBrandAssets";

const toneList = [
  "Friendly",
  "Bold",
  "Quirky",
  "Minimal",
  "Luxurious",
  "Professional",
];

export default function brandGuide({
  tone,
  brandGuide,
  handleToneChange,
  handleBrandGuideChange,
}: {
  tone: string | null;
  brandGuide: File | null;
  handleToneChange: Dispatch<SetStateAction<string | null>>;
  handleBrandGuideChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="">
      <div className="text-heading font-medium text-sm mb-4">
        4. Brand Guide
      </div>
      <div className="flex flex-col-reverse md:flex-row-reverse gap-4">
        <div className="w-full">
          <SelectInput
            placeholder="Select brand tone of voice"
            label="Tone of Voice"
            options={toneList}
            background="rgba(230, 230, 230, 0.25)"
            borderless
            setSelected={handleToneChange}
            selected={tone}
            large
          />
        </div>
        <div className="w-full max-w-full">
          <p className="text-xs tracking-tight block mb-2">
            Brand Book or Brand Guidelines
          </p>
          <div style={{ display: brandGuide ? "block" : "none" }}>
            <BrandGuidePreview
              brandGuide={brandGuide}
              handleBrandGuideChange={handleBrandGuideChange}
            />
          </div>

          <div style={{ display: brandGuide ? "none" : "block" }}>
            <NoBrand handleBrandGuideChange={handleBrandGuideChange} />
          </div>
          <canvas id="pdf-canvas" style={{ display: "none" }}></canvas>
        </div>
      </div>
    </div>
  );
}

const BrandGuidePreview = ({
  brandGuide,
  handleBrandGuideChange,
}: {
  brandGuide: File | null;
  handleBrandGuideChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadBtnClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  return (
    <div
      onClick={handleUploadBtnClick}
      className="w-full cursor-pointer h-[278px] flex flex-col gap-3 bg-[rgba(230,230,230,0.25)] rounded-[8px] p-4"
    >
      <div className="w-full h-[169px] bg-white max-h-[167px] max-w-full overflow-hidden relative">
        {/* <img src={null} id="pdf-thumbnail" alt="" height={200} /> */}
        <Document file={brandGuide} options={options} className="w-[100px]">
          <Page pageNumber={1} />
        </Document>
      </div>
      <div className="h-[69px] px-6 bg-white rounded-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <PdfIcon width={20} height={26} />
          <div
            className="md:text-lg tracking-600 max-w-[150px] lg:max-w-[200px] font-semibold
        overflow-hidden text-ellipsis whitespace-nowrap
        "
          >
            {brandGuide?.name}
          </div>
        </div>
        <div className="text-sm tracking-100">
          {brandGuide?.size ? (brandGuide?.size / (1024 * 1024)).toFixed(2) : 0}
          MB
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        onChange={handleBrandGuideChange}
      />
    </div>
  );
};

const NoBrand = ({
  handleBrandGuideChange,
}: {
  handleBrandGuideChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadBtnClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full h-[278px] bg-[rgba(230,230,230,0.25)] p-5 justify-center items-center flex flex-col rounded-[8px]">
      <div className="text-center text-xs text-[#595959] tracking-100 max-w-[277px] leading-[150%] mb-4">
        Please upload your brand book or brand guidelines in PDF, DOCX, or PPTX
        format. The file size should not exceed 30MB.
      </div>
      <button
        className="flex items-center gap-1 rounded-full justify-center py-3 px-4 bg-[#E6E6E6]"
        onClick={handleUploadBtnClick}
      >
        <DocumentDownload size={20} color="#000" />
        <span className="tracking-200 text-sm text-heading font-medium">
          Upload
        </span>
        <input
          type="file"
          className="hidden"
          ref={inputRef}
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={handleBrandGuideChange}
        />
      </button>
    </div>
  );
};
