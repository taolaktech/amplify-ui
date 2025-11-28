"use client";
import { useSetupStore } from "../stores/setupStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSubmitBusinessDetails } from "@/app/lib/hooks/useOnboardingHooks";
import { useUploadPhoto } from "./useUploadPhoto";
import { useMutation } from "@tanstack/react-query";
import { updateStoreLogo } from "../api/base";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

export const teamSize = ["Just me", "2-5", "6-10", "11-15", "15+"];
export const teamSizeValue = [
  { min: 1, max: 1 },
  { min: 2, max: 5 },
  { min: 6, max: 10 },
  { min: 11, max: 15 },
  { min: 16, max: 1000 },
];

export const useBusinessDetails = (isStoreDetails?: boolean) => {
  const defaultBusinessDetails = useSetupStore(
    (state) => state.businessDetails
  );
  const storeBusinessDetails = useSetupStore(
    (state) => state.storeBusinessDetails
  );
  const completeBusinessDetails = useSetupStore(
    (state) => state.completeBusinessDetails
  );
  const { preview, handleFileChange, file, uploadPhoto } = useUploadPhoto();
  const setToast = useToastStore((state) => state.setToast);

  const [productCategory, setProductCategory] = useState<string | null>(null);
  const [productCategoryError, setProductCategoryError] = useState(false);
  const [companyRole, setCompanyRole] = useState<string | null>(null);
  const [companyRoleError, setCompanyRoleError] = useState(false);
  const [teamSizeSelected, setTeamSizeSelected] = useState<number | null>(1);
  const token = useAuthStore((state) => state.token);
  const { storeLogo } = defaultBusinessDetails;

  const defaultDetails = {
    ...defaultBusinessDetails,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm({
    defaultValues: defaultDetails,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const handleSelectTeamSize = (text: string) => {
    const index = teamSize.findIndex((size) => size === text);
    setTeamSizeSelected(index !== -1 ? index : 1);
  };

  const { handleSubmitBusinessDetails, submitBusinessDetailsMutation } =
    useSubmitBusinessDetails(isStoreDetails);

  const { mutate: updateLogo, isPending } = useMutation({
    mutationFn: updateStoreLogo,
    mutationKey: ["updateStoreLogo"],
    onSuccess: (data) => {
      console.log("Logo updated successfully:", data);
      setToast({
        type: "success",
        title: "Logo Updated",
        message: "Store logo has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating logo:", error);
      setToast({
        type: "error",
        title: "Failed to update logo",
        message: "There was an error updating the logo.",
      });
    },
  });

  useEffect(() => {
    if (defaultBusinessDetails.industry) {
      setProductCategory(defaultBusinessDetails.industry);
    }
    if (defaultBusinessDetails.companyRole) {
      setCompanyRole(defaultBusinessDetails.companyRole);
    }
    const teamSizeIndex = teamSizeValue.findIndex(
      (size) => size.min === defaultBusinessDetails.teamSize.min
    );
    setTeamSizeSelected(teamSizeIndex !== -1 ? teamSizeIndex : 1);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (submitBusinessDetailsMutation.isSuccess) {
      setToast({
        type: "success",
        message: "Store details saved successfully!",
        title: "Saved",
      });
      console.log("Business details submitted successfully");
    }
  }, [submitBusinessDetailsMutation.isSuccess, setToast]);

  const handleAction = () => {
    if (!productCategory) setProductCategoryError(true);
    else setProductCategoryError(false);
    if (!companyRole) setCompanyRoleError(true);
    else setCompanyRoleError(false);
    handleSubmit(handleNext)();
  };

  const transformToBackendPayload = (
    formData: typeof defaultBusinessDetails
  ) => {
    return {
      companyName: formData.storeName,
      description: formData.description,
      website: formData.storeUrl,
      industry: productCategory ?? "",
      companyRole: companyRole ?? "",
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      teamSize: teamSizeValue[teamSizeSelected as number],
      estimatedMonthlyBudget: Number(formData.adSpendBudget),
      estimatedAnnualRevenue: Number(formData.annualRevenue),
    };
  };

  const handleNext = async (data: typeof defaultBusinessDetails) => {
    const backendPayload = transformToBackendPayload(data);

    console.log("=== DEBUG: Payload being sent to backend ===");
    console.log("Full payload:", JSON.stringify(backendPayload, null, 2));
    console.log("============================================");

    let storeLogoUrl = defaultBusinessDetails.storeLogo;

    // Use the preview (base64) as the store logo if a file was selected
    if (preview) {
      storeLogoUrl = preview;
    }

    // ✅ FIX: Update store with ALL data including the logo
    const updatedDetails = {
      ...defaultBusinessDetails,
      storeName: data.storeName,
      description: data.description,
      storeUrl: data.storeUrl,
      industry: productCategory ?? "",
      companyRole: companyRole ?? "",
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      teamSize: teamSizeValue[teamSizeSelected as number],
      adSpendBudget: Number(data.adSpendBudget),
      annualRevenue: Number(data.annualRevenue),
      storeLogo: storeLogoUrl, // ✅ Save the image (either base64 or existing URL)
    };

    // Update store optimistically
    storeBusinessDetails(updatedDetails);
    completeBusinessDetails(true);

    // Upload file if exists
    if (file && token) {
      updateLogo({
        token,
        businessLogo: file,
      });
    }

    // Then make the API call
    handleSubmitBusinessDetails(backendPayload);
  };

  return {
    register,
    handleSubmit,
    formState: { errors },
    productCategory,
    productCategoryError,
    companyRole,
    preview,
    handleFileChange,
    file,
    companyRoleError,
    teamSizeSelected,
    setProductCategory,
    setCompanyRole,
    setProductCategoryError,
    setCompanyRoleError,
    setTeamSizeSelected,
    handleAction,
    handleNext,
    isPending,
    storeLogo,
    defaultBusinessDetails,
    handleSelectTeamSize,
    submitBusinessDetailsMutation,
    reset: resetForm,
  };
};
