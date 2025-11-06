import { useEffect, useState } from "react";
import { useUploadPhoto } from "./useUploadPhoto";
import { pdfjs } from "react-pdf";
import { useMutation } from "@tanstack/react-query";
import { postBrandAssets } from "../api/base";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import useBrandAssetStore from "../stores/brandAssetStore";
import { useSetupStore } from "../stores/setupStore";

export type PDFFile = string | File | null;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

export default function useBrandAssets() {
  const token = useAuthStore((state) => state.token);
  const setToast = useToastStore((state) => state.setToast);
  const { completeBrandAssets } = useSetupStore();
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
      // ✅ MARK BRAND ASSETS AS COMPLETE
      completeBrandAssets(true);

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
  };

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
  };
}
