import { useEffect, useState } from "react";
import { useUploadPhoto } from "./useUploadPhoto";
// import { useToastStore } from "../stores/toastStore";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";
import { pdfjs } from "react-pdf";
import { useMutation } from "@tanstack/react-query";
import { postBrandAssets } from "../api/base";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import useBrandAssetStore from "../stores/brandAssetStore";
// import { useMutation } from "@tanstack/react-query";
// import { postBrandAssets } from "../api/base";

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
  const token = useAuthStore((state) => state.token);
  const setToast = useToastStore((state) => state.setToast);
  const {
    primaryLogo: currentPrimaryLogo,
    secondaryLogo: currentSecondaryLogo,
    primaryColor: currentPrimaryColor,
    secondaryColor: currentSecondaryColor,
    toneOfVoice: currentToneOfVoice,
    primaryFont: currentPrimaryFont,
    secondaryFont: currentSecondaryFont,
    brandGuide: currentBrandGuide,
    brandGuideName: currentBrandGuideName,
    // brandGuide: currentBrandGuide,
  } = useBrandAssetStore();
  const brandActions = useBrandAssetStore((state) => state.actions);
  const {
    setPrimaryLogo,
    setSecondaryLogo,
    setBrandGuide: storeBrandGuide,
  } = brandActions;

  const {
    file: primaryLogoFile,
    preview: primaryLogoPreview,
    uploading: primaryLogoUploading,
    error: primaryLogoError,
    handleFileChange: primaryLogoHandleFileChange,
    uploadPhoto: primaryLogoUploadPhoto,
    reset: primaryLogoReset,
  } = useUploadPhoto();

  const handlePrimaryLogoRemove = () => {
    setPrimaryLogo(null);
    primaryLogoReset();
  };

  const handleSecondaryLogoRemove = () => {
    setSecondaryLogo(null);
    secondaryLogoReset();
  };

  const {
    file: secondaryLogoFile,
    preview: secondaryLogoPreview,
    uploading: secondaryLogoUploading,
    error: secondaryLogoError,
    handleFileChange: secondaryLogoHandleFileChange,
    uploadPhoto: secondaryLogoUploadPhoto,
    reset: secondaryLogoReset,
  } = useUploadPhoto();

  const { mutate, isPending } = useMutation({
    mutationFn: postBrandAssets,
    mutationKey: ["postBrandAssets"],
    onSuccess: () => {
      setToast({
        title: "Brand Assets Updated.",
        message: "Your brand assets has been updated.",
        type: "success",
      });
    },
    onError: (error) => {
      console.error("Error posting brand assets:", error);
      setToast({
        title: "Error Occured.",
        message: "Something went wrong while updating brand assets.",
        type: "error",
      });
    },
  });

  function handleSubmitBrandAssets() {
    mutate({
      token: token ?? "",
      assets: {
        removePrimaryLogo: !currentPrimaryLogo && !primaryLogoPreview,
        removeSecondaryLogo: !currentSecondaryLogo && !secondaryLogoPreview,
        removeBrandGuide: !currentBrandGuide && !brandGuide,
        primaryColor: primaryColor || currentPrimaryColor,
        secondaryColor: secondaryColor || currentSecondaryColor,
        toneOfVoice: toneOfVoice || currentToneOfVoice || "Friendly",
        primaryFont: primaryFont || currentPrimaryFont || "Inter",
        secondaryFont: secondaryFont || currentSecondaryFont || "Inter",
        ...(brandGuide ? { brandGuide } : {}),
        ...(primaryLogoFile ? { primaryLogo: primaryLogoFile } : {}),
        ...(secondaryLogoFile ? { secondaryLogo: secondaryLogoFile } : {}),
      },
    });
  }

  const [primaryColor, setPrimaryColor] = useState<string>(currentPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState<string>(
    currentSecondaryColor
  );

  // const setToast = useToastStore((state) => state.setToast);
  // const [numPages, setNumPages] = useState<number | null>(null);

  const [primaryFont, setPrimaryFont] = useState<string | null>(
    currentPrimaryFont
  );
  const [secondaryFont, setSecondaryFont] = useState<string | null>(
    currentSecondaryFont
  );

  const [brandGuide, setBrandGuide] = useState<File | null>(null);
  const [toneOfVoice, setToneOfVoice] = useState<string | null>(
    currentToneOfVoice
  );

  useEffect(() => {
    setPrimaryColor(currentPrimaryColor);
    setSecondaryColor(currentSecondaryColor);
    setPrimaryFont(currentPrimaryFont);
    setSecondaryFont(currentSecondaryFont);
    setToneOfVoice(currentToneOfVoice);
  }, [
    currentPrimaryColor,
    currentSecondaryColor,
    currentPrimaryFont,
    currentSecondaryFont,
    currentToneOfVoice,
  ]);

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

  const handleRemoveBrandGuide = () => {
    setBrandGuide(null);
    storeBrandGuide(null);
    // setRemoveBrandGuide(true);
  };

  // function onDocumentLoadSuccess({
  //   numPages: nextNumPages,
  // }: PDFDocumentProxy): void {
  //   setNumPages(nextNumPages);
  // }

  return {
    primaryLogoFile,
    primaryLogoPreview,
    primaryLogoUploading,
    primaryLogoError,
    primaryLogoHandleFileChange,
    primaryLogoUploadPhoto,
    primaryLogoReset,
    handlePrimaryLogoRemove,
    handleSecondaryLogoRemove,
    handleRemoveBrandGuide,
    secondaryLogoFile,
    secondaryLogoPreview,
    secondaryLogoUploading,
    secondaryLogoError,
    secondaryLogoHandleFileChange,
    secondaryLogoUploadPhoto,
    secondaryLogoReset,
    currentBrandGuideName,
    primaryColor,
    secondaryColor,
    primaryFont,
    secondaryFont,
    brandGuide,
    setBrandGuide,
    setPrimaryColor,
    setSecondaryColor,
    toneOfVoice,
    currentBrandGuide,
    setToneOfVoice,
    handleChange,
    handleFontChange,
    handleBrandGuideChange,
    handleSubmitBrandAssets,
    isPending,
    currentPrimaryLogo,
    currentSecondaryLogo,
    // onDocumentLoadSuccess,
  };
}

// export default function useSubmitBr
