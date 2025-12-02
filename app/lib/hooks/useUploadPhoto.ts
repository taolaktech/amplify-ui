import { useState } from "react";
import { useToastStore } from "../stores/toastStore";

type UseUploadPhotoReturn = {
  file: File | null;
  preview: string | null;
  uploading: boolean;
  error: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadPhoto: (uploadUrl: string) => Promise<string | null>;
  reset: () => void;
};

export function useUploadPhoto(
  onFileChange?: () => void
): UseUploadPhotoReturn {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const setToast = useToastStore((state) => state.setToast);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const maxSizeMB = 30; // set max size here
    if (selectedFile && selectedFile.size > maxSizeMB * 1024 * 1024) {
      setToast({
        title: "File too large!",
        message: `Max size is ${maxSizeMB}MB.`,
        type: "error",
      });
      e.target.value = ""; // Clear the input
      return;
    }
    if (!selectedFile) return;
    setIsDirty(true);

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const uploadPhoto = async (uploadUrl: string): Promise<string | null> => {
    if (!file) {
      setError("No file selected");
      return null;
    }
    if (!isDirty) return null;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setToast({
          title: "Upload failed!",
          message: "Upload failed.",
          type: "error",
        });
        return null;
      }

      // ✅ FIX: Get the uploaded image URL from response
      const result = await response.json();
      const imageUrl = result.url || result.imageUrl || result.data?.url;

      if (imageUrl) {
        setToast({
          title: "Upload successful!",
          message: "Image uploaded successfully.",
          type: "success",
        });
        return imageUrl;
      } else {
        // If no URL in response, return the base64 preview as fallback
        return preview;
      }
    } catch (err: any) {
      setToast({
        title: "Upload failed!",
        message: "Upload failed.",
        type: "error",
      });
      console.log(err);
      // Return preview as fallback if upload fails
      return preview;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return {
    file,
    preview,
    uploading,
    error,
    handleFileChange,
    uploadPhoto,
    reset,
  };
}
