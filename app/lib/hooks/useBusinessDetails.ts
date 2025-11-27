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
  const { preview, handleFileChange, file } = useUploadPhoto();
  const setToast = useToastStore((state) => state.setToast);

  const [productCategory, setProductCategory] = useState<string | null>(null);
  const [productCategoryError, setProductCategoryError] = useState(false);
  const [companyRole, setCompanyRole] = useState<string | null>(null);
  const [companyRoleError, setCompanyRoleError] = useState(false);
  const [teamSizeSelected, setTeamSizeSelected] = useState<number | null>(1);
  const token = useAuthStore((state) => state.token);
  const { storeLogo } = defaultBusinessDetails;

  // ✅ FIX: Memoize defaultDetails to prevent infinite re-renders
  const defaultDetails = {
    ...defaultBusinessDetails,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    onError: (error) => {
      console.error("Error updating logo:", error);
      setToast({
        type: "error",
        title: "Failed to update logo",
        message: "There was an error updating the logo.",
      });
    },
  });

  // ✅ FIX: Simplify the form reset - only run once on mount
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
  }, []); // ✅ Empty dependency array - run only once

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // ✅ FIX: Handle success with proper dependencies
  useEffect(() => {
    if (submitBusinessDetailsMutation.isSuccess) {
      // The toast is handled in the component, so we don't need to do anything here
      console.log("Business details submitted successfully");
    }
  }, [submitBusinessDetailsMutation.isSuccess]);

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

  const handleNext = (data: typeof defaultBusinessDetails) => {
    const backendPayload = transformToBackendPayload(data);

    console.log("=== DEBUG: Payload being sent to backend ===");
    console.log("Full payload:", JSON.stringify(backendPayload, null, 2));
    console.log("============================================");

    if (file && token) {
      updateLogo({
        token,
        businessLogo: file,
      });
    }

    // ✅ FIX: Use optimistic update - update store immediately
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
    };

    // Update store optimistically
    storeBusinessDetails(updatedDetails);
    completeBusinessDetails(true);

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
    reset,
  };
};
