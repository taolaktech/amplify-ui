import { useState } from "react";
import { useUploadPhoto } from "./useUploadPhoto";
// import { useToastStore } from "../stores/toastStore";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";
import { pdfjs } from "react-pdf";

// import type { PDFDocumentProxy } from "pdfjs-dist";
export type PDFFile = string | File | null;

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

// const resizeObserverOptions = {};

// const maxWidth = 800;

export default function useBrandAssets() {
  const {
    file: primaryLogoFile,
    preview: primaryLogoPreview,
    uploading: primaryLogoUploading,
    error: primaryLogoError,
    handleFileChange: primaryLogoHandleFileChange,
    uploadPhoto: primaryLogoUploadPhoto,
    reset: primaryLogoReset,
  } = useUploadPhoto();

  const {
    file: secondaryLogoFile,
    preview: secondaryLogoPreview,
    uploading: secondaryLogoUploading,
    error: secondaryLogoError,
    handleFileChange: secondaryLogoHandleFileChange,
    uploadPhoto: secondaryLogoUploadPhoto,
    reset: secondaryLogoReset,
  } = useUploadPhoto();

  const [primaryColor, setPrimaryColor] = useState<string>("#000000");
  const [secondaryColor, setSecondaryColor] = useState<string>("#FFFFFF");
  // const setToast = useToastStore((state) => state.setToast);
  // const [numPages, setNumPages] = useState<number | null>(null);

  const [primaryFont, setPrimaryFont] = useState<string | null>(null);
  const [secondaryFont, setSecondaryFont] = useState<string | null>(null);

  const [brandGuide, setBrandGuide] = useState<File | null>(null);
  const [toneOfVoice, setToneOfVoice] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "primaryColor") {
      setPrimaryColor(value);
    } else if (name === "secondaryColor") {
      setSecondaryColor(value);
    } else if (name === "primaryFont") {
      setPrimaryFont(value);
    } else if (name === "secondaryFont") {
      setSecondaryFont(value);
    } else if (name === "toneOfVoice") {
      setToneOfVoice(value);
    }
  };

  const handleFontChange = (key: string, value: string) => {
    if (key === "primaryFont") {
      setPrimaryFont(value);
    } else if (key === "secondaryFont") {
      setSecondaryFont(value);
    }
  };

  const handleBrandGuideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    const nextFile = files?.[0];

    if (nextFile) {
      setBrandGuide(nextFile);
    }
  };

  // function onDocumentLoadSuccess({
  //   numPages: nextNumPages,
  // }: PDFDocumentProxy): void {
  //   setNumPages(nextNumPages);
  // }

  const handleSubmit = () => {};

  return {
    primaryLogoFile,
    primaryLogoPreview,
    primaryLogoUploading,
    primaryLogoError,
    primaryLogoHandleFileChange,
    primaryLogoUploadPhoto,
    primaryLogoReset,
    secondaryLogoFile,
    secondaryLogoPreview,
    secondaryLogoUploading,
    secondaryLogoError,
    secondaryLogoHandleFileChange,
    secondaryLogoUploadPhoto,
    secondaryLogoReset,
    primaryColor,
    secondaryColor,
    primaryFont,
    secondaryFont,
    brandGuide,
    setBrandGuide,
    setPrimaryColor,
    setSecondaryColor,
    toneOfVoice,
    setToneOfVoice,
    handleChange,
    handleFontChange,
    handleSubmit,
    handleBrandGuideChange,
    // onDocumentLoadSuccess,
  };
}
